import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter for demo purposes
// In a real production environment with multiple instances, use Redis or similar.
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
    const ip = request.ip || '127.0.0.1';
    const path = request.nextUrl.pathname;

    // Protect Admin Login from Brute Force
    if (path.startsWith('/admin/login')) {
        const limit = 10; // Max requests
        const windowMs = 60 * 1000; // 1 minute window

        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, {
                count: 0,
                lastReset: Date.now(),
            });
        }

        const ipData = rateLimitMap.get(ip);

        if (Date.now() - ipData.lastReset > windowMs) {
            ipData.count = 0;
            ipData.lastReset = Date.now();
        }

        if (ipData.count >= limit) {
            return new NextResponse('Too Many Requests', { status: 429 });
        }

        ipData.count += 1;
    }

    // Security Headers are handled in next.config.ts for cleaner separation,
    // but middleware can enforce additional runtime checks if needed.

    const response = NextResponse.next();
    return response;
}

export const config = {
    matcher: '/admin/login',
};
