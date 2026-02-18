export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    sizes?: string[];
    soldCount: number;
    createdAt: string;
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
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
    addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
    removeFromCart: (id: string, selectedSize?: string) => void;
    updateCartQuantity: (id: string, quantity: number, selectedSize?: string) => void;
    clearCart: () => void;
    loginAdmin: () => void;
    logoutAdmin: () => void;
    applyBulkPriceUpdate: (percentage: number) => void;
}
