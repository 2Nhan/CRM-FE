"use client";

import { CustomerProvider } from "@/providers/CustomerProvider";



export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerProvider>
      {children}
    </CustomerProvider>
  );
}
