import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/providers/NotificationProvider"
import { AuthenticationProvider } from "@/providers/AuthenticationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vera CRM",
  description: "CRM System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider >
          <AuthenticationProvider>
            {children}
          </AuthenticationProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
