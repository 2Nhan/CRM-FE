import { OrderDetailType } from "@/lib/data.orders"


interface Props {
  orderDetail: OrderDetailType,
}


const OrderDetailTable = ({ orderDetail }: Props) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const calculateSubtotalBeforeDiscount = () => {
    return orderDetail.items.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0);
  };

  const calculateTotalDiscount = () => {
    return orderDetail.items.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const discount = item.discountType === "PERCENT" ? (itemTotal * item.discount) / 100 : item.discount;
      return sum + discount;
    }, 0);
  };

  const subtotalBeforeDiscount = calculateSubtotalBeforeDiscount();
  const totalDiscount = calculateTotalDiscount();
  const subtotalAfterDiscount = subtotalBeforeDiscount - totalDiscount;
  const tax = orderDetail.totalAmount - subtotalAfterDiscount;
  const taxRate = ((tax / subtotalAfterDiscount) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderDetail.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">ID: {item.productId.slice(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-red-600">-{item.discount}%</span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-sm ">
            <span className="text-gray-600 text-[12px]">Subtotal (before discount)</span>
            <span className="font-medium text-gray-900">{formatCurrency(subtotalBeforeDiscount)}</span>
          </div>
          <div className="flex justify-between text-sm ">
            <span className="text-gray-600 text-[12px]">Total Discount</span>
            <span className="font-medium text-red-600">-{formatCurrency(totalDiscount)}</span>
          </div>
          <div className="flex justify-between text-sm ]">
            <span className="text-gray-600 text-[12px]">Subtotal (after discount)</span>
            <span className="font-medium text-gray-900">{formatCurrency(subtotalAfterDiscount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 text-[12px]">Tax ({taxRate}%)</span>
            <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
          </div>
          <div className="pt-2 border-t border-gray-300 ">
            <div className="flex justify-between">
              <span className="text-base font-semibold text-gray-900 text-[12px]">Total Amount</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(orderDetail.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailTable