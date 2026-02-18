"use client";

import { useStore } from '@/context/store';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2, MessageCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const { cart, updateCartQuantity, removeFromCart, clearCart } = useStore();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleWhatsAppCheckout = () => {
        if (cart.length === 0) return;

        let message = "Hola JLV, me gustaría realizar el siguiente pedido:\n\n";
        cart.forEach(item => {
            const sizeInfo = item.selectedSize ? ` (Talla: ${item.selectedSize})` : '';
            message += `- *${item.quantity}x ${item.title}${sizeInfo}* (L. ${(item.price * item.quantity).toFixed(2)})\n`;
        });
        message += `\n*TOTAL: L. ${total.toFixed(2)}*\n\nQuedo atento para coordinar el pago y envío.`;

        const url = `https://wa.me/50497007920?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center space-y-6">
                <h1 className="text-3xl font-bold">Tu Carrito está vacío</h1>
                <p className="text-muted-foreground text-lg">Parece que no has agregado nada aún.</p>
                <Link href="/">
                    <Button size="lg">Explorar Productos</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 pb-24">
            <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${item.selectedSize || index}`} className="flex gap-4 border p-4 rounded-lg items-center bg-card">
                            <div className="w-24 h-24 relative bg-secondary rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-grow space-y-1">
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                {item.selectedSize && (
                                    <p className="text-sm bg-secondary inline-block px-2 py-0.5 rounded-full">Talla: {item.selectedSize}</p>
                                )}
                                <p className="text-muted-foreground text-sm">L. {item.price.toFixed(2)} c/u</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.selectedSize)}
                                    className="p-1 hover:bg-secondary rounded-full disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="font-medium w-8 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.selectedSize)}
                                    className="p-1 hover:bg-secondary rounded-full"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="font-bold text-lg w-24 text-right">
                                L. {(item.price * item.quantity).toFixed(2)}
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id, item.selectedSize)}
                                className="text-destructive hover:text-red-700 p-2"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    ))}


                    <Button variant="ghost" className="text-muted-foreground" onClick={clearCart}>
                        Vaciar Carrito
                    </Button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-secondary/20 border rounded-lg p-6 space-y-6 sticky top-24">
                        <h2 className="text-xl font-bold">Resumen del Pedido</h2>

                        <div className="space-y-3 pt-4 border-t">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>L. {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12 text-lg"
                            onClick={handleWhatsAppCheckout}
                        >
                            <MessageCircle className="mr-2 h-5 w-5" />
                            Ordenar por WhatsApp
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                            Al hacer clic, serás redirigido a WhatsApp para enviar los detalles de tu pedido.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
