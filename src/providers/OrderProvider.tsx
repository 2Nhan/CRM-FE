"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from "react";
import useGetListOrder from "@/fetching/order/getAllOrder";
import useOrderSummary from "@/fetching/order/orderSummary";
import useSearchOrder from "@/fetching/order/searchOrder";
import { OrderDataType } from "@/lib/data.orders";
import { useNotification } from "./NotificationProvider";

interface OrderStatisticType {
    totalAmount: number,
    Pending: number,
    Delivered: number,
    Cancelled: number,
    Total: number,
}

interface OrderProviderContextType {
    isInitialLoading: boolean;
    searchOrderLoading: boolean;
    allOrder: OrderDataType[];
    pagination: any;
    orderStatistic: OrderStatisticType | null;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    getOrderWithPageNoFunction: (pageNo: number) => void;
    handleSearchOrder: (pageNo: number) => void;
}

const OrderContext = createContext<OrderProviderContextType | null>(null);

export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrderContext must be used within OrderProvider");
    }
    return context;
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const { showNotification } = useNotification();

    // API HOOKS
    const { getOrderWithPageNo } = useGetListOrder();
    const { orderSummary } = useOrderSummary();
    const { loading: searchOrderLoading, searchOrder } = useSearchOrder();

    // STATE
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [allOrder, setAllOrder] = useState<OrderDataType[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [orderStatistic, setOrderStatistic] = useState<OrderStatisticType | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const didFetch = useRef(false);

    const getInitialData = useCallback(async () => {
        try {
            setIsInitialLoading(true);
            const [listResult, summaryResult] = await Promise.all([
                getOrderWithPageNo(1),
                orderSummary()
            ]);

            const { orderRows, pagination: listPagination } = listResult;

            setAllOrder(orderRows || []);
            setPagination(listPagination);

            setOrderStatistic({
                totalAmount: summaryResult.totalAmount,
                Pending: summaryResult.Pending || 0,
                Delivered: summaryResult.Delivered || 0,
                Cancelled: summaryResult.Cancelled || 0,
                Total: (summaryResult.Pending || 0) + (summaryResult.Delivered || 0) + (summaryResult.Cancelled || 0),
            });

        } catch (error) {
            showNotification(String(error), true);
        } finally {
            setIsInitialLoading(false);
        }
    }, [getOrderWithPageNo, orderSummary, showNotification]);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;
        getInitialData();
    }, [getInitialData]);

    const getOrderWithPageNoFunction = async (pageNo: number) => {
        try {
            if (searchTerm) {
                await handleSearchOrder(pageNo);
                return;
            }
            const { orderRows, pagination: listPagination } = await getOrderWithPageNo(pageNo);
            setAllOrder(orderRows || []);
            setPagination(listPagination);
        } catch (error) {
            showNotification(String(error), true);
        }
    };

    const handleSearchOrder = async (pageNo: number) => {
        try {
            const { orderRows, pagination: listPagination } = await searchOrder(searchTerm, pageNo);
            setAllOrder(orderRows || []);
            setPagination(listPagination);
        } catch (error) {
            showNotification(String(error), true);
        }
    };

    return (
        <OrderContext.Provider value={{
            isInitialLoading,
            searchOrderLoading,
            allOrder,
            pagination,
            orderStatistic,
            searchTerm,
            setSearchTerm,
            getOrderWithPageNoFunction,
            handleSearchOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
};
