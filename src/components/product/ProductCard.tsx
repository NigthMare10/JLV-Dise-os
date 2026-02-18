"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button'; // Fixed import path
import { useStore } from '@/context/store';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useStore();

    return (
        <div className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <div className="aspect-square relative overflow-hidden bg-secondary/50 w-full">
                {/* Use optimized image or placeholder */}
                <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="p-4 space-y-2 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between pt-4 mt-auto">
                    <span className="font-bold text-xl">L. {product.price.toFixed(2)}</span>
                    <div className="flex space-x-2">
                        <Link href={`/product/${product.id}`}>
                            <Button variant="outline" size="sm">Ver</Button>
                        </Link>
                        <Button size="sm" onClick={() => addToCart(product)}>
                            Agregar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
