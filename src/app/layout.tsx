import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}