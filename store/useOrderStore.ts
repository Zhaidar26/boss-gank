import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Order {
    id: string;
    customer: {
        name: string;
        phone: number;
        address: string;
        notes?: string;
    };
    items: {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }[];
    total: number;
    paymentMethod: "midtrans" | "whatsapp";
    status: "pending" | "processing" | "success" | "failed";
    date: string;
}

interface OrderStoreState {
    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrderStatus: (id: string, status: Order["status"]) => void;
}

export const useOrderStore = create<OrderStoreState>()(
    persist(
        (set) => ({
            orders: [],

            addOrder: (newOrder) =>
                set((state) => ({
                    orders: [newOrder, ...(state.orders || [])],
                })),

            updateOrderStatus: (id, status) =>
                set((state) => ({
                    orders: (state.orders || []).map((order) =>
                        order.id === id ? { ...order, status } : order
                    ),
                })),
        }),
        {
            name: "boss-gank-orders-storage",
        }
    )
);