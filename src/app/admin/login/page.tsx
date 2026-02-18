"use client";

import { useStore } from '@/context/store';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { verifyPin } from '@/lib/security';

export default function AdminLoginPage() {
    const { loginAdmin, isAdmin } = useStore();
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAdmin) {
            router.push('/admin');
        }
    }, [isAdmin, router]);

    if (isAdmin) {
        return null;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await verifyPin(pin);
        if (isValid) {
            loginAdmin();
            router.push('/admin');
        } else {
            setError('PIN incorrecto');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md p-8 border rounded-lg shadow-sm bg-card">
                <h1 className="text-2xl font-bold mb-6 text-center">Acceso Administrador</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">PIN de Acceso</label>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Ingrese PIN"
                        />
                    </div>
                    {error && <p className="text-destructive text-sm">{error}</p>}
                    <Button type="submit" className="w-full">Entrar</Button>
                </form>
            </div>
        </div>
    );
}
