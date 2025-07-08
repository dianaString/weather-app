// import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import Header from "@/components/Header";

import "./globals.css";
import "@/styles/comunes.module.css";
/* import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] }); */

export const metadata: Metadata = {
  title: "Weather App",
  description: "Tu clima personalizado",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
