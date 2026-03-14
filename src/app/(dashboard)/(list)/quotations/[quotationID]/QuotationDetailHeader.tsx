import { ApiResponseListAllQuotation } from "@/lib/data.quotation";
import QuotationStatusComponent from "../QuotationStatusComponent";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import useSendMailQuotation from "@/fetching/quotation/sendMailQuotation";
import useCreateOrderFromQuotation from "@/fetching/order/createOrderFromQuotation";
import { useNotification } from "@/providers/NotificationProvider";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import { useState } from "react";
import useDeleteQuotation from "@/fetching/quotation/deleteQuotation";

interface Props {
  quotationDetail: ApiResponseListAllQuotation;
  setQuotationDetail: React.Dispatch<React.SetStateAction<ApiResponseListAllQuotation | undefined>>
}
const QuotationDetailHeader = ({ quotationDetail, setQuotationDetail }: Props) => {
  const router = useRouter();
  const { showNotification } = useNotification();

  // send mail hook
  const { loading: sendMailQuotationLoading, sendMailQuotation } =
    useSendMailQuotation();

  // create order hook
  const { loading: createOrderLoading, createOrderFromQuotation } =
    useCreateOrderFromQuotation();

  // delete quotation 
  const { loading: deleteQuotationLoading, deleteQuotation } = useDeleteQuotation();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const handleSendMail = async () => {
    try {
      const result = await sendMailQuotation(quotationDetail.id);
      setQuotationDetail(result.data);

      if (result && result?.code === 200) {
        showNotification("Send mail successfully");
      } else {
        showNotification("There is error in send mail", true);
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  };

  /**
   * create order from quotation - change status of quotation into order
   */
  const handleCreateOrder = async () => {
    if (!orderCode.trim() || !shippingAddress.trim()) {
      showNotification("Please provide order code and shipping address", true);
      return;
    }

    try {
      const created = await createOrderFromQuotation(quotationDetail.id, {
        orderCode: orderCode.trim(),
        shippingAddress: shippingAddress.trim(),
      });

      showNotification(`Successfully create order from quotation`,);
      router.push("/orders");
    } catch (err: any) {
      showNotification(err?.message || "Failed to create order", true);
    }
  };

  const handleDeleteQuotation = async () => {
    try {
      const result = await deleteQuotation(quotationDetail.id);

      if (result) {
        showNotification("Successfully delete a quotation");
        router.push("/quotations");
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              onClick={() => router.push("/quotations")}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <div className="flex gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {quotationDetail.title}
                </h1>
                <QuotationStatusComponent status={quotationDetail.status} />
              </div>
              <p className="text-sm text-gray-500 mt-1">ID: {quotationDetail.id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Create Order button + form — only show when status is Sent */}
            {quotationDetail.status === "Sent" && (
              <div className="flex items-center space-x-2">
                {createOrderLoading ? (
                  <FetchingLoadingStatus loading={createOrderLoading} color={"blue"} size={20} />
                ) : showCreateForm ? (
                  <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex items-center space-x-2">
                    <input
                      value={orderCode}
                      onChange={(e) => setOrderCode(e.target.value)}
                      placeholder="Order code"
                      className="text-xs px-2 py-1 border rounded-md"
                    />
                    <input
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Shipping address"
                      className="text-xs px-2 py-1 border rounded-md w-64"
                    />
                    <button
                      onClick={handleCreateOrder}
                      className="text-xs bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                  >
                    Create Order
                  </button>
                )}
              </div>
            )}

            {quotationDetail.fileUrl ? (
              <a
                href={quotationDetail.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 text-xs rounded-lg hover:bg-blue-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                <span>Download PDF</span>
              </a>
            ) : sendMailQuotationLoading ? (
              <FetchingLoadingStatus loading={sendMailQuotationLoading} color={"blue"} size={10} />
            ) : (
              <div
                onClick={() => handleSendMail()}
                className="text-xs bg-blue-600 px-2 py-1.5  text-white rounded-lg opacity-70 hover:opacity-100 hover:shadow-lg transition-all duration-350 cursor-pointer"
              >
                Send mail
              </div>
            )}

            {
              deleteQuotationLoading ? 
                (
                  <FetchingLoadingStatus loading={deleteQuotationLoading} color="red" size={20}/>
                )
              :
                (
                  <div>
                    <button
                      onClick={() => handleDeleteQuotation()}
                      className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-400 transition"
                    >
                      Delete
                    </button>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetailHeader;