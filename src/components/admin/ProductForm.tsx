"use client";

import { useState, useRef } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: Partial<Product>) => void;
    onCancel: () => void;
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        imageUrl: initialData?.imageUrl || '',
        category: initialData?.category || '',
        sizes: initialData?.sizes || [],
    });
    const [previewImage, setPreviewImage] = useState<string>(initialData?.imageUrl || '');

    const [error, setError] = useState<string>('');

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const toggleSize = (size: string) => {
        const currentSizes = formData.sizes || [];
        if (currentSizes.includes(size)) {
            setFormData({ ...formData, sizes: currentSizes.filter(s => s !== size) });
        } else {
            setFormData({ ...formData, sizes: [...currentSizes, size] });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Robust Validations
        if (!formData.title?.trim()) {
            setError('El título es obligatorio.');
            return;
        }
        if (!formData.category) {
            setError('Por favor, selecciona una categoría.');
            return;
        }
        if (typeof formData.price !== 'number' || formData.price < 0) {
            setError('El precio debe ser un número válido mayor o igual a 0.');
            return;
        }

        // If category is clothing but no sizes, show warning or just keep it
        if (formData.category === 'Ropa' && (!formData.sizes || formData.sizes.length === 0)) {
            if (!confirm('No has seleccionado tallas para este artículo de ropa. ¿Deseas continuar?')) {
                return;
            }
        }

        // If no image is provided, use a placeholder
        const finalData = {
            ...formData,
            imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=500' // Default placeholder
        };
        onSubmit(finalData);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData({ ...formData, imageUrl: base64String });
                setPreviewImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AnimatePresence>
            <div className="dark fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-zinc-900 w-full max-w-lg rounded-xl shadow-2xl border border-gray-800 p-6 max-h-[90vh] overflow-y-auto text-white"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white">Imagen del Producto</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-white/50 hover:bg-zinc-800/50 transition-all group relative overflow-hidden"
                            >
                                {previewImage ? (
                                    <div className="relative w-full h-48 rounded-md overflow-hidden">
                                        <Image src={previewImage} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-medium flex items-center"><Upload className="mr-2 h-4 w-4" /> Cambiar Imagen</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400 group-hover:text-white transition-colors">
                                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Haz clic para subir una imagen</p>
                                        <p className="text-xs opacity-70 mt-1">Soporta JPG, PNG, WEBP</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-white">Título</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-zinc-800 text-white focus:ring-2 focus:ring-white/20 focus:border-white transition-all outline-none placeholder:text-gray-500"
                                    placeholder="Ej: Camisa Premium"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-white">Descripción</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-zinc-800 text-white focus:ring-2 focus:ring-white/20 focus:border-white transition-all outline-none min-h-[100px] resize-none placeholder:text-gray-500"
                                    placeholder="Describe los detalles del producto..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-white">Precio (L.)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-zinc-800 text-white focus:ring-2 focus:ring-white/20 focus:border-white transition-all outline-none placeholder:text-gray-500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 text-white">Categoría</label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-700 bg-zinc-800 text-white focus:ring-2 focus:ring-white/20 focus:border-white transition-all outline-none appearance-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Ropa">Ropa</option>
                                        <option value="Accesorios">Accesorios</option>
                                        <option value="Hogar">Hogar</option>
                                        <option value="Tecnología">Tecnología</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                </div>
                            </div>

                            {/* Section for sizes if category is Ropa */}
                            {formData.category === 'Ropa' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2"
                                >
                                    <label className="block text-sm font-medium text-white">Tallas Disponibles</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${formData.sizes?.includes(size)
                                                        ? 'bg-white text-black'
                                                        : 'bg-zinc-800 border border-gray-700 text-gray-400 hover:border-gray-500'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>


                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-800">
                            <Button type="button" variant="outline" onClick={onCancel} className="hover:bg-zinc-800 border-gray-700 text-black hover:text-white">
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10">
                                {initialData ? 'Guardar Cambios' : 'Crear Producto'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
