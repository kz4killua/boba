import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExplorerProvider } from "@/providers/explorer-provider";
import { NotebooksProvider } from "@/providers/notebooks-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soodo | Code in Pseudocode",
  description: "Soodo | Code in Pseudocode",
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