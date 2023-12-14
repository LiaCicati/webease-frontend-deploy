import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CollectionsProvider } from "@/contexts/CollectionsContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WebEase",
  description: "Content Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Toaster />
          <CollectionsProvider>{children}</CollectionsProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
