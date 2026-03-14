"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ApiResponseQuotationSummary, QuotationRow, QuotationStatisticType, QuotationType } from "@/lib/data.quotation";
import { useNotification } from "./NotificationProvider";
import useGetListQuotation from "@/fetching/quotation/getAllQuotation";
import useSaveQuotation from "@/fetching/quotation/saveQuotation";
import useGetListQuotationWithPageNo from "@/fetching/quotation/getAllQuotationWithPageNo";
import { useRouter } from "next/navigation";
import useSearchQuotation from "@/fetching/quotation/searchQuotation";
import useQuotationSummary from "@/fetching/quotation/quotationSummary";

interface QuotationTableProviderContextType {
  getAllQuotationLoading: boolean;
  getAllQuotationWithPageNoLoading: boolean;
  saveQuotationLoading: boolean;
  saveAQuotation: (newQuotation: QuotationType, leadID: string) => void;
  getQuotationWithPageNo: (pageNo: number) => void;
  searchQuotationFunction: (searchTerm: string) => void;
  quotationRows: QuotationRow[];
  quotationStatistic: ApiResponseQuotationSummary | null;
  totalPages?: number;
}

const QuotationTableContext = createContext<QuotationTableProviderContextType | null>(null);

export const useQuotationTable = () => {
  const context = useContext(QuotationTableContext);
  if (!context) {
    throw new Error("useQuotationTable must be used within QuotationTableProvider");
  }

  return context;
}

interface QuotationTableProviderProps {
  children: ReactNode,
}

export const QuotationTableProvider: React.FC<QuotationTableProviderProps> = ({ children }) => {
  const { showNotification } = useNotification();
  const route = useRouter();

  // API HOOKS
  const { loading: getAllQuotationLoading, getAllQuotation } = useGetListQuotation();
  const { loading: saveQuotationLoading, saveQuotation } = useSaveQuotation();
  const { loading: getAllQuotationWithPageNoLoading, getAllQuotationWithPageNo } = useGetListQuotationWithPageNo();
  const { loading: searchQuotationLoading, searchQuotation} = useSearchQuotation();
  const { loading: quotaionSummaryLoading, quotationSummary} = useQuotationSummary();

  // STATE
  const [quotationRows, setQuotationRows] = useState<QuotationRow[]>([]);
  const [quotationStatistic, setQuotationStatistic] = useState<ApiResponseQuotationSummary | null>(null);
  const [totalPages, setTotalPage] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  // GET ALL QUOTATIONS - initial load uses page 1 pagination-aware endpoint
  const didFetch = useRef(false);

  const getQuotation = useCallback(async () => {
    try {
      const { quotationRows, quotationStatistic, dataPaganavigate } = await getAllQuotationWithPageNo(1);
      const result = await quotationSummary();
      if (quotationRows && result) {
        setQuotationRows(quotationRows);
        setQuotationStatistic(result);
        if (dataPaganavigate?.totalPages != null) {
          setTotalPage(dataPaganavigate.totalPages);
        }
      } else {
        showNotification("Error loading quotations", true);
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  }, [getAllQuotationWithPageNo, showNotification]);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    getQuotation();
  }, [getQuotation]);

  // GET QUOTATIONS WITH PAGE NO (called by UI when page changes)
  const getQuotationWithPageNo = async (pageNo: number) => {
    try {
      let result;
      if (searchTerm) {
        result = await searchQuotation(searchTerm, pageNo);
      } else {
        result = await getAllQuotationWithPageNo(pageNo);
      }

      const { quotationRows, dataPaganavigate } = result;

      if (quotationRows) {
        setQuotationRows(quotationRows);
        if (dataPaganavigate?.totalPages != null) {
          setTotalPage(dataPaganavigate.totalPages);
        }
      } else {
        showNotification("Error loading quotations", true);
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  }

  // SEARCH QUOTATION
  const searchQuotationFunction = async (term: string) => {
    setSearchTerm(term);
    try {
      const { quotationRows, dataPaganavigate } = await searchQuotation(term, 1);

      if (quotationRows) {
        setQuotationRows(quotationRows);
        if (dataPaganavigate?.totalPages != null) {
          setTotalPage(dataPaganavigate.totalPages);
        }
      } else {
        showNotification("Error searching quotations", true);
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  };

  // SAVE QUOTATION 
  const saveAQuotation = async (newQuotation: QuotationType, leadID: string) => {
    try {
      const resData = await saveQuotation(newQuotation, leadID);
      const responseQuotation: QuotationRow = {
        QuotationID: resData.id,
        QuotationContent: resData.content,
        QuotationTitle: resData.title,
        CreatedAt: resData.createdAt,
        CustomerName: resData.lead.fullName,
        FinalAmount: resData.finalAmount,
        Status: resData.status,
        Items: resData.items.length,
        ValidUntil: resData.validUntil,
      }

      setQuotationRows( prev => [...prev, responseQuotation]);
      showNotification("Quotation saved successfully");
      route.push(`/quotations/${resData.id}`);
    } catch (error) {
      showNotification(String(error), true);
    }
  };


  return (
    <QuotationTableContext.Provider
      value={{
        getAllQuotationLoading,
        saveQuotationLoading,
        getAllQuotationWithPageNoLoading,
        quotationRows,
        quotationStatistic,
        getQuotationWithPageNo,
        saveAQuotation,
        searchQuotationFunction,
        totalPages,
      }}
    >
      {children}
    </QuotationTableContext.Provider>
  );
};