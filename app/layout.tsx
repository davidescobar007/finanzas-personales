import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/components/dashboard-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mis Finanzas",
  description: "App para organizar tus finanzas personales",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mis Finanzas",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
