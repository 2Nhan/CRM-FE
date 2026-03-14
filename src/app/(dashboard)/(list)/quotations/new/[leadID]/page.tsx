"use client";

import { useParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import PageHeader from "./PageHeader";
import CustomerInformation from "./CustomerInformation";

import { LeadDetailType } from "@/lib/data.leads";
import { useNotification } from "@/providers/NotificationProvider";
import useGetLeadDetail from "@/fetching/lead/getLeadDetail";
import { useGetListProducts } from "@/fetching/product/getListProducts";
import { useQuotationTable } from "@/providers/QuotationTableProvider";

/* ================= TYPES ================= */

type QuotationItemType = {
  id: string;
  productID: string,
  productName: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
};

type QuotationType = {
  leadID: string;
  title: string;
  content: string;
  items: QuotationItemType[];
};

/* ================= COMPONENT ================= */

const Page = () => {
  const params = useParams();
  const leadID = params?.leadID as string;

  const { showNotification } = useNotification();
  const { getLeadDetailInformation } = useGetLeadDetail();
  const { getListProducts } = useGetListProducts();

  const [leadDetailInfo, setLeadDetailInfo] = useState<LeadDetailType | null>(null);
  const [listProduct, setListProduct] = useState<any[]>([]);

  const [quotation, setQuotation] = useState<QuotationType>({
    leadID: "",
    title: "",
    content: "",
    items: [
      {
        id: crypto.randomUUID(),
        productID: "",
        productName: "",
        description: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ],
  });

  // QUOTATION PROVIDER 
  const { saveQuotationLoading, saveAQuotation} = useQuotationTable();

  // FETCH DATA
  const fetchLeadDetail = useCallback(async () => {
    if (!leadID) return;
    try {
      const { leadDetail } = await getLeadDetailInformation(leadID);
      if (!leadDetail) throw new Error("Lead not found");
      setLeadDetailInfo(leadDetail);
      setQuotation((prev) => ({ ...prev, leadID: leadDetail.leadID }));
    } catch (e: any) {
      showNotification(e.message, true);
    }
  }, [leadID, getLeadDetailInformation, showNotification]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await getListProducts();
      const products =
        res?.data?.map((p: any) => ({
          productID: p.productId,
          productName: p.productName,
          price: p.purchaseUnitPrice ?? 0,
          description: p.description ?? "",
        })) ?? [];

      console.log(products);
      setListProduct(products);
    } catch (e: any) {
      showNotification(e.message, true);
    }
  }, [getListProducts, showNotification]);

  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchLeadDetail();
    fetchProducts();
  }, [fetchLeadDetail, fetchProducts]);

  // SAVE QUOTATION TOGGLE
  const handleSaveQuotationToggle = () =>{
    saveAQuotation(quotation, leadID);
  }

  // QUOTATION ACTION
  const updateItem = (
    id: string,
    field: keyof QuotationItemType,
    value: any
  ) => {
    setQuotation((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.id === id
          ? {
              ...i,
              [field]: value,
              total:
                field === "price" || field === "quantity"
                  ? (field === "price" ? value : i.price) *
                    (field === "quantity" ? value : i.quantity)
                  : i.total,
            }
          : i
      ),
    }));
  };

  const addItem = () =>
    setQuotation((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          productID: "",
          productName: "",
          description: "",
          quantity: 1,
          price: 0,
          total: 0,
        },
      ],
    }));

  const deleteItem = (id: string) => {
    if (quotation.items.length <= 1) return;
    setQuotation((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const subtotal = useMemo(
    () => quotation.items.reduce((s, i) => s + i.total, 0),
    [quotation.items]
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const validToSendEmail = quotation.title.trim().length > 0;


  return (
    <div className="w-full min-h-screen">
      <PageHeader
        saveQuotationLoading={saveQuotationLoading}
        handleSaveQuotationToggle={handleSaveQuotationToggle}
        title={quotation.title}
        onChange={(t) => setQuotation((p) => ({ ...p, title: t }))}
        validToSendEmail={validToSendEmail}
      />

      <CustomerInformation
        quotation={quotation}
        setQuotation={setQuotation}
        leadDetailInfo={leadDetailInfo}
      />

      {/* TABLE */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6">
          <table className="w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th>Description</th>
                <th className="w-20">Quantity</th>
                <th className="w-32">Price</th>
                <th className="w-32">Total</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-2">
                    <select
                      value={item.productName}
                      className="w-full rounded px-2 py-1"
                      onChange={(e) => {
                        const p = listProduct.find(
                          (x) => x.productName === e.target.value
                        );
                        if (!p) return;
                        updateItem(item.id, "productID", p.productID);
                        updateItem(item.id, "productName", p.productName);
                        updateItem(item.id, "price", p.price);
                        updateItem(item.id, "description", p.description);
                      }}
                    >
                      <option value="">Select</option>
                      {listProduct.map((p) => (
                        <option key={p.productID} value={p.productName}>
                          {p.productName}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      className="w-full rounded px-2 py-1"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", Number(e.target.value))
                      }
                      className="w-full rounded px-2 py-1 text-right"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(item.id, "price", Number(e.target.value))
                      }
                      className="w-full rounded px-2 py-1 text-right"
                    />
                  </td>

                  <td className="text-right font-semibold">
                    {item.total.toLocaleString("vi-VN")} đ
                  </td>

                  <td
                    className="cursor-pointer text-red-500 text-center"
                    onClick={() => deleteItem(item.id)}
                  >
                    ✕
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addItem}
            className="mt-4 text-blue-600 hover:underline px-2 text-sm"
          >
          New
          </button>
        </div>
      </div>

      {/* TOTAL */}
      <div className="bg-gray-50 p-6 border-t flex justify-end">
        <div className="w-80">
          <div className="flex justify-between py-1">
            <span>Subtotal</span>
            <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Tax (10%)</span>
            <span>{tax.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="flex justify-between py-2 font-bold border-t mt-2">
            <span>Total</span>
            <span className="text-purple-600">
              {total.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
