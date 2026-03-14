"use client";

import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import useGetQuotationDetail from "@/fetching/quotation/getQuotationDetail";
import { ApiResponseListAllQuotation } from "@/lib/data.quotation";
import { useParams } from "next/navigation";
import { moneyFormat } from "@/util/moneyFormat";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText,
  Calendar,
  User,
  Package,
  DollarSign,
  Mail,
  Clock,
  Download,
  ArrowLeft,
} from "lucide-react";
import QuotationStatusComponent from "../QuotationStatusComponent";
import { useRouter } from "next/navigation";
import QuotationDetailHeader from "./QuotationDetailHeader";
const Page = () => {
  const params = useParams();
  const quotationID = params?.quotationID as string;

  // STATE
  const [quotationDetail, setQuotationDetail] =
    useState<ApiResponseListAllQuotation>();

  // API HOOKS
  const { loading: getQuotationDetailLoading, getQuotationDetail } =
    useGetQuotationDetail();
  const didFetch = useRef<boolean>(false);

  const fetchQuotationDetail = useCallback(async () => {
    const quotationDetail: ApiResponseListAllQuotation =
      await getQuotationDetail(quotationID);
    setQuotationDetail(quotationDetail);
  }, []);

  useEffect(() => {
    if (didFetch.current) {
      return;
    }
    didFetch.current = true;
    fetchQuotationDetail();
  }, [quotationID]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (getQuotationDetailLoading) {
    return (
      <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />
    );
  }

  if (!quotationDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No quotation found
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            The requested quotation could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const taxAmount = quotationDetail.finalAmount
    ? quotationDetail.finalAmount - quotationDetail.untaxedAmount
    : 0;
  const totalItems = quotationDetail.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <QuotationDetailHeader
        quotationDetail={quotationDetail}
        setQuotationDetail={setQuotationDetail}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Final Amount
                </p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  {moneyFormat(quotationDetail.finalAmount || 0)}
                </p>
              </div>
              <div className=" p-3 rounded-lg bg-green-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Untaxed Amount
                </p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  {moneyFormat(quotationDetail.untaxedAmount)}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  {totalItems}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Package className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tax Amount</p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  {moneyFormat(taxAmount)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <DollarSign className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Lead Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Lead Information
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {quotationDetail.lead.fullName}
                </p>
              </div>
              <div>
                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {quotationDetail.lead.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
                  Lead ID
                </p>
                <p className="text-xs font-mono text-gray-600 mt-1">
                  {quotationDetail.lead.id}
                </p>
              </div>
            </div>
          </div>

          {/* Creator Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Created By
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {quotationDetail.createdBy.firstName}{" "}
                  {quotationDetail.createdBy.lastName}
                </p>
              </div>
              <div>
                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {quotationDetail.createdBy.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </p>
                <p className="text-xs font-mono text-gray-600 mt-1">
                  {quotationDetail.createdBy.id}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(quotationDetail.validUntil)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </p>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDateTime(quotationDetail.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-[8px] font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </p>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDateTime(quotationDetail.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {quotationDetail.content && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {quotationDetail.content}
            </p>
          </div>
        )}

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Quotation Items
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotationDetail.items.map((item, index) => (
                  <tr
                    key={item.productId || index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.productId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {moneyFormat(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <span className="text-red-600 font-medium">
                        -{item.discount}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {moneyFormat(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-right text-sm font-medium text-gray-700"
                  >
                    Untaxed Amount
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {moneyFormat(quotationDetail.untaxedAmount)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-right text-sm font-medium text-gray-700"
                  >
                    Tax (10%)
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {moneyFormat(taxAmount)}
                  </td>
                </tr>
                <tr className="">
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-right text-base font-semibold text-gray-900"
                  >
                    Final Amount
                  </td>
                  <td className="px-6 py-4 text-right text-base font-bold text-blue-600">
                    {moneyFormat(quotationDetail.finalAmount || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
