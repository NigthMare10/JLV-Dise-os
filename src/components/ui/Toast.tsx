"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
    message: string;
    isOpen: boolean;
    onClose: () => void;
}

export function Toast({ message, isOpen, onClose }: ToastProps) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.8 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.3)] px-8 py-5 rounded-3xl flex items-center space-x-6 min-w-[350px]"
                >
                    <div className="bg-green-500 p-3 rounded-2xl shadow-lg shadow-green-500/30">
                        <CheckCircle2 className="text-white h-7 w-7" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-black text-xl text-gray-900 dark:text-white tracking-tighter">¡Excelente!</h4>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{message}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 3, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1.5 bg-green-500 rounded-b-3xl"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

