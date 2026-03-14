"use client";
import SelectorComponent from "@/components/SelectorComponent";
import Image from "next/image";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  discountOption, productCategory, productColor,
  categoryOption, ProductDataType, ProductDetailType, productStatusOption
} from "@/lib/data.product";
import UploadImageIcon from "@/components/UploadImageIcon";
import { productInputFormat } from "@/util/productInputFormat";
import useAddProduct, { ResponseDataType } from "@/fetching/product/addProduct";
import UpLoadFileCSV from "@/components/UpLoadFileCSV";
import { useNotification } from "@/providers/NotificationProvider";

interface Props {
  handleWindowToggle: () => void,
  handleAddingProductEvent: (newProduct: ProductDataType) => void,
  handleAddingDetailProductEvent: (newProductDetail: ProductDetailType) => void,
  setSelectedCSVFile: React.Dispatch<React.SetStateAction<File | null>>,
}
// FUNCTION TO CONVERT RETRIEVED DATA INTO DETAIL PRODUCT DATA TYPE
const convertData = (responseProductData: ResponseDataType): ProductDetailType => {
  const data: ProductDetailType = {
    PRODUCT_ID: responseProductData.productId,
    PRODUCT_BRAND: responseProductData.productBrand,
    PRODUCT_CATEGORY: responseProductData.productCategory,
    PRODUCT_NAME: responseProductData.productName,
    DESCRIPTION: responseProductData.description,
    PRODUCT_SUBTITLE: responseProductData.productSubtitle,
    PURCHASE_UNIT_PRICE: responseProductData.purchaseUnitPrice,
    PRODUCTS: responseProductData.quantity,
    SKU: responseProductData.sku,
    STATUS: responseProductData.status,
    IMAGE1_URL: responseProductData.imageUrl,
    IMAGE2_URL: "",
    IMAGE3_URL: "",
    TAG: "",
    DISCOUNT: responseProductData.discount,
    DISCOUNT_TYPE: responseProductData.discountType,
    COLOR: "",
  };

  return data;
}

const AddingProductWindow = ({setSelectedCSVFile, handleWindowToggle, handleAddingProductEvent, handleAddingDetailProductEvent }: Props) => {
  //MAKE REQUEST TO DATABASE
  const { loading, data, error, requestAddingProduct } = useAddProduct();
  const {showNotification} = useNotification();
  //IMAGE CATEGORY 
  const [image1, setImage1] = useState<string>("");
  const [image2, setImage2] = useState<string>("");
  const [image3, setImage3] = useState<string>("");
  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);
  // DISCOUNT STATE
  const [discountType, setDiscountType] = useState<string>(discountOption[0]);
  // CREATED DATE STATE
  const [createdDate, setCreatedDate] = useState<string>("");
  // PRODUCT STATUS STATE
  const [inputProductStatus, setInputProductStatus] = useState<string>(productStatusOption[0]);

  // CATEGORY + COLOR STATE
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryOption[0]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [availableColor, setAvailableColor] = useState<string[] | null>(productColor[0].colors);

  // INPUT ELEMENT STATE
  const [inputProductDiscount, setInputProductDiscount] = useState<string>("");
  const [inputProductName, setInputProductsName] = useState<string>("");
  const [inputProductNumber, setInputProductsNumber] = useState<string>("");
  const [inputProductDescription, setInputProductDesccription] = useState<string>("");
  const [inputProductPrice, setInputProductPrice] = useState<string>("");
  const [inputProductBrand, setInputProductBrand] = useState<string>("");
  const [inputProductTag, setInputProductTag] = useState<string>("");
  const [inputProductSubtitle, setInputProductSubtitle] = useState<string>("");

  // RESET ALL INPUT FIELDS TO DEFAULT STATE
  const resetAllFields = () => {
    // RESET TEXT INPUTS
    setInputProductsName("");
    setInputProductsNumber("");
    setInputProductDesccription("");
    setInputProductPrice("");
    setInputProductBrand("");
    setInputProductTag("");
    setInputProductDiscount("");
    setInputProductSubtitle("");

    // RESET DROPDOWNS
    setSelectedCategory(categoryOption[0]);
    setDiscountType(discountOption[0]);

    // RESET COLOR OPTIONS
    setAvailableColor(productColor[0].colors);
    setSelectedColor(productColor[0].colors ? productColor[0].colors[0] : "");

    // RESET IMAGES
    setImage1("");
    setImage2("");
    setImage3("");

    // RESET DATE (IF ANY)
    setCreatedDate("");
  };

  // HANDLE 'PUBLISH' ICON BUTTON
  const handlePublishButtonToggle = async () => {
    // SET UP THE PRODUCT DETAIL DATA FIELDS (FOR INITIALIZE A FORM OF DETAIL DATA)
    let newDetailProduct: ProductDetailType = {
      PRODUCT_ID: "",
      PRODUCT_BRAND: inputProductBrand,
      PRODUCT_CATEGORY: selectedCategory,
      PRODUCT_NAME: inputProductName,
      DESCRIPTION: inputProductDescription,
      PRODUCT_SUBTITLE: inputProductSubtitle,
      PURCHASE_UNIT_PRICE: Number(inputProductPrice),
      PRODUCTS: Number(inputProductNumber),
      SKU: "",
      STATUS: inputProductStatus,
      IMAGE1_URL: image1,
      IMAGE2_URL: image2,
      IMAGE3_URL: image3,
      TAG: inputProductTag,
      DISCOUNT: inputProductDiscount ? Number(inputProductDiscount) : 0,
      DISCOUNT_TYPE: discountType,
      COLOR: selectedColor,
    };
    // SEND REQUEST TO DATABASE TO ADD NEW PRODUCT DETAIL
    try {
      const response = await requestAddingProduct({ newDetailProduct, imageFile1, imageFile2, imageFile3 });

      
      if (response?.code === 200 && response.data) {  
        const resData: ResponseDataType = response.data;
        newDetailProduct = convertData(resData);
        // DATA FORMATTING BEFORE DISPLAYING ON TABLE (INCLUDE: CALCULATE PUBLIC PRICE)
        const newProductLine = productInputFormat(newDetailProduct);

        // Adding product to current hook to reduce the activate time
        if (newProductLine !== null) {
          handleAddingProductEvent(newProductLine);
          handleAddingDetailProductEvent(newDetailProduct);
        }

        resetAllFields();
        handleWindowToggle();
        showNotification("Adding new product successfully");
      } else {
        showNotification("Failed to add a new product", true);
      }
    } catch (error) {
      showNotification(`Adding new product failed: \n${error}`, true);
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const selectedCategoryKey = productCategory.find(item => item.label === category)?.key;

    if (selectedCategoryKey) {
      const colors = productColor.find(item => item.key === selectedCategoryKey)?.colors || [];
      setAvailableColor(colors);
      setSelectedColor(colors[0]);
    }
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
                onChange={(e) => setInputProductsName(e.target.value)}
                value={inputProductName || ""}
                className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>

            {/* BRAND */}
            <div className="flex flex-col w-1/2 gap-1 text-sm font-normal gap-1">
              <span className="px-1 text-gray-600">Brand</span>
              <input
                type="text"
                placeholder="Brand..."
                onChange={(e) => setInputProductBrand(e.target.value)}
                value={inputProductBrand || ""}
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
                onChange={(e) => setInputProductsNumber(e.target.value)}
                value={inputProductNumber || ""}
                className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col h-[180px] gap-1 text-sm font-normal gap-1">
            <span className="px-1 text-gray-600">Description</span>
            <textarea
              placeholder="Description..."
              onChange={(e) => setInputProductDesccription(e.target.value)}
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
                onChange={(e) => setInputProductPrice(e.target.value)}
                value={inputProductPrice || ""}
                className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>

            {/* DISCOUNT */}
            <div className="flex flex-col w-1/2 gap-1 text-sm font-normal gap-1">
              <span className="px-1 text-gray-600">Discount</span>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Discount"
                  value={inputProductDiscount}
                  onChange={(e) => setInputProductDiscount(e.target.value)}
                  className="border rounded-lg w-3/4 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
                <SelectorComponent
                  options={discountOption}
                  optionSelector={discountType}
                  setOptionSelector={setDiscountType}
                  rounded="rounded-lg"
                  width="w-2/5"
                  fontSize="text-xs"
                  height="h-10"
                />
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
          <button className="border-[1px] px-4 py-2 rounded-lg text-xs hover:bg-gray-100 transition-all duration-200" 
          onClick={() => {
            handleWindowToggle();
            resetAllFields();
          }}>
            Cancel
          </button>
          <button onClick={handlePublishButtonToggle} className="px-4 py-2 rounded-lg text-xs bg-blue-500 text-white/90 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-sm">
            Publish
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="h-full w-1/3 flex flex-col gap-3">
        {/* LEFT UPPER SIDE  */}
        <div className="w-full h-fit bg-white rounded-2xl py-4 px-4 shadow-md hover:shadow-lg transition-all duration-300 gap-3 flex flex-col">
          {/* TAG  */}
          <div className="flex flex-col gap-1 text-sm font-normal gap-2">
            <span className="px-1 text-gray-600">Tag</span>
            <input
              type="text"
              placeholder="Type and enter"
              onChange={(e) => setInputProductTag(e.target.value)}
              className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
          </div>
          {/* PRODUCT SUBTITLE + STATUS  */}
          <div className="flex gap-3">
            <div className="flex flex-col w-1/2 gap-3 text-sm">
              <span className="px-1 text-gray-600">Product subtitle</span>
              <input
                type="text"
                placeholder="Type and enter"
                onChange={(e) => setInputProductSubtitle(e.target.value)}
                className="border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col w-1/2 gap-3 text-sm">
              <span className="px-1 text-gray-600">Product subtitle</span>
              <SelectorComponent fontSize={"text-xs"} width={"w-full"} options={productStatusOption} optionSelector={inputProductStatus} setOptionSelector={setInputProductStatus} />
            </div>
          </div>

          {/* IMAGE UPLOAD FROM USER  */}
          <div className="flex flex-col w-full gap-1 text-sm font-normal gap-2">
            <span className="px-1 text-gray-600">Product image</span>

            <div className="w-full h-[220px] gap-4 flex">
              {/* MAIN IMAGE */}
              <div className="w-1/2 h-full border rounded-lg flex justify-center items-center relative overflow-hidden group">
                <UploadImageIcon setFileImage={setImageFile1} setImage={setImage1} image={image1}/>
              </div>

              {/* SECONDARY IMAGES */}
              <div className="w-1/2 h-full gap-3 flex flex-col rounded-lg">
                {/* SECOND IMAGE */}
                <div className="w-full h-1/2 border rounded-lg flex justify-center items-center relative overflow-hidden group">
                  <UploadImageIcon setFileImage={setImageFile2} setImage={setImage2} image={image2}/>
                </div>

                {/* THIRD IMAGE */}
                <div className="w-full h-1/2 border rounded-lg flex justify-center items-center relative overflow-hidden group">
                  <UploadImageIcon setFileImage={setImageFile3} setImage={setImage3} image={image3}/>
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
        {/* LEFT LOWER SIDE  */}
        <div className="w-full flex-1 bg-white rounded-2xl py-2 px-2 shadow-md hover:shadow-lg transition-all duration-300 gap-3 flex flex-col">
          <UpLoadFileCSV setSelectedCSVFile={setSelectedCSVFile}/>
        </div>
      </div>
    </div>
  );
};

export default AddingProductWindow;