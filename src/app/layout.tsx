import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/auth-context";
import { UserDataProvider } from "@/context/user-data-context";
import { ToastProvider } from "@/context/toast-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "知乎 2025 年度盘点",
  description: "知乎 2025 年度盘点",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <UserDataProvider>
            <ToastProvider>{children}</ToastProvider>
          </UserDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
