"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/context/store';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { Minus, Plus, ShoppingCart, MessageCircle } from 'lucide-react';
import Link from 'next/link';

function ProductContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const { products, addToCart } = useStore();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (products.length > 0) {
            const found = products.find(p => p.id === id);
            setProduct(found);
            setLoading(false);
        } else {
            // If products are empty, it might be first load. 
            // We wait a bit or if we know store is initialized.
            // For simplicity in this mock, if products is empty but we expect seed data, 
            // we might just wait. But store initializes efficiently.
            // If after a timeout still empty, then maybe not found?
            // Actually, store initializes with defaults if localstorage is empty.
            // So if products is empty, it's just mounting.
            const timer = setTimeout(() => setLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [id, products]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                <Link href="/">
                    <Button variant="outline">Volver a la tienda</Button>
                </Link>
            </div>
        );
    }

    const handleWhatsAppBuy = () => {
        const message = `Hola, me interesa comprar: ${product.title} - L. ${product.price}.`;
        const url = `https://wa.me/50497007920?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="aspect-square relative bg-secondary/30 rounded-xl overflow-hidden">
                    <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold font-serif mb-2">{product.title}</h1>
                        <p className="text-2xl font-medium text-primary">L. {product.price.toFixed(2)}</p>
                    </div>

                    <div className="prose prose-stone max-w-none">
                        <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="flex-1 bg-black hover:bg-gray-800 text-white"
                                onClick={() => {
                                    addToCart(product);
                                    // Optional: Open cart or show toast
                                }}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Agregar al Carrito
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                                onClick={handleWhatsAppBuy}
                            >
                                <MessageCircle className="mr-2 h-5 w-5" />
                                Comprar por WhatsApp
                            </Button>
                        </div>
                    </div>

                    <div className="pt-8">
                        <h3 className="text-lg font-semibold mb-4">Categoría</h3>
                        <span className="inline-block bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                            {product.category}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        }>
            <ProductContent />
        </Suspense>
    );
}
