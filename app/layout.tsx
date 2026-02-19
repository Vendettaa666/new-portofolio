// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout"; // Import wrapper yang kita buat tadi

const inter = Inter({ subsets: ["latin"] });

// Metadata aman ditaruh di sini karena file ini SERVER component
export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Bento grid dashboard portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {/* Panggil Logic Client di sini */}
        <DashboardLayout>
            {children}
        </DashboardLayout>
      </body>
    </html>
  );
}