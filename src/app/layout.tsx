import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExplorerProvider } from "@/providers/explorer-provider";
import { NotebooksProvider } from "@/providers/notebooks-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boba - The (English) Programming Language",
  description: "Programming doesn't have to be hard. Boba is a simple, easy-to-learn programming language that's perfect for beginners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        <ExplorerProvider>
          <NotebooksProvider>
            {children}
            <Toaster />
          </NotebooksProvider>
        </ExplorerProvider>
        <Script src="/scripts/made-with-love.js" />
      </body>
    </html>
  );
}