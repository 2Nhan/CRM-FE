"use client";
import {
  ProductDetailType, productCategory, productColor,
  categoryOption, discountOption, productStatusOption, ProductDetailRequestType
} from "@/lib/data.product";
import { useEffect, useMemo, useState } from "react";
import UploadImageIcon from "@/components/UploadImageIcon";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import SelectorComponent from "@/components/SelectorComponent";
import useUpdateProduct from "@/fetching/product/updateProduct";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";

interface Props {
  productID: string | null;
  detailProductArray: ProductDetailType[];
  handleWindowToggle: () => void,
  updateProductDetail: (productID: string, newProductUpdate: ProductDetailType) => void,
}

// FUNCTION TO TAKE ONLY CHANGED VALUE
const getValueChanged = (original: any, updated: any) => {
  const changes: any = {};

  for (const key in original) {
    if (updated[key] !== undefined && updated[key] !== original[key]) {
      changes[key] = updated[key];
    }
  }
  return changes;
}

const ProductDetailWindow = ({ productID, detailProductArray, updateProductDetail, handleWindowToggle }: Props) => {
  // RETRIEVE PRODUCT FROM DETAIL PRODUCT ARRAY
  const retrievedProduct = useMemo(() => {
    if (!productID || !detailProductArray.length) return null;
    return detailProductArray.find((item) => item.PRODUCT_ID === productID) || null;
  }, [productID, detailProductArray]);
  // PRODUCT UPDATE FETCHING FUNCTION 
  const { loading, data, error, updateProduct } = useUpdateProduct();
  // STATE
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailType>(
    {
      PRODUCT_ID: "",
      PRODUCT_CATEGORY: "",
      PRODUCT_NAME: "",
      PRODUCT_BRAND: "",
      DESCRIPTION: "",
      PRODUCT_SUBTITLE: "",
      PURCHASE_UNIT_PRICE: 0,
      PRODUCTS: 0,
      SKU: "",
      STATUS: "",
      IMAGE1_URL: "",
      IMAGE2_URL: "",
      IMAGE3_URL: "",
      TAG: "",
      DISCOUNT: 0,
      DISCOUNT_TYPE: "",
      COLOR: "",
    }
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [availableColor, setAvailableColor] = useState<string[] | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [image1, setImage1] = useState<string>(retrievedProduct ? retrievedProduct.IMAGE1_URL : "");
  const [image2, setImage2] = useState<string>(retrievedProduct ? retrievedProduct.IMAGE2_URL : "");
  const [image3, setImage3] = useState<string>(retrievedProduct ? retrievedProduct.IMAGE3_URL : "");
  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);

  // UPDATE DATA FIELD STATE
  const [updateProductName, setUpdateProductName] = useState<string>("");
  const [updateProductBrand, setUpdateProductBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [updateProductNumber, setUpdateProductNumber] = useState<String>("");
  const [updateProductDescription, setUpdateProductDescription] = useState<string>("");
  const [selectedDiscountType, setSelectedDiscountType] = useState<string>("");
  const [updateProductSubtitle, setUpdateProductSubtitle] = useState<string>("");
  const [updateProductTag, setUpdateProductTag] = useState<string>("");
  const [updateProductPrice, setUpdateProductPrice] = useState<string>("");
  const [updateProductDiscount, setUpdateProductDiscount] = useState<string>("");
  // EFFECT HOOK
  useEffect(() => {
    if (!retrievedProduct) return;

    // SET MAIN PRODUCT DETAIL
    setSelectedProduct({
      ...retrievedProduct,
      DESCRIPTION: retrievedProduct.DESCRIPTION || "",
      PRODUCT_SUBTITLE: retrievedProduct.PRODUCT_SUBTITLE || "",
      IMAGE1_URL: retrievedProduct.IMAGE1_URL || "",
      IMAGE2_URL: retrievedProduct.IMAGE2_URL || "",
      IMAGE3_URL: retrievedProduct.IMAGE3_URL || "",
      TAG: retrievedProduct.TAG || "",
      DISCOUNT: retrievedProduct.DISCOUNT || 0,
      DISCOUNT_TYPE: retrievedProduct.DISCOUNT_TYPE || "",
    });

    // SYNC INDIVIDUAL UPDATE STATES
    setUpdateProductName(retrievedProduct.PRODUCT_NAME || "");
    setUpdateProductBrand(retrievedProduct.PRODUCT_BRAND || "");
    setSelectedCategory(retrievedProduct.PRODUCT_CATEGORY || "");
    setUpdateProductDescription(retrievedProduct.DESCRIPTION || "");
    setUpdateProductSubtitle(retrievedProduct.PRODUCT_SUBTITLE || "");
    setUpdateProductPrice(retrievedProduct.PURCHASE_UNIT_PRICE ? retrievedProduct.PURCHASE_UNIT_PRICE.toString() : "");
    setSelectedDiscountType(retrievedProduct.DISCOUNT_TYPE || "");
    setSelectedStatus(retrievedProduct.STATUS || "");
    setSelectedColor(retrievedProduct.COLOR || null);
    setUpdateProductNumber(retrievedProduct.PRODUCTS ? retrievedProduct.PRODUCTS.toString() : "");
    setUpdateProductTag(retrievedProduct.TAG || "");
    setUpdateProductDiscount(retrievedProduct.DISCOUNT ? retrievedProduct.DISCOUNT.toString() : "");

    // DETERMINE AVAILABLE COLORS BASED ON CATEGORY
    const categoryKey = productCategory.find(
      (item) => item.label === retrievedProduct.PRODUCT_CATEGORY
    )?.key;

    const colors = categoryKey
      ? productColor.find((item) => item.key === categoryKey)?.colors || null
      : null;

    setAvailableColor(colors);
  }, [retrievedProduct]);

  // FUNCTION TO HANDLE CATEGORY CHANGE EVENT, WE NEED TO UPDATE SOME FIELDS
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const selectedCategoryKey = productCategory.find(item => item.label === category)?.key;

    if (selectedCategoryKey) {
      const colors = productColor.find(item => item.key === selectedCategoryKey)?.colors || [];
      setAvailableColor(colors);
      setSelectedColor(null);
    }
  }

  // FUNCTION TO HANDLE PRODUCT UPDATE ACTION 
  const handleProductDetailUpdate = async () => {
    if (!retrievedProduct) { return; }
    const updatedDetailProduct: ProductDetailRequestType = {
      sku: retrievedProduct.SKU,
      name: updateProductName ? updateProductName : retrievedProduct.PRODUCT_NAME,
      description: updateProductDescription ? updateProductDescription : retrievedProduct.DESCRIPTION,
      subtitle: updateProductSubtitle ? updateProductSubtitle : retrievedProduct.PRODUCT_SUBTITLE,
      brand: updateProductBrand ? updateProductBrand : retrievedProduct.PRODUCT_BRAND,
      category: selectedCategory,
      quantity: updateProductNumber ? Number(updateProductNumber) : retrievedProduct.PRODUCTS,
      status: selectedStatus,
      price: updateProductPrice ? Number(updateProductPrice) : retrievedProduct.PURCHASE_UNIT_PRICE,
      discount: updateProductDiscount ? Number(updateProductDiscount) : retrievedProduct.DISCOUNT,
      discountType: selectedDiscountType,
    };
    const originalMapping: ProductDetailRequestType = {
      sku: retrievedProduct.SKU,
      name: retrievedProduct.PRODUCT_NAME,
      description: retrievedProduct.DESCRIPTION,
      subtitle: retrievedProduct.PRODUCT_SUBTITLE,
      brand: retrievedProduct.PRODUCT_BRAND,
      category: retrievedProduct.PRODUCT_CATEGORY,
      quantity: retrievedProduct.PRODUCTS,
      status: retrievedProduct.STATUS,
      price: retrievedProduct.PURCHASE_UNIT_PRICE,
      discount: retrievedProduct.DISCOUNT,
      discountType: selectedDiscountType,
    }
    const productChanges = getValueChanged(originalMapping, updatedDetailProduct);
    try {
      const response = await updateProduct(productChanges, retrievedProduct.PRODUCT_ID);

      if (response && response.code === 200) {
        const updatedReponse = response.data;
        const convertDetailProduct: ProductDetailType = {
          PRODUCT_ID: updatedReponse?.productId || "",
          PRODUCT_BRAND: updatedReponse?.productBrand || "",
          PRODUCT_CATEGORY: updatedReponse?.productCategory || "",
          PRODUCT_NAME: updatedReponse?.productName || "",
          DESCRIPTION: updatedReponse?.description || "",
          PRODUCT_SUBTITLE: updatedReponse?.productSubtitle || "",
          PURCHASE_UNIT_PRICE: updatedReponse?.purchaseUnitPrice || 0,
          PRODUCTS: updatedReponse?.quantity || 0,
          SKU: updatedReponse?.sku || "",
          STATUS: updatedReponse?.status || "",
          IMAGE1_URL: updatedReponse?.imageUrl || "",
          IMAGE2_URL: "",
          IMAGE3_URL: "",
          TAG: "",
          DISCOUNT: updatedReponse?.discount || 0,
          DISCOUNT_TYPE: updatedReponse?.discountType || "",
          COLOR: "",
        }
        updateProductDetail(convertDetailProduct.PRODUCT_ID, convertDetailProduct);
        handleWindowToggle();
      } else {
        alert("Failed to update product detail");
      }
    } catch (err) {
      alert(`Update product failed \n${err}`)
    }

  }

  // HANDLE THE UNIDENTIFIED PRODUCT
  if (!retrievedProduct) {
    return (
      <div className="p-5 text-gray-600">Product not found</div>
    );
  }

  return (
    <div className="bg-gray-200 w-full h-full flex p-5 gap-3 rounded-t-2xl shadow-2xl transition-all duration-500">
      {/* LEFT SIDE */}
      <div className="bg-white w-2/3 rounded-2xl p-5 flex flex-col gap-4 justify-between shadow-md hover:shadow-lg transition-all duration-300">
        {/* FORM CONTENT */}
        <div className="flex flex-col gap-4 h-4/5 overflow-y-auto px-2 py-2">
          {/* HEADING */}
          <div className="font-orbitron font-[500] text-gray-800 text-lg mb-2 tracking-wide">
            General Information
          </div>

          {/* PRODUCT NAME & BRAND */}
          <div className="flex gap-4">
            {/* PRODUCT NAME */}
            <div className="flex flex-col w-1/2 gap-1 text-sm font-normal gap-1">
              <span className="px-1 text-gray-600">Product Name</span>
              <input
                type="text"
                placeholder="Product name..."
                value={updateProductName || ""}
                onChange={(e) => setUpdateProductName(e.target.value)}
                className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>

            {/* BRAND */}
            <div className="flex flex-col w-1/2 gap-1 text-sm font-normal gap-1">
              <span className="px-1 text-gray-600">Brand</span>
              <input
                type="text"
                placeholder="Brand..."
                value={updateProductBrand || ""}
                onChange={(e) => setUpdateProductBrand(e.target.value)}
                className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* PRODUCT CATEGORY & PRODUCT NUMBER*/}
          <div className="flex gap-4">
            {/* PRODUCT CATEGORY */}
            <div className="flex flex-col w-full gap-1 text-sm">
              <span className="px-1 text-gray-600">Product Category</span>
              <Listbox value={selectedCategory} onChange={handleCategoryChange}>
                <div className="relative">
                  <Listbox.Button className="border rounded-lg px-4 py-2 w-full text-left flex justify-between items-center text-xs text-gray-800 focus:ring-2 focus:ring-blue-400">
                    {selectedCategory}
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg ring-1 ring-gray-200">
                    {categoryOption.map((option) => (
                      <Listbox.Option
                        key={option}
                        value={option}
                        className="cursor-pointer px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                      >
                        {option}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* PRODUCT NUMBER */}
            <div className="flex flex-col w-1/2 gap-1 text-sm font-normal gap-1">
              <span className="px-1 text-gray-600">Product number</span>
              <input
                type="text"
                placeholder="Number of products"
                onChange={(e) => setUpdateProductNumber(e.target.value)}
                value={
                  updateProductNumber !== undefined && updateProductNumber !== null
                    ? updateProductNumber.toString()
                    : selectedProduct.PRODUCTS?.toString() ?? "0"
                }
                className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col h-[180px] gap-1 text-sm font-normal gap-1">
            <span className="px-1 text-gray-600">Description</span>
            <textarea
              placeholder="Description..."
              value={updateProductDescription ? updateProductDescription : selectedProduct.DESCRIPTION || ""}
              onChange={(e) => setUpdateProductDescription(e.target.value)}
              className="border rounded-lg px-3 py-2 text-xs resize-none h-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            ></textarea>
          </div>

          {/* PRICE & DISCOUNT */}
          <div className="flex gap-4">
            {/* SALE PRICE */}
            <div className="flex flex-col w-1/2 gap-1 text-sm font-normal gap-1">
              <span className="px-1 text-gray-600">Sale Price</span>
              <input
                type="text"
                placeholder="Sale price"
                onChange={(e) => setUpdateProductPrice(e.target.value)}
                value={
                  updateProductPrice !== undefined && updateProductPrice !== null
                    ? updateProductPrice.toString()
                    : selectedProduct.PURCHASE_UNIT_PRICE?.toString() ?? "0"
                }
                className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>

            {/* DISCOUNT */}
            <div className="flex flex-col w-1/2 gap-1 text-sm font-normal">
              <span className="px-1 text-gray-600">Discount</span>
              <div className="flex gap-2 items-center">
                <input type="text" placeholder="Discount..."
                  value={
                    updateProductDiscount !== undefined && updateProductDiscount !== null
                      ? updateProductDiscount.toString()
                      : selectedProduct.DISCOUNT?.toString() ?? "0"
                  }
                  onChange={(e) => setUpdateProductDiscount(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
                <Listbox value={selectedDiscountType} onChange={setSelectedDiscountType}>
                  <div className="relative">
                    <Listbox.Button className="border rounded-lg px-4 py-2 w-full text-left flex justify-between items-center text-xs text-gray-800 focus:ring-2 focus:ring-blue-400 transition-all duration-200">
                      <span className={selectedDiscountType ? "text-gray-900" : "text-gray-500"}>
                        {selectedDiscountType || "No discount"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg ring-1 ring-gray-200 max-h-60 overflow-auto">
                      {discountOption.map((option) => (
                        <Listbox.Option
                          key={option}
                          value={option}
                          className="cursor-pointer px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                          {option}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
            </div>
          </div>

          {/* COLOR SELECTOR */}
          <div className="flex flex-col gap-2 text-sm font-normal mt-2">
            <span className="text-gray-700 font-medium px-1">Select Colors</span>
            <div className="flex flex-wrap gap-2 mt-1 px-2">
              {availableColor && availableColor.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 shadow-sm ${selectedColor === color
                    ? "scale-110 border-blue-500 ring-2 ring-blue-300"
                    : "border-gray-300 hover:scale-105 hover:ring-1 hover:ring-gray-300"
                    }`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="w-full h-fit flex justify-between mt-4">
          <button className="border-[1px] px-4 py-2 rounded-lg text-xs hover:bg-gray-100 transition-all duration-200" onClick={() => handleWindowToggle()}>
            Cancel
          </button>
          {
            loading ?
              <FetchingLoadingStatus loading={loading} color="blue" size={20} />
              :
              <button
                className="px-4 py-2 rounded-lg text-xs bg-blue-500 text-white/90 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-sm"
                onClick={() => handleProductDetailUpdate()}
              >
                Confirm update
              </button>
          }
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="h-full w-1/3 flex flex-col gap-3">
        {/* LEFT UPPER SIDE  */}
        <div className="w-full h-fit bg-white rounded-2xl py-4 px-4 shadow-md hover:shadow-lg transition-all duration-300 gap-3 flex flex-col">
          {/* TAG  */}
          <div className="flex flex-col wfull gap-1 text-sm font-normal gap-2">
            <span className="px-1 text-gray-600">Tag</span>
            <input
              type="text"
              placeholder="Type and enter"
              value={updateProductTag || ""}
              onChange={(e) => setUpdateProductTag(e.target.value)}
              className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
          </div>
          {/* PRODUCT SUBTITLE + STATUS  */}
          <div className="flex gap-3 text-sm">
            <div className="flex flex-col w-1/2 gap-3">
              <span className="px-1 text-gray-600 ">Product subtitle</span>
              <input
                type="text"
                placeholder="Type and enter"
                value={updateProductSubtitle || ""}
                onChange={(e) => setUpdateProductSubtitle(e.target.value)}
                className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col w-1/2 gap-3 text-sm">
              <span className="px-1 text-gray-600">Product status</span>
              <SelectorComponent fontSize={"text-xs"} width={"w-full"} options={productStatusOption} optionSelector={selectedStatus} setOptionSelector={setSelectedStatus} />
            </div>
          </div>
          {/* IMAGE UPLOAD FROM USER  */}
          <div className="flex flex-col w-full gap-1 text-sm font-normal gap-2">
            <span className="px-1 text-gray-600">Product image</span>

            <div className="w-full h-[220px] gap-4 flex">
              {/* MAIN IMAGE */}
              <div className="w-1/2 h-full border rounded-lg flex justify-center items-center relative overflow-hidden group">
                <UploadImageIcon setFileImage={setImageFile1} setImage={setImage1} image={image1} />
              </div>

              {/* SECONDARY IMAGES */}
              <div className="w-1/2 h-full gap-3 flex flex-col rounded-lg">
                {/* SECOND IMAGE */}
                <div className="w-full h-1/2 border rounded-lg flex justify-center items-center relative overflow-hidden group">
                  <UploadImageIcon setFileImage={setImageFile2} setImage={setImage2} image={image2} />
                </div>

                {/* THIRD IMAGE */}
                <div className="w-full h-1/2 border rounded-lg flex justify-center items-center relative overflow-hidden group">
                  <UploadImageIcon setFileImage={setImageFile3} setImage={setImage3} image={image3} />
                </div>
              </div>
            </div>
          </div>
          {/* CAUTION MESSAGE  */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm shadow-sm">
            {/* Icon */}
            <div className="flex-shrink-0 mt-[2px] text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>

            {/* Text */}
            <span className="leading-relaxed">
              You need at least <span className="font-semibold text-gray-700">3 images</span>.
              Pay attention to the quality of the pictures you add
              <span className="text-red-500 font-medium"> (important)</span>.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetailWindow;