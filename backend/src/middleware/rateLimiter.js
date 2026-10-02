// Jude Safaris and Adventures - In-Memory Sliding-Window Rate Limiter & Security Headers

const ipRequests = new Map();

/**
 * Creates a rate limiting middleware
 * @param {object} options
 * @param {number} options.windowMs - Time frame in milliseconds (e.g. 15 * 60 * 1000 for 15m)
 * @param {number} options.max - Max number of requests allowed in windowMs
 * @param {string} options.message - Error message when rate limit exceeded
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP. Please try again later.',
} = {}) => {
  return (req, res, next) => {
    // Extract client IP (respecting proxy)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';

    const now = Date.now();
    let clientData = ipRequests.get(ip);

    if (!clientData) {
      clientData = { timestamps: [] };
      ipRequests.set(ip, clientData);
    }

    // Filter out timestamps outside window
    clientData.timestamps = clientData.timestamps.filter((ts) => now - ts < windowMs);

    if (clientData.timestamps.length >= max) {
      const oldest = clientData.timestamps[0];
      const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: retryAfter,
      });
    }

    clientData.timestamps.push(now);
    next();
  };
};

// Periodic cleanup to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  const maxRetention = 60 * 60 * 1000;
  for (const [ip, data] of ipRequests.entries()) {
    data.timestamps = data.timestamps.filter((ts) => now - ts < maxRetention);
    if (data.timestamps.length === 0) {
      ipRequests.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Basic security headers middleware (replaces heavy helmet package)
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.removeHeader('X-Powered-By');
  next();
};