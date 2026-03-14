"use client";

import { Listbox } from "@headlessui/react";
import { ChevronDown, Search, DollarSign, X, Check, Filter, FilterX } from "lucide-react";
import { useState, useEffect } from "react";
import ReorderOutlinedIcon from "@mui/icons-material/ReorderOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import { ProductFilterParams } from "@/lib/data.product";

const showOptions = ["None", "Active", "Preorder", "Low Stock", "Out of Stock"];

interface Props {
  currentPage: number;
  resetPage: () => void;

  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

  handleWindowToggle: () => void;
  handleSearchProductEvent: (pageNo?: number) => void;
  handleFilterProductEvent: (params: ProductFilterParams) => Promise<void>;

  showOptionSelect: string;
  setShowOptionSelect: React.Dispatch<React.SetStateAction<string>>;

  minPrice: string;
  setMinPrice: React.Dispatch<React.SetStateAction<string>>;

  maxPrice: string;
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
}

const ProductsPageHeader = ({
  currentPage,
  resetPage,
  searchTerm,
  setSearchTerm,
  handleWindowToggle,
  handleSearchProductEvent,
  handleFilterProductEvent,

  showOptionSelect,
  setShowOptionSelect,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: Props) => {
  // const [showOptionSelect, setShowOptionSelect] = useState(showOptions[0]);
  // const [minPrice, setMinPrice] = useState("");
  // const [maxPrice, setMaxPrice] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [hasFilterChanges, setHasFilterChanges] = useState(false);
  const [currentPageNo, setCurrentPageNo] = useState(1);

  const [activeFilters, setActiveFilters] = useState({
    status: showOptions[0],
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    setHasFilterChanges(
      showOptionSelect !== activeFilters.status ||
      minPrice !== activeFilters.minPrice ||
      maxPrice !== activeFilters.maxPrice
    );
  }, [showOptionSelect, minPrice, maxPrice, activeFilters]);

  const handleConfirmFilter = async () => {
    const params: ProductFilterParams = {
      status: showOptionSelect,
      minPrice: Number(minPrice) || 0,
      maxPrice: Number(maxPrice) || 0,
      pageNo: 1,
    };

    setActiveFilters({
      status: showOptionSelect,
      minPrice,
      maxPrice,
    });

    setIsFilterActive(true);
    setCurrentPageNo(1);
    await handleFilterProductEvent(params);
  };

  const handleCancelFilter = () => {
    setShowOptionSelect(activeFilters.status);
    setMinPrice(activeFilters.minPrice);
    setMaxPrice(activeFilters.maxPrice);
    setHasFilterChanges(false);
  };

  const handlePageChange = async (pageNo: number) => {
    setCurrentPageNo(pageNo);

    if (!isFilterActive) return;

    await handleFilterProductEvent({
      status: activeFilters.status,
      minPrice: Number(activeFilters.minPrice) || 0,
      maxPrice: Number(activeFilters.maxPrice) || 0,
      pageNo,
    });
  };

  const handleClearAllFilters = () => {
    setShowOptionSelect(showOptions[0]);
    setMinPrice("");
    setMaxPrice("");
    setActiveFilters({
      status: showOptions[0],
      minPrice: "",
      maxPrice: "",
    });
    setIsFilterActive(false);
    setHasFilterChanges(false);
    setCurrentPageNo(1);
  };

  return (
    <div className="w-full bg-white shadow-sm">
      {/* MAIN HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        {/* LEFT SIDE */}
        <div className="flex-1 flex gap-4 items-center">
          {/* VIEW TOGGLE */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600 hover:text-blue-600">
              <ReorderOutlinedIcon sx={{ width: "20px", height: "20px" }} />
            </button>
            <button className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600 hover:text-blue-600">
              <GridViewIcon sx={{ width: "20px", height: "20px" }} />
            </button>
          </div>

          {/* SEARCH BAR - Only visible when filter is not active */}
          {!isFilterActive && (
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by name or SKU..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchProductEvent();
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* FILTER ACTIVE INDICATOR */}
          {isFilterActive && (
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <Filter className="w-4 h-4 text-blue-600" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-700">Filters Active</span>
                <div className="flex gap-1.5">
                  {activeFilters.status !== "None" && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {activeFilters.status}
                    </span>
                  )}
                  {activeFilters.minPrice && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                      Min: ${activeFilters.minPrice}
                    </span>
                  )}
                  {activeFilters.maxPrice && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                      Max: ${activeFilters.maxPrice}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  handleClearAllFilters();
                  resetPage();
                }}
                className="ml-1 p-1.5 hover:bg-blue-100 rounded-full transition-colors group"
                title="Clear all filters"
              >
                <FilterX className="w-4 h-4 text-blue-600 group-hover:text-blue-800" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - ADD PRODUCT BUTTON */}
        <button
          onClick={handleWindowToggle}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Add Product</span>
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className="px-6 py-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">Product Filters</h3>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          {/* STATUS SELECTOR */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Status
            </label>
            <Listbox value={showOptionSelect} onChange={setShowOptionSelect}>
              <div className="relative">
                <Listbox.Button className="w-full flex justify-between items-center px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm">
                  <span>{showOptionSelect || "None"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Listbox.Button>

                <Listbox.Options className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-60 overflow-y-auto">
                  {showOptions.map((option) => (
                    <Listbox.Option
                      key={option}
                      value={option}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2.5 text-sm transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-gray-700"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <span className={selected ? "font-semibold" : "font-medium"}>
                            {option}
                          </span>
                          {selected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* MIN PRICE INPUT */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Min Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 placeholder:text-gray-400 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* MAX PRICE INPUT */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Max Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="No limit"
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 placeholder:text-gray-400 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          {/* ACTION BUTTONS - Only visible when there are changes */}
          {hasFilterChanges && (
            <div className="flex gap-2">
              <button
                onClick={handleConfirmFilter}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                <Check className="w-4 h-4" />
                Apply Filters
              </button>
              <button
                onClick={handleCancelFilter}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPageHeader;