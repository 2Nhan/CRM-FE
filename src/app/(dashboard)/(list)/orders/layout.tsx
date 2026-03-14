import { OrderProvider } from "@/providers/OrderProvider";
import React from "react";

export default function OrdersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <OrderProvider>{children}</OrderProvider>;
}
