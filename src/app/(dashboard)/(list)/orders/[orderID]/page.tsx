"use client";
import { useParams, useRouter } from "next/navigation";
import { OrderDetailType } from "@/lib/data.orders";
import useGetOrderDetail from "@/fetching/order/getOrderDetail";
import { useRef, useCallback, useEffect, useState } from "react";
import OrderDetailHeader from "./OrderDetailHeader";
import OrderDetailTable from "./OrderDetailTable";
import useConfirmOrder from "@/fetching/order/confirmOrder";
import { useNotification } from "@/providers/NotificationProvider";
import useCancelOrder from "@/fetching/order/cancelOrder";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";



const OrderDetailPage = () => {
  // PARAMS 
  const params = useParams();
  const orderID = params?.orderID as string;
  const { showNotification } = useNotification();

  // API HOOK
  const { loading: getOrderDetailLoading, getOrderDetail } = useGetOrderDetail();
  const { loading: orderConfirmLoading, confirmOrder } = useConfirmOrder();
  const { loading: orderCancelLoading, cancelOrder } = useCancelOrder();

  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState<OrderDetailType | null>(null);

  /**
   * confirm deliver products - set the order to be 'delivered' status
   */
  const handleConfirmButtonToggle = async () => {
    try {
      const result = await confirmOrder(orderDetail?.id || "");

      if (result) {
        setOrderDetail(result);
        showNotification("Confirm order successfully");
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  };

  /**
   * cancel deliver products - set the order to be 'cancelled' status
   */
  const handleCancelButtonToggle = async () => {
    try {
      const result = await cancelOrder(orderDetail?.id || "");

      if (result) {
        setOrderDetail(result);
        showNotification("Cancel order successfully");
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  };


  /**
   * get order detail - initialize order detail fetching and display action
   */
  const fetchOrderDetail = useCallback(async () => {
    const orderDetail = await getOrderDetail(orderID);
    setOrderDetail(orderDetail);
  }, []);
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchOrderDetail();
  }, [orderID]);

  if (getOrderDetailLoading || !orderDetail) {
    return <div className="p-6">
      <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />
    </div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* HEADER */}
        <OrderDetailHeader orderDetail={orderDetail} />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN - ORDER ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {/* ORDER ITEMS TABLE */}
              <OrderDetailTable orderDetail={orderDetail} />
              {
                orderDetail.status !== 'Delivered' && orderDetail.status !== 'Cancelled' ?
                  <div className="w-full flex justify-end gap-3 pt-4 border-t">
                    {
                      orderCancelLoading || orderConfirmLoading ?
                      <FetchingLoadingStatus loading={orderCancelLoading || orderConfirmLoading} size={10} color={orderCancelLoading ? "red" : "blue"}/>
                      :
                       <div className="flex gap-2">
                      <button
                        onClick={() => handleCancelButtonToggle()}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium">
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmButtonToggle()}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm"
                      >
                        Confirm
                      </button>
                    </div>
                    }
                   
                  </div>
                  :
                  ""
              }
            </div>

            {/* RIGHT COLUMN - ORDER INFO */}
            <div className="space-y-6">
              {/* BUYER INFORMATION */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Buyer Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{orderDetail.buyerName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Address</p>
                    <div className="flex items-start space-x-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      <p className="text-sm text-gray-900">{orderDetail.shippingAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CREATED BY INFORMATION */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Created By</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {orderDetail.createdBy.firstName} {orderDetail.createdBy.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                      <p className="text-sm text-gray-900">{orderDetail.createdBy.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</p>
                    <p className="text-xs font-mono text-gray-600 mt-1">{orderDetail.createdBy.id}</p>
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</p>
                    <p className="text-xs font-mono text-gray-900 mt-1">{orderDetail.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Items</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {orderDetail.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Products</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{orderDetail.items.length} products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default OrderDetailPage;