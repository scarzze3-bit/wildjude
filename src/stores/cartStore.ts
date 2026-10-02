// Jude Safaris and Adventures - Merch Cart Store (Zustand)
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQty: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const itemKey = (item: { id: string; size?: string; color?: string }) =>
  `${item.id}::${item.size ?? ""}::${item.color ?? ""}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) =>
        set((state) => {
          const key = itemKey(newItem);
          const existing = state.items.find((i) => itemKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i) === key ? { ...i, quantity: Math.min(i.quantity + 1, 10) } : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),
      removeItem: (id, size, color) =>
        set((state) => ({
          items: state.items.filter((i) => itemKey(i) !== itemKey({ id, size, color })),
        })),
      updateQty: (id, quantity, size, color) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => itemKey(i) !== itemKey({ id, size, color }))
              : state.items.map((i) =>
                  itemKey(i) === itemKey({ id, size, color }) ? { ...i, quantity } : i
                ),
        })),
      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "jude-safaris-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
