"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, StoreContextType } from '../types';
import { db } from '../lib/firebase';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    getDocs,
    setDoc
} from 'firebase/firestore';

const defaultProducts: Product[] = [
    {
        id: '1',
        title: 'Camisa Minimalista JLV',
        description: 'Camisa de alta calidad con diseño exclusivo JLV.',
        price: 450,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500',
        category: 'Ropa',
        sizes: ['S', 'M', 'L', 'XL'],
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
        sizes: ['S', 'M', 'L', 'XL'],
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
    const [loading, setLoading] = useState(true);

    // Sync Products with Firestore
    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData: Product[] = [];
            snapshot.forEach((doc) => {
                productsData.push({ id: doc.id, ...doc.data() } as Product);
            });

            if (productsData.length === 0 && loading) {
                // If firestore is empty and it's the first load, seed with defaults
                seedDefaults();
            } else {
                setProducts(productsData);
                setLoading(false);
            }
        }, (error) => {
            console.error("Error fetching products from Firestore:", error);
            // Fallback to defaults if Firestore fails (e.g. invalid config)
            setProducts(defaultProducts);
            setLoading(false);
        });

        // Load Cart from localStorage
        const storedCart = localStorage.getItem('jlv_cart');
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Error parsing cart:", e);
            }
        }

        return () => unsubscribe();
    }, []);

    const seedDefaults = async () => {
        try {
            for (const p of defaultProducts) {
                const { id, ...data } = p;
                await setDoc(doc(db, 'products', id), data);
            }
        } catch (e) {
            console.error("Error seeding defaults:", e);
            setProducts(defaultProducts);
            setLoading(false);
        }
    };

    // Save Cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('jlv_cart', JSON.stringify(cart));
    }, [cart]);

    const addProduct = async (product: Product) => {
        try {
            const { id, ...data } = product;
            await addDoc(collection(db, 'products'), {
                ...data,
                createdAt: new Date().toISOString()
            });
        } catch (e) {
            console.error("Error adding product:", e);
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        try {
            const productRef = doc(db, 'products', id);
            await updateDoc(productRef, updates);
        } catch (e) {
            console.error("Error updating product:", e);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'products', id));
        } catch (e) {
            console.error("Error deleting product:", e);
        }
    };

    const addToCart = (product: Product, quantity: number = 1, selectedSize?: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.selectedSize === selectedSize);
            if (existing) {
                return prev.map(item => (item.id === product.id && item.selectedSize === selectedSize)
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                );
            }
            return [...prev, { ...product, quantity, selectedSize }];
        });
    };

    const removeFromCart = (id: string, selectedSize?: string) => {
        setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === selectedSize)));
    };

    const updateCartQuantity = (id: string, quantity: number, selectedSize?: string) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item => (item.id === id && item.selectedSize === selectedSize)
            ? { ...item, quantity }
            : item
        ));
    };

    const clearCart = () => setCart([]);

    const loginAdmin = () => setIsAdmin(true);
    const logoutAdmin = () => setIsAdmin(false);

    const applyBulkPriceUpdate = async (percentage: number) => {
        const factor = 1 + (percentage / 100);
        for (const p of products) {
            await updateProduct(p.id, {
                price: Math.round(p.price * factor)
            });
        }
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
