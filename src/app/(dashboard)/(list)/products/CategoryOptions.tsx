"use client";

import SelectorComponent from "@/components/SelectorComponent";
import { ProductDetailType } from "@/lib/data.product";
import { useState, useEffect } from "react";
const categoryOptions = ["All category", "Jacket", "Paint", "Jeans"];
const statusOptions = ["All status", "ACTIVE", "Out of Stock"];
const priceOptions = ["All price", "0 - 500,000", "500,000 - 1,000,000", "1,000,000 - 5,000,000"];
const storeOptions = ["All stores"];

interface filterProps {
  detailProducts: ProductDetailType[];
  selectedCategoryOption: string;
  selectedStatusOption: string;
  selectedPriceOption: string;
  selectedStoreOption: string;
}

const filterProduct = (filterOptions: filterProps): ProductDetailType[] => {
  const { detailProducts, selectedCategoryOption, selectedStatusOption, selectedPriceOption, selectedStoreOption } = filterOptions;
  let filteredProducts: ProductDetailType[] = [...detailProducts];

  // CATEGORY FILTER
  if (selectedCategoryOption !== categoryOptions[0]) {
    filteredProducts = filteredProducts.filter(
      (item) => item.PRODUCT_CATEGORY === selectedCategoryOption
    );
  }

  // STATUS FILTER
  if (selectedStatusOption !== statusOptions[0]) {
    filteredProducts = filteredProducts.filter(
      (item) => item.STATUS === selectedStatusOption
    );
  }

  // PRICE FILTER
  if (selectedPriceOption !== priceOptions[0]) {
    let min = 0, max = Infinity;
    if (selectedPriceOption.includes(" - ")) {
      const [minStr, maxStr] = selectedPriceOption.split(" - ");
      min = parseInt(minStr.replace(/,/g, ""));
      max = parseInt(maxStr.replace(/,/g, ""));
    }
    filteredProducts = filteredProducts.filter(
      (item) => item.PURCHASE_UNIT_PRICE >= min && item.PURCHASE_UNIT_PRICE <= max
    );
  }

  return filteredProducts;
};

interface Props {
  detailProducts: ProductDetailType[],
  setDetailProducts: React.Dispatch<React.SetStateAction<ProductDetailType[]>>,
}

const CategoryOptions = ({detailProducts, setDetailProducts}: Props) => {
  const [originalDetailProductData, setOriginalDetailProductData] = useState<ProductDetailType []>(detailProducts)
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<string>(categoryOptions[0]);
  const [selectedStatusOption, setSelectedStatusOption] = useState<string>(statusOptions[0]);
  const [selectedPriceOption, setSelectedPriceOption] = useState<string>(priceOptions[0]);
  const [selectedStoreOption, setSelectedStoreOption] = useState<string>(storeOptions[0]);

  useEffect(() => {
    const filteredProducts: ProductDetailType[] = filterProduct({
      selectedCategoryOption, 
      selectedStatusOption, 
      selectedPriceOption, 
      selectedStoreOption, 
      detailProducts: originalDetailProductData,
    });
    // setDetailProducts(filteredProducts);
    console.log("filtered actions");
  }, [selectedCategoryOption, selectedStatusOption, selectedPriceOption, selectedStoreOption]);

  return (
    <div className='w-full h-fit flex gap-5 py-4 px-4 bg-white'>
      {/* CATEGORY SELECTOR  */}
      <div className="flex flex-col gap-2 w-1/4">
        <span className="text-xs text-gray-600 font-semibold">Category</span>
        <SelectorComponent width="w-full" rounded="rounded-md" options={categoryOptions} optionSelector={selectedCategoryOption} setOptionSelector={setSelectedCategoryOption} fontSize={"text-xs"} />
      </div>
      {/* STATUS SELECTOR  */}
      <div className="flex flex-col gap-2 w-1/4">
        <span className="text-xs text-gray-600 font-semibold">Status</span>
        <SelectorComponent width="w-full" rounded="rounded-md" options={statusOptions} optionSelector={selectedStatusOption} setOptionSelector={setSelectedStatusOption} fontSize={"text-xs"} />
      </div>
      {/* PRICE SELECTOR  */}
      <div className="flex flex-col gap-2 w-1/4">
        <span className="text-xs text-gray-600 font-semibold">Price</span>
        <SelectorComponent width="w-full" rounded="rounded-md" options={priceOptions} optionSelector={selectedPriceOption} setOptionSelector={setSelectedPriceOption} fontSize={"text-xs"} />
      </div>
      {/* STORE SELECTOR  */}
      <div className="flex flex-col gap-2 w-1/4">
        <span className="text-xs text-gray-600 font-semibold">Stores</span>
        <SelectorComponent width="w-full" rounded="rounded-md" options={storeOptions} optionSelector={selectedStoreOption} setOptionSelector={setSelectedStoreOption} fontSize={"text-xs"} />
      </div>
    </div>
  )
}

export default CategoryOptions