export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    soldCount: number;
    createdAt: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    customerName?: string;
    date: string;
    status: 'pending' | 'completed';
}

export interface StoreContextType {
    products: Product[];
    cart: CartItem[];
    isAdmin: boolean;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    updateCartQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    loginAdmin: () => void;
    logoutAdmin: () => void;
    applyBulkPriceUpdate: (percentage: number) => void;
}
