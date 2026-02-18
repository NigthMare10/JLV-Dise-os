"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/context/store';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from '@/components/ui/Toast';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(
        product.category === 'Ropa' && product.sizes?.length ? product.sizes[0] : undefined
    );
    const [showToast, setShowToast] = useState(false);

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize);
        setShowToast(true);
        // Reset quantity after adding
        setQuantity(1);
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -5 }}
                className="group relative border rounded-2xl overflow-hidden bg-card hover:shadow-2xl transition-all duration-500 flex flex-col h-full border-gray-100 dark:border-gray-800"
            >
                <div className="aspect-square relative overflow-hidden bg-secondary/30 w-full group-hover:scale-105 transition-transform duration-700">
                    <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                </div>

                <div className="p-5 space-y-4 flex flex-col flex-grow">
                    <div className="space-y-1">
                        <div className="flex justify-between items-start italic text-[10px] text-muted-foreground uppercase tracking-widest">
                            <span>{product.category}</span>
                            {product.soldCount > 50 && <span className="text-orange-500 font-bold">Best Seller</span>}
                        </div>
                        <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                    </div>

                    {/* Sizes selection for Ropa */}
                    {product.category === 'Ropa' && product.sizes && product.sizes.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-gray-400">Tallas</p>
                            <div className="flex flex-wrap gap-1.5">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${selectedSize === size
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 text-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-muted-foreground text-sm line-clamp-2 flex-grow leading-relaxed">{product.description}</p>

                    <div className="space-y-4 pt-4 mt-auto border-t border-gray-50 dark:border-gray-900">
                        <div className="flex items-center justify-between">
                            <span className="font-black text-2xl tracking-tighter">L. {product.price.toFixed(2)}</span>

                            <div className="flex items-center bg-secondary/50 rounded-xl p-1 border border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="font-bold w-8 text-center text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="p-1.5 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link href={`/product?id=${product.id}`} className="flex-1">
                                <Button variant="outline" className="w-full rounded-xl cursor-pointer hover:bg-secondary font-semibold transition-all">
                                    Ver
                                </Button>
                            </Link>
                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 rounded-xl cursor-pointer shadow-lg shadow-primary/20 font-bold transition-all hover:scale-[1.02]"
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Agregar
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <Toast
                isOpen={showToast}
                onClose={() => setShowToast(false)}
                message={`${quantity}x ${product.title} ${selectedSize ? `(Talla ${selectedSize})` : ''} agregado al carrito`}
            />
        </>
    );
}

