import { OrderDetailType } from "@/lib/data.orders"
import OrderStatusBadge from "./OrderStatusBadge"
import { useRouter } from "next/navigation"
import { useNotification } from "@/providers/NotificationProvider";
import useDeleteOrder from "@/fetching/order/deleteOrder";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";

interface Props {
  orderDetail: OrderDetailType,
}
const OrderDetailHeader = ({ orderDetail }: Props) => {
  const { loading: deleteOrderLoading, deleteOrder } = useDeleteOrder();

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleDeleteOrder = async () => {
    try {
      const success = await deleteOrder(orderDetail.id);

      if (success) {
        showNotification("Successfully delete order");
        router.push("/orders");
      }
    } catch (error) {
      showNotification(String(error) || "Processed failed", true);
    }
  }
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition" onClick={() => router.push("/orders")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-[12px] text-gray-500 mt-1">Order Code: {orderDetail.orderCode}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <OrderStatusBadge status={orderDetail.status} />
            {/* <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                <span>Edit Order</span>
              </button> */}
            {orderDetail.status === "Pending" && (
              <div>
                {
                  deleteOrderLoading ?
                    (<FetchingLoadingStatus loading={deleteOrderLoading} size={20} color="red" />)
                    :
                    (<button
                      disabled={deleteOrderLoading}
                      onClick={() => handleDeleteOrder()}
                      className="
                    flex items-center justify-center gap-2
                    px-4 py-2 rounded-lg
                    bg-red-600 text-white text-sm font-medium
                    transition-all duration-200 ease-in-out
                    hover:bg-red-700 hover:shadow-md
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                  "
                    >
                      Delete
                    </button>)
                }
              </div>

            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailHeader