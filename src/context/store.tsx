"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, StoreContextType } from '../types';

const defaultProducts: Product[] = [
    {
        id: '1',
        title: 'Camisa Minimalista JLV',
        description: 'Camisa de alta calidad con diseño exclusivo JLV.',
        price: 450,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500',
        category: 'Ropa',
        soldCount: 120,
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Gorra Urbana',
        description: 'Estilo urbano y moderno para tu día a día.',
        price: 250,
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=500',
        category: 'Accesorios',
        soldCount: 85,
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Hoodie Premium',
        description: 'Comodidad y estilo en una sola prenda.',
        price: 800,
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=500',
        category: 'Ropa',
        soldCount: 200,
        createdAt: new Date().toISOString(),
    },
    {
        id: '4',
        title: 'Taza JLV Edición Limitada',
        description: 'Disfruta tu café con estilo.',
        price: 150,
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=500',
        category: 'Hogar',
        soldCount: 45,
        createdAt: new Date().toISOString(),
    },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    // Load initial data with error handling
    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem('jlv_products');
            const storedCart = localStorage.getItem('jlv_cart');

            if (storedProducts) {
                const parsed = JSON.parse(storedProducts);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setProducts(parsed);
                } else {
                    setProducts(defaultProducts);
                }
            } else {
                setProducts(defaultProducts); // Seed initial data
            }

            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                }
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            setProducts(defaultProducts);
            setCart([]);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (products.length > 0) localStorage.setItem('jlv_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('jlv_cart', JSON.stringify(cart));
    }, [cart]);

    const addProduct = (product: Product) => {
        setProducts([...products, product]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateCartQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    };

    const clearCart = () => setCart([]);

    const loginAdmin = () => setIsAdmin(true);
    const logoutAdmin = () => setIsAdmin(false);

    const applyBulkPriceUpdate = (percentage: number) => {
        const factor = 1 + (percentage / 100);
        setProducts(products.map(p => ({
            ...p,
            price: Math.round(p.price * factor)
        })));
    };

    return (
        <StoreContext.Provider value={{
            products,
            cart,
            isAdmin,
            addProduct,
            updateProduct,
            deleteProduct,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
            loginAdmin,
            logoutAdmin,
            applyBulkPriceUpdate
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
