import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  variable: "--font-georgian",
  display: "swap",
});

export const metadata: Metadata = {
  title: "partz.ge — Car Parts Marketplace",
  description: "Find authentic car parts from verified Georgian sellers and shops. Search by VIN or select your vehicle.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ka" className={`h-full ${notoSans.variable} ${notoSansGeorgian.variable}`}>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
