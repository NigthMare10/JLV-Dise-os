"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/context/store';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { Plus, Minus, ShoppingCart, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Toast } from '@/components/ui/Toast';

function ProductContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const { products, addToCart } = useStore();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (products.length > 0) {
            const found = products.find(p => p.id === id);
            setProduct(found);
            if (found?.category === 'Ropa' && found.sizes?.length) {
                setSelectedSize(found.sizes[0]);
            }
            setLoading(false);
        } else {
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
                    <Button variant="outline" className="cursor-pointer">Volver a la tienda</Button>
                </Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize);
        setShowToast(true);
    };

    const handleWhatsAppBuy = () => {
        const sizeInfo = selectedSize ? ` (Talla: ${selectedSize})` : '';
        const message = `Hola JLV, me interesa comprar:\n- ${quantity}x ${product.title}${sizeInfo}\nPrecio total: L. ${(product.price * quantity).toFixed(2)}`;
        const url = `https://wa.me/50497007920?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-black mb-8 transition-colors cursor-pointer group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a Productos
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="aspect-square relative bg-secondary/30 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8 py-4"
                >
                    <div className="space-y-2">
                        <span className="text-xs uppercase font-black tracking-widest text-primary/60 bg-primary/5 px-3 py-1 rounded-full">
                            {product.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{product.title}</h1>
                        <p className="text-3xl font-bold text-primary mt-4">L. {product.price.toFixed(2)}</p>
                    </div>

                    <div className="prose prose-stone max-w-none">
                        <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
                    </div>

                    {/* Sizes selection for Ropa */}
                    {product.category === 'Ropa' && product.sizes && product.sizes.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Seleccionar Talla</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[50px] h-12 rounded-xl text-sm font-black border transition-all cursor-pointer ${selectedSize === size
                                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-900 text-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center space-x-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Cantidad</h3>
                            <div className="flex items-center bg-secondary/50 rounded-2xl p-1 border border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer disabled:opacity-30"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                                <span className="font-bold w-12 text-center text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                size="lg"
                                className="flex-1 bg-black hover:bg-zinc-800 text-white h-14 rounded-2xl text-lg font-bold shadow-xl shadow-black/10 cursor-pointer"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="mr-3 h-6 w-6" />
                                Agregar al Carrito
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="flex-1 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 h-14 rounded-2xl text-lg font-bold cursor-pointer"
                                onClick={handleWhatsAppBuy}
                            >
                                <MessageCircle className="mr-3 h-6 w-6" />
                                WhatsApp
                            </Button>
                        </div>
                    </div>

                    <div className="pt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl space-y-1">
                            <div className="text-xs font-bold text-gray-400 uppercase">Envíos</div>
                            <div className="text-sm font-bold">Todo el país</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl space-y-1">
                            <div className="text-xs font-bold text-gray-400 uppercase">Calidad</div>
                            <div className="text-sm font-bold">Premium</div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl space-y-1">
                            <div className="text-xs font-bold text-gray-400 uppercase">Soporte</div>
                            <div className="text-sm font-bold">24/7</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Toast
                isOpen={showToast}
                onClose={() => setShowToast(false)}
                message={`${quantity}x ${product?.title} ${selectedSize ? `(Talla ${selectedSize})` : ''} agregado correctamente`}
            />
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
