"use client"
import { createContext, useContext, ReactNode } from "react";

interface OrderContextProps {
    isInitialLoading: boolean;
}

const OrderContext = createContext<OrderContextProps | null>(null);

export const useOrderPageContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrderPageContext must be used within OrderPageProvider");
    }
    return context;
};

export const OrderPageProvider = ({
    children,
    isInitialLoading,
}: {
    children: ReactNode;
    isInitialLoading: boolean;
}) => {
    return (
        <OrderContext.Provider value={{ isInitialLoading }}>
            {children}
        </OrderContext.Provider>
    );
};
