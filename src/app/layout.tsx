import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";

// Importing Google Font
const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aumi AI",
  description: "Practice for job interviews in real time and receive instant feedback",
};

// Root Layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${interSans.className} antialiased pattern`}>
        <Navbar /> {/* ✅ Navbar should be here, not inside RootLayout logic */}
        <main>{children}</main> 
        <Toaster /> {/* Toast notifications */}
      </body>
    </html>
  );
}
