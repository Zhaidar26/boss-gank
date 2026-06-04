import { create } from "zustand";
import { persist } from "zustand/middleware"; // 1. Import middleware persist

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  userId: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (userId: string, product: { id: number; name: string; price: number; image: string }) => void;
  minusQuantity: (userId: string, productId: number) => void;
  removeFromCart: (userId: string, productId: number) => void;
  clearCart: (userId: string) => void;
}

// 2. Bungkus store Anda dengan fungsi persist()
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (userId, product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id && item.userId === userId);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id && item.userId === userId ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1, userId }], };
        }),

      minusQuantity: (userId, productId) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === productId && item.userId === userId
          );

          if (existingItem && existingItem.quantity > 1) {
            return {
              cart: state.cart.map((item) =>
                item.id === productId && item.userId === userId ? { ...item, quantity: item.quantity - 1 } : item
              ),
            };
          }
          return {
            cart: state.cart.filter(
              (item) => !(item.id === productId && item.userId === userId)
            ),
          };
        }),

      removeFromCart: (userId, productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id === productId && item.userId === userId),
        })),

      clearCart: (userId) => set((state) => ({ cart: state.cart.filter((item) => item.userId !== userId), })),
    }),
    {
      name: "matcha-cart-storage", // Nama kunci unik di localStorage browser Anda
    }
  )
);