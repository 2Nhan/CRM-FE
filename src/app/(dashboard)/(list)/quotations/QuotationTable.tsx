"use client";

import { useState, useMemo } from "react";
import SortIcon from "@/components/SortIcon";
import QuotationStatusComponent from "./QuotationStatusComponent";
import PageNavigationComponent from "@/components/PageNavigationComponent";
import { moneyFormat } from "@/util/moneyFormat";
import { QuotationRow } from "@/lib/data.quotation";
import { useQuotationTable } from "@/providers/QuotationTableProvider";
import { useRouter } from "next/navigation";

type HeaderDataType = {
  id: number;
  key: keyof QuotationRow;
  label: string;
  width: string;
  justifyItems: string;
};

const tableHeaders: HeaderDataType[] = [
  {
    id: 1,
    key: "QuotationTitle",
    label: "Quotation Title",
    width: "w-[20%]",
    justifyItems: "justify-start",
  },
  {
    id: 2,
    key: "CreatedAt",
    label: "Created Date",
    width: "w-[15%]",
    justifyItems: "justify-center",
  },
  {
    id: 3,
    key: "CustomerName",
    label: "Customer Name",
    width: "w-[15%]",
    justifyItems: "justify-center",
  },
  {
    id: 4,
    key: "FinalAmount",
    label: "Final Amount",
    width: "w-[10%]",
    justifyItems: "justify-center",
  },
  {
    id: 5,
    key: "Status",
    label: "Status",
    width: "w-[10%]",
    justifyItems: "justify-center",
  },
  {
    id: 6,
    key: "Items",
    label: "Items",
    width: "w-[6%]",
    justifyItems: "justify-center",
  },
  {
    id: 7,
    key: "ValidUntil",
    label: "Valid Until",
    width: "w-[15%]",
    justifyItems: "justify-center",
  },
];


interface Props {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}


const QuotationTable = ({
  totalPages,
  currentPage,
  setCurrentPage,
}: Props) => {
  // ROUTER 
  const router = useRouter();

  // QUOTATION TABLE PROVIDER
  const {
    getAllQuotationLoading,
    quotationRows,
  } = useQuotationTable();

  const [sort, setSort] = useState<{
    columnName: keyof QuotationRow;
    direction: "asc" | "desc";
  }>({
    columnName: "QuotationID",
    direction: "asc",
  });

  const sortFunction = (header: HeaderDataType) => {
    setSort((prev) => ({
      columnName: header.key,
      direction:
        prev.columnName === header.key
          ? prev.direction === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  };

  const sortedData = useMemo(() => {
    const arr = [...quotationRows];
    arr.sort((a, b) => {
      const A = a[sort.columnName];
      const B = b[sort.columnName];

      if (A == null && B == null) return 0;
      if (A == null) return 1;
      if (B == null) return -1;

      if (typeof A === "number" && typeof B === "number") {
        return sort.direction === "asc" ? A - B : B - A;
      }

      return sort.direction === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });
    return arr;
  }, [quotationRows, sort]);


  return (
    <div className="h-full min-h-1 rounded-xl flex flex-col p-3">
      {getAllQuotationLoading ?
        ""
        :
        <div className="h-fit max-h-full min-h-1 bg-white rounded-xl flex flex-col p-3">
          {/* TABLE AREA */}
          <div className="w-full flex-1 bg-white shadow-sm rounded-xl bg-gray-300/50 overflow-hidden border-[1px]">
            <div className="h-full overflow-y-auto">
              <table className="w-full h-full border-spacing-y-1">
                {/* -------- TABLE HEADER -------- */}
                <thead className="sticky top-0 z-10 bg-gray-100">
                  <tr className="text-gray-400 text-sm font-semibold h-[40px]">
                    {tableHeaders.map((header) => (
                      <th
                        key={header.id}
                        className={`px-2 ${header.width}`}
                        onClick={() => sortFunction(header)}
                      >
                        <div
                          className={`flex ${header.justifyItems} items-center gap-1 cursor-pointer`}
                        >
                          {header.label}
                          {sort.columnName === header.key && (
                            <SortIcon direction={sort.direction} className="size-4" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* -------- TABLE BODY -------- */}
                <tbody className="bg-white">
                  {quotationRows.map((row, rowIndex) => (
                    <tr
                      onClick={() => {
                        router.push(`/quotations/${row.QuotationID}`);
                      }}
                      key={rowIndex}
                      className="
                        h-[40px]                           
                        text-sm text-gray-700
                        hover:bg-gray-50
                        transition
                      "
                    >
                      {tableHeaders.map((column, colIndex) => {
                        const value = row[column.key] ?? "null";

                        /* ---- STATUS ---- */
                        if (column.key === "Status") {
                          return (
                            <td key={colIndex} className="py-[3px] px-2">
                              <div
                                className={`flex ${column.justifyItems} items-center h-full`}
                              >
                                {row.Status ? (
                                  <QuotationStatusComponent
                                    status={row.Status}
                                  />
                                ) : (
                                  "null"
                                )}
                              </div>
                            </td>
                          );
                        }

                        /* ---- FINAL AMOUNT ---- */
                        if (column.key === "FinalAmount") {
                          return (
                            <td key={colIndex} className="py-[3px] px-2">
                              <div
                                className={`flex ${column.justifyItems} items-center h-full`}
                              >
                                {value === "null"
                                  ? "null"
                                  : moneyFormat(value as number) + "đ"}
                              </div>
                            </td>
                          );
                        }

                        if (column.key === "ValidUntil") {
                          return (
                            <td key={colIndex} className="py-[3px] px-2">
                              <div
                                className={`flex ${column.justifyItems} items-center h-full`}
                              >
                                {new Date(value).toLocaleString("vi-VN")}
                              </div>
                            </td>
                          );
                        }

                        if (column.key === "CreatedAt") {
                          return (
                            <td key={colIndex} className="py-[3px] px-2">
                              <div
                                className={`flex ${column.justifyItems} items-center h-full`}
                              >
                                {new Date(value).toLocaleString("vi-VN")}
                              </div>
                            </td>
                          );
                        }

                        /* ---- DEFAULT ---- */
                        return (
                          <td key={colIndex} className="py-[3px] px-2">
                            <div
                              className={`flex ${column.justifyItems} items-center h-full`}
                            >
                              {String(value)}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* -------- PAGINATION -------- */}
          <div className="h-[70px] flex items-center justify-center bg-white">
            <PageNavigationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </ div>
      }
    </div>
  );
};

export default QuotationTable;
