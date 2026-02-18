"use client";

import { useStore } from '@/context/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { Plus, Edit2, Trash2, ArrowLeft, Percent } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProductsPage() {
    const { products, isAdmin, deleteProduct, addProduct, updateProduct, applyBulkPriceUpdate } = useStore();
    const router = useRouter();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [bulkUpdateValue, setBulkUpdateValue] = useState('');

    useEffect(() => {
        if (!isAdmin) {
            router.push('/admin/login');
        }
    }, [isAdmin, router]);

    if (!isAdmin) return null;

    const handleCreate = (data: Partial<Product>) => {
        const newProduct: Product = {
            id: Date.now().toString(),
            title: data.title!,
            description: data.description!,
            price: data.price!,
            imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75',
            category: data.category || 'Otros',
            sizes: data.sizes || [],
            soldCount: 0,
            createdAt: new Date().toISOString()
        };
        addProduct(newProduct);
        setIsFormOpen(false);
    };

    const handleUpdate = (data: Partial<Product>) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, data);
            setIsFormOpen(false);
            setEditingProduct(undefined);
        }
    };

    const openEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleBulkUpdate = () => {
        const percentage = parseFloat(bulkUpdateValue);
        if (!isNaN(percentage) && percentage !== 0) {
            if (confirm(`¿Estás seguro de ajustar los precios un ${percentage}%?`)) {
                applyBulkPriceUpdate(percentage);
                setBulkUpdateValue('');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center space-x-4 mb-8">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
            </div>

            {/* Bulk Actions */}
            <div className="bg-card border rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                    <h3 className="font-bold flex items-center"><Percent className="h-4 w-4 mr-2" /> Ajuste Masivo de Precios</h3>
                    <p className="text-sm text-muted-foreground">Sube o baja el precio de TODOS los productos.</p>
                </div>
                <div className="flex space-x-2">
                    <input
                        type="number"
                        placeholder="Ej: 10 o -5"
                        className="px-4 py-2 bg-secondary/50 border rounded-xl w-32 focus:ring-2 focus:ring-primary outline-none"
                        value={bulkUpdateValue}
                        onChange={(e) => setBulkUpdateValue(e.target.value)}
                    />
                    <Button onClick={handleBulkUpdate} variant="outline" className="rounded-xl cursor-pointer">Aplicar %</Button>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground font-medium">{products.length} productos registrados</p>
                <Button onClick={() => { setEditingProduct(undefined); setIsFormOpen(true); }} className="rounded-xl cursor-pointer shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                </Button>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-2xl p-5 bg-card shadow-sm hover:shadow-xl transition-all duration-500 relative group border-gray-100 dark:border-gray-800 flex flex-col h-full">
                        <div className="aspect-video relative bg-secondary rounded-xl overflow-hidden mb-4">
                            <Image src={product.imageUrl} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex-grow space-y-2">
                            <h3 className="font-bold text-lg leading-tight">{product.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{product.description}</p>

                            {product.category === 'Ropa' && product.sizes && product.sizes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {product.sizes.map(s => (
                                        <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 bg-secondary rounded border border-gray-100 dark:border-gray-800">{s}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50 dark:border-gray-900">
                            <span className="font-black text-xl tracking-tighter">L. {product.price.toFixed(2)}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">{product.category}</span>
                        </div>


                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-md">
                            <button onClick={() => openEdit(product)} className="text-blue-600 p-1 hover:bg-blue-50 rounded">
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => { if (confirm('Eliminar producto?')) deleteProduct(product.id) }}
                                className="text-red-600 p-1 hover:bg-red-50 rounded"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isFormOpen && (
                <ProductForm
                    initialData={editingProduct}
                    onSubmit={editingProduct ? handleUpdate : handleCreate}
                    onCancel={() => { setIsFormOpen(false); setEditingProduct(undefined); }}
                />
            )}
        </div>
    );
}
