"use client";

// step 1: Inherit the adding window to show the detail product display, enable to make edit on this
// step 2: re-change the structure of data of sample products in form which could illustrate all fields of a product
// step 3: in detail, whenever we click on the edit button of a specific products, retrieve its key or ID value
// step 4: base on this ID, let retrieve its element in database
// step 5: let use state to handle original data, if there is any changes, the state could catch up, in this case, we could assign to the old one

import StatusComponent from "./StatusComponent";
import { useState, useMemo } from "react";
import SortIcon from "@/components/SortIcon";
import { ProductDataType } from "@/lib/data.product"
import { moneyFormat } from "@/util/moneyFormat";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import PageNavigationComponent from "@/components/PageNavigationComponent";
// --- HEADER DATATYPE ---
type HeaderDataType = {
  id: number;
  key: string;
  label: string;
  width: string;
  justifyItems: string; // changed from alignItems
};

// --- TABLE HEADERS ---
const tableHeaders: HeaderDataType[] = [
  {
    id: 1,
    key: "PRODUCT_NAME",
    label: "Product Name",
    width: "w-[38%]",
    justifyItems: "justify-start", // left aligned
  },
  {
    id: 2,
    key: "PURCHASE_UNIT_PRICE",
    label: "Purchase Unit Price",
    width: "w-[15%]",
    justifyItems: "justify-center",
  },
  {
    id: 3,
    key: "PRODUCTS",
    label: "Products",
    width: "w-[15%]",
    justifyItems: "justify-center",
  },
  {
    id: 4,
    key: "SKU",
    label: "Internal Product ID",
    width: "w-[10%]",
    justifyItems: "justify-center",
  },
  {
    id: 5,
    key: "STATUS",
    label: "Status",
    width: "w-[10%]",
    justifyItems: "justify-center",
  },
  {
    id: 6,
    key: "ACTION",
    label: "Action",
    width: "w-[12%]",
    justifyItems: "justify-center",
  },
];

interface Props {
  sampleProducts: ProductDataType[],
  handleWindowToggle: () => void,
  handleDetailProductWindowToggle: (product: HTMLElement) => void,
  handleDeleteProductButtonToggle: (product: HTMLElement) => void,
  loadingDeleteProduct: boolean,
  totalPages: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  currentPage: number,
}

const ProductsTable = ({ loadingDeleteProduct, handleDeleteProductButtonToggle, sampleProducts, handleWindowToggle, handleDetailProductWindowToggle, totalPages, setCurrentPage, currentPage }: Props) => {
  const [sort, setSort] = useState<{ columnName: keyof ProductDataType; direction: "asc" | "desc" }>({
    columnName: "PRODUCT_NAME" as keyof ProductDataType,
    direction: "desc",
  });
  // STATE 
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  // SET UP THE COLUMN TO SORT AND SORT DIRECTION 
  const sortFunction = (header: HeaderDataType) => {
    setSort((prev) => ({
      columnName: header.key as keyof ProductDataType, // here is row data type because each column have specific type 
      direction:
        prev.columnName === header.key ? (prev.direction === "asc" ? "desc" : "asc") : "asc",
    }));
  };
  const sortedData = useMemo(() => {
    const arr = [...sampleProducts];
    arr.sort((a, b) => {
      const valA = a[sort.columnName];
      const valB = b[sort.columnName];

      if (typeof valA === "number" && typeof valB === "number") {
        return sort.direction === "asc" ? valA - valB : valB - valA;
      }
      return sort.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return arr;
  }, [sort, sampleProducts]); // Asurance for changing in sampleProducts item


  return (
    <div className="w-full h-full bg-white shadow-sm px-4 rounded-xl overflow-y-auto max-h-screen">
      <table className="w-full border-separate border-spacing-y-1 ">
        {/* --- TABLE HEADER --- */}
        <thead>
          <tr className="text-gray-400 font-semibold text-sm">
            {tableHeaders.map((header) => (
              <th
                key={header.id}
                className={`py-2 px-2 ${header.width}`}
                onClick={() => sortFunction(header)}
              >
                <div className={`flex ${header.justifyItems} items-center gap-1 cursor-pointer`}>
                  <span>{header.label}</span>
                  {sort.columnName === header.key && (
                    <SortIcon direction={sort.direction} className="size-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* --- TABLE BODY --- */}
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} className="h-[40px] text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
              {tableHeaders.map((column, idx) => {
                // STATUS COLUMN
                if (column.key === "STATUS") {
                  return (
                    <td key={idx} className="py-2">
                      <div className={`flex ${column.justifyItems}`}>
                        <StatusComponent status={row.STATUS} />
                      </div>
                    </td>
                  );
                }

                // ACTION COLUMN
                if (column.key === "ACTION") {
                  return (
                    <td key={idx} className="" id={row["PRODUCT_ID"]}>
                      <div className="flex justify-end gap-2 text-xs h-[35px]">
                        {/* EDIT BUTTON */}
                        <button
                          className="
                            flex items-center justify-center
                            bg-blue-500 text-white rounded-lg py-1 px-2 gap-1
                            transition-all duration-300 ease-in-out
                            hover:bg-blue-600 hover:scale-105 hover:shadow-md
                          "
                          onClick={(e) => {
                            const element = e.currentTarget.closest("td");
                            handleWindowToggle();
                            if (element) {
                              handleDetailProductWindowToggle(element);
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          Edit
                        </button>

                        {/* DELETE BUTTON */}
                        {loadingDeleteProduct && selectedProductId === row.PRODUCT_ID
                          ?
                          <FetchingLoadingStatus
                            loading={loadingDeleteProduct}
                            width="30%"
                            height="100%"
                            text=""
                            size={22}
                            color="#0077B6"
                            iconSx={{
                              px: "2px"
                            }}
                          /> :
                          <button
                            className="
                            flex items-center justify-center
                            text-gray-500 border rounded-lg py-1 px-2
                            transition-all duration-300 ease-in-out
                            hover:text-red-500 hover:border-red-400 hover:scale-110 hover:shadow-sm
                          "
                            onClick={(e) => {
                              const element = e.currentTarget.closest("td");
                              const id = element?.id;
                              if (id) { setSelectedProductId(id); }
                              if (element) {
                                handleDeleteProductButtonToggle(element);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        }
                      </div>
                    </td>
                  );
                }

                // PRICE COLUMN 
                if (column.key === "PURCHASE_UNIT_PRICE") {
                  return (
                    <td key={idx} className="py-2">
                      <div className={`flex ${column.justifyItems}`}>{moneyFormat(row["PURCHASE_UNIT_PRICE"])}đ</div>
                    </td>
                  );
                }

                if (column.key === "PRODUCT_NAME") {
                  return (
                    <td key={idx} className="py-2">
                      <div className={`flex ${column.justifyItems}`}>{row["PRODUCT_NAME"]}</div>
                      <div className="text-xs text-gray-400 mt-1">{row["PRODUCT_SUBTITLE"]}</div>
                    </td>
                  );
                }

                // DEFAULT COLUMN
                return (
                  <td key={idx} className="py-2">
                    <div className={`flex ${column.justifyItems}`}>{row[column.key as keyof ProductDataType]}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* PAGENAVIGATION  */}
      <div className="w-100% h-fit py-2 flex justify-center items-center">
        <PageNavigationComponent totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage} />
      </div>
    </div>
  );
};

export default ProductsTable;
