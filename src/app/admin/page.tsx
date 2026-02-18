"use client";

import { useStore } from '@/context/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { products, isAdmin } = useStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin) {
            router.push('/admin/login');
        }
    }, [isAdmin, router]);

    if (!isAdmin) return null;

    // Mock Analytics Data
    const totalSales = products.reduce((acc, p) => acc + (p.soldCount * p.price), 0);
    const totalItemsSold = products.reduce((acc, p) => acc + p.soldCount, 0);
    const bestSeller = [...products].sort((a, b) => b.soldCount - a.soldCount)[0];

    const salesData = products.map(p => ({
        name: p.title.substring(0, 10) + '...',
        sales: p.soldCount
    })).sort((a, b) => b.sales - a.sales).slice(0, 5);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <Link href="/admin/products">
                    <Button>Gestionar Productos</Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-muted-foreground">Ventas Totales Est.</h3>
                        <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold">L. {totalSales.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">+12% vs mes pasado</p>
                </div>

                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-muted-foreground">Productos Vendidos</h3>
                        <Package className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold">{totalItemsSold}</p>
                </div>

                <div className="p-6 border rounded-lg bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-muted-foreground">Más Vendido</h3>
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                    </div>
                    <p className="text-lg font-bold truncate">{bestSeller?.title || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">{bestSeller?.soldCount} unidades</p>
                </div>
            </div>

            {/* Chart */}
            <div className="p-6 border rounded-lg bg-card shadow-sm h-[400px]">
                <h3 className="font-bold text-lg mb-6">Top 5 Productos Más Vendidos</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `L. ${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Bar dataKey="sales" fill="var(--brand-cyan)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
