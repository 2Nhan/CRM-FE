"use client";

import { QuotationTableProvider } from "@/providers/QuotationTableProvider";

export default function QuotationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuotationTableProvider>
      {children}
    </QuotationTableProvider>
  );
}
