import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { StoreProvider } from '@/context/store';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "JLV - Tu idea hecha realidad",
  description: "Tienda oficial de productos JLV. Moda minimalista y exclusiva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}>
        <StoreProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
