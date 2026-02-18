"use client";

import Link from 'next/link';
import { useStore } from '@/context/store';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Navbar() {
    const { cart, isAdmin } = useStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold tracking-tight">JLV</span>
                    <div className="h-6 w-6 relative">
                        {/* Simple Drop Logo Representation in SVG */}
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path d="M12 2L12 22" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2" stroke="var(--brand-cyan)" strokeWidth="2" />
                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2" stroke="var(--brand-magenta)" strokeWidth="2" />
                        </svg>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                        Inicio
                    </Link>
                    <Link href="/#products" className="text-sm font-medium transition-colors hover:text-primary">
                        Productos
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Panel Admin
                        </Link>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </Link>

                    <Link href="/admin/login">
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>

                    <ThemeToggle />

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <Link
                        href="/"
                        className="block text-sm font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/#products"
                        className="block text-sm font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Productos
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="block text-sm font-medium text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Panel Admin
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
