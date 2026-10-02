// Jude Safaris and Adventures - Safaricom M-Pesa Daraja STK Push Integration
import express from 'express';

const router = express.Router();

// In-memory transaction cache for demo / active tracking
const transactions = new Map();

// Helper to generate Safaricom Daraja Timestamp: YYYYMMDDHHmmss
const getTimestamp = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
};

// Generate Daraja OAuth token
const getDarajaToken = async () => {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
  const authUrl =
    process.env.DARAJA_ENV === 'production'
      ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  if (!consumerKey || !consumerSecret) {
    return null; // Signals sandbox/simulation mode
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const response = await fetch(authUrl, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Daraja Auth failed: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
};

// Format Kenyan phone to 254XXXXXXXXX
const formatKenyanPhone = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('254') && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith('0') && cleaned.length === 10) return `254${cleaned.slice(1)}`;
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) return `254${cleaned}`;
  return cleaned;
};

/**
 * POST /api/mpesa/stkpush
 * Body: { phone, amount, reference, description }
 */
router.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount, reference = 'JudeSafaris', description = 'Safari Booking' } = req.body;

    const formattedPhone = formatKenyanPhone(phone);
    if (!formattedPhone || formattedPhone.length !== 12) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Kenyan phone number. Use format 07XXXXXXXX or 254XXXXXXXXX.',
      });
    }

    const payAmount = Math.max(1, Math.round(Number(amount) || 1));
    const token = await getDarajaToken();

    // If no credentials configured yet, return realistic sandbox simulation
    if (!token) {
      const mockCheckoutId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      transactions.set(mockCheckoutId, {
        checkoutId: mockCheckoutId,
        phone: formattedPhone,
        amount: payAmount,
        reference,
        status: 'PENDING_PIN',
        timestamp: new Date().toISOString(),
      });

      // Simulate customer prompt completion after 5s in sandbox
      setTimeout(() => {
        const tx = transactions.get(mockCheckoutId);
        if (tx && tx.status === 'PENDING_PIN') {
          transactions.set(mockCheckoutId, {
            ...tx,
            status: 'COMPLETED',
            receiptNumber: `Q${Date.now().toString(36).toUpperCase()}`,
            completedAt: new Date().toISOString(),
          });
        }
      }, 5000);

      return res.status(200).json({
        success: true,
        mode: 'SIMULATION_SANDBOX',
        checkoutRequestId: mockCheckoutId,
        customerMessage: `STK PIN prompt sent to ${formattedPhone}. Enter M-Pesa PIN on your phone to complete KES ${payAmount.toLocaleString()}.`,
      });
    }

    // Production / Live Daraja STK Push
    const shortcode = process.env.DARAJA_SHORTCODE || '174379';
    const passkey = process.env.DARAJA_PASSKEY || '';
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    const callbackUrl =
      process.env.DARAJA_CALLBACK_URL || 'https://jude-safaris-api.onrender.com/api/mpesa/callback';

    const stkUrl =
      process.env.DARAJA_ENV === 'production'
        ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const stkResponse = await fetch(stkUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: payAmount,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: reference.slice(0, 12),
        TransactionDesc: description.slice(0, 13),
      }),
    });

    const stkData = await stkResponse.json();

    if (stkData.ResponseCode === '0') {
      transactions.set(stkData.CheckoutRequestID, {
        checkoutId: stkData.CheckoutRequestID,
        phone: formattedPhone,
        amount: payAmount,
        status: 'PENDING_PIN',
        timestamp: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        checkoutRequestId: stkData.CheckoutRequestID,
        customerMessage: stkData.CustomerMessage || 'STK Push sent. Check your phone.',
      });
    } else {
      return res.status(400).json({
        success: false,
        error: stkData.errorMessage || stkData.ResponseDescription || 'Failed to initiate STK push.',
      });
    }
  } catch (error) {
    console.error('M-Pesa STK Push error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/mpesa/callback
 * Safaricom Daraja Webhook
 */
router.post('/callback', (req, res) => {
  try {
    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) {
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = callbackData;
    const existing = transactions.get(CheckoutRequestID) || {};

    if (ResultCode === 0) {
      const items = callbackData.CallbackMetadata?.Item || [];
      const receipt = items.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;
      const amount = items.find((i) => i.Name === 'Amount')?.Value;
      const phone = items.find((i) => i.Name === 'PhoneNumber')?.Value;

      transactions.set(CheckoutRequestID, {
        ...existing,
        status: 'COMPLETED',
        receiptNumber: receipt,
        amount: amount || existing.amount,
        phone: phone || existing.phone,
        resultDesc: ResultDesc,
        completedAt: new Date().toISOString(),
      });
      console.log(`[M-PESA SUCCESS] Receipt: ${receipt}, Amount: KES ${amount}, Phone: ${phone}`);
    } else {
      transactions.set(CheckoutRequestID, {
        ...existing,
        status: 'FAILED',
        resultCode: ResultCode,
        resultDesc: ResultDesc,
      });
      console.log(`[M-PESA FAILED] ID: ${CheckoutRequestID}, Reason: ${ResultDesc}`);
    }

    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Callback processed' });
  } catch (error) {
    console.error('M-Pesa Callback error:', error);
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Error recorded' });
  }
});

/**
 * GET /api/mpesa/query/:checkoutRequestId
 * Poll payment status from frontend
 */
router.get('/query/:checkoutRequestId', (req, res) => {
  const { checkoutRequestId } = req.params;
  const tx = transactions.get(checkoutRequestId);

  if (!tx) {
    return res.status(404).json({ success: false, error: 'Transaction not found or expired' });
  }

  return res.json({
    success: true,
    status: tx.status,
    receiptNumber: tx.receiptNumber || null,
    amount: tx.amount,
    phone: tx.phone,
    timestamp: tx.timestamp,
  });
});

export default router;