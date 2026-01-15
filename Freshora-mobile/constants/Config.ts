export const API_BASE_URL = "http://192.168.100.10:4000/api";

export const ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    PRODUCTS: "/products",
    CATEGORIES: "/categories",
    CART: "/cart",
    ORDERS: "/orders",
    PROFILE: "/profile",
};

export const STATUS_TRANSLATION: Record<string, string> = {
    pending: "Menunggu Pembayaran",
    processing: "Sedang Diproses",
    shipped: "Sedang Dikirim",
    delivered: "Selesai",
    cancelled: "Dibatalkan"
};
