import { OrderDataType } from "@/lib/data.orders";
import OrderStatusComponent from "./OrderStatusComponent";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import PageNavigationComponent from "@/components/PageNavigationComponent";
import useGetListOrder from "@/fetching/order/getAllOrder";
import { useNotification } from "@/providers/NotificationProvider";
import { useOrderContext } from "@/providers/OrderProvider";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";

type HeaderDataType = {
  id: number;
  key: keyof OrderDataType | "itemCount" | "createdByName";
  label: string;
  width: string;
  justifyItems: string;
};

// ============ TABLE HEADERS ============
const tableHeaders: HeaderDataType[] = [
  { id: 1, key: "orderCode", label: "Order ID", width: "w-[12%]", justifyItems: "justify-start" },
  { id: 2, key: "buyerName", label: "Buyer", width: "w-[15%]", justifyItems: "justify-start" },
  { id: 3, key: "status", label: "Status", width: "w-[12%]", justifyItems: "justify-center" },
  { id: 4, key: "totalAmount", label: "Total Amount", width: "w-[13%]", justifyItems: "justify-end" },
  { id: 5, key: "itemCount", label: "Items", width: "w-[10%]", justifyItems: "justify-center" },
  { id: 6, key: "shippingAddress", label: "Shipping Address", width: "w-[20%]", justifyItems: "justify-start" },
  { id: 7, key: "createdByName", label: "Created By", width: "w-[18%]", justifyItems: "justify-start" },
];

const OrderTable = () => {
  const router = useRouter();
  const { showNotification } = useNotification();
  // STATE
  const { allOrder, pagination, searchTerm, setSearchTerm, handleSearchOrder, searchOrderLoading, getOrderWithPageNoFunction: getOrderWithPageNo } = useOrderContext();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    getOrderWithPageNo(currentPage);
  }, [currentPage]);

  if (!allOrder || !pagination) {
    return;
  }

  return (
    <div className="p-4 flex-1 w-full overflow-y-auto">
      {/* TABLE HEADER */}
      <div className="w-full h-[8%] py-2 flex items-center justify-between">
        <div className="flex w-full h-full items-center gap-3 py-2">
          {/* SEARCH BAR */}
          <div className="w-[22%] h-full flex items-center gap-2 px-3 rounded-full border border-gray-300 bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 text-gray-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              disabled={searchOrderLoading}
              value={searchTerm || ""}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchOrder(1);
                  setCurrentPage(1);
                }
              }}
              type="text"
              className="flex-1 bg-transparent text-sm focus:outline-none"
              placeholder="Search..."
            />
          </div>
          <div>
            <FetchingLoadingStatus color="blue" size={20} loading={searchOrderLoading} />
          </div>
        </div>



        {/* ACTION BUTTONS */}
        <div className="w-[22%] h-full flex items-center gap-3 justify-end">
          {/* DELETE */}
          {/* <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-400 text-gray-700 hover:border-red-500 hover:text-red-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Delete
          </button> */}

          {/* NEW ORDER */}
          {/* <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
            New order
          </button> */}
        </div>
      </div>

      {/* ORDER TABLE */}
      <div className="w-full h-[82%] py-2 overflow-y-auto">
        <table className="w-full border-separate border-spacing-y-1">
          <thead>
            <tr className="text-gray-400 font-semibold text-sm bg-gray-100/50">
              {tableHeaders.map((header) => (
                <th key={header.id} className={`py-2 px-2 ${header.width}`}>
                  <div className={`flex ${header.justifyItems} items-center gap-1 cursor-pointer`}>
                    <span>{header.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allOrder.map((row, index) => (
              <tr key={index} className="h-[40px] text-sm text-gray-700 hover:bg-blue-100 transition-colors duration-200" onClick={() => router.push(`/orders/${row.id}`)}>
                {tableHeaders.map((column, idx) => {
                  if (column.key === "status") {
                    return (
                      <td key={idx} className={`${column.width} py-2`}>
                        <div className={`flex ${column.justifyItems} items-center`}>
                          <OrderStatusComponent status={row.status} />
                        </div>
                      </td>
                    );
                  }

                  if (column.key === "orderCode") {
                    return (
                      <td key={idx} className={`${column.width} py-2 px-4`}>
                        <div className={`flex ${column.justifyItems} items-center`}>
                          <span className="font-bold text-sm">{row.orderCode}</span>
                        </div>
                      </td>
                    );
                  }

                  if (column.key === "totalAmount") {
                    return (
                      <td key={idx} className={`${column.width} py-2 px-4`}>
                        <div className={`flex ${column.justifyItems} items-center text-sm font-semibold`}>
                          {formatCurrency(row.totalAmount)}
                        </div>
                      </td>
                    );
                  }

                  if (column.key === "itemCount") {
                    const itemCount = row.items.reduce((sum, item) => sum + item.quantity, 0);
                    return (
                      <td key={idx} className={`${column.width} py-2`}>
                        <div className={`flex ${column.justifyItems} items-center`}>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {itemCount}
                          </span>
                        </div>
                      </td>
                    );
                  }

                  if (column.key === "createdByName") {
                    const createdByName = `${row.createdBy.firstName} ${row.createdBy.lastName}`;
                    return (
                      <td key={idx} className={`${column.width} py-2 px-4`}>
                        <div className={`flex ${column.justifyItems} items-center text-sm gap-1`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          {createdByName}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={idx} className={`${column.width} py-2 px-4`}>
                      <div className={`flex ${column.justifyItems} items-center text-sm`}>
                        {row[column.key as keyof OrderDataType] as string}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PageNavigationComponent currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={pagination.totalPages} />
    </div>
  );
};

export default OrderTable