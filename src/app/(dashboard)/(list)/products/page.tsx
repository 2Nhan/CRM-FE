"use client";
import AddingProductWindow from "./AddingProductWindow";
import CategoryOptions from "./CategoryOptions";
import ProductsPageHeader from "./ProductsPageHeader";
import ProductsTable from "./ProductsTable";
import { useEffect, useState, useRef, useCallback } from "react";
import { ProductDataType, ProductDetailResponseType, ProductDetailType } from "@/lib/data.product";
import ProductDetailWindow from "./ProductDetailWindow";
import { useGetListProducts, useGetListProductWithPageNo } from "@/fetching/product/getListProducts";
import useDeleteProduct from "@/fetching/product/deleteProduct";
import ProductInCSVFile from "./ProductInCSVFile";
import { useNotification } from "@/providers/NotificationProvider";
import { useSearchParams } from "next/navigation";
import useSearchProduct from "@/fetching/product/searchProduct";
import { ProductFilterParams } from "@/lib/data.product";


// FUNCTION TO ASSIGN PRODUCT DETAIL INTO PRODUCT IN TABLE
const productTableData = (listProductDetail: ProductDetailType[]): ProductDataType[] => {
  // COMPUTE FINAL PUBLIC PRICE
  const publicProductPrice = (discountType: string, productPrice: number, discountValue: number): number => {
    if (discountType === "PERCENT") {
      return productPrice * (1 - discountValue / 100);
    } else if (discountType === "AMOUNT") {
      return productPrice - discountValue;
    } else {
      return productPrice;
    }
  };

  const result: ProductDataType[] = listProductDetail.map((item) => {
    const product: ProductDataType = {
      PRODUCT_ID: item.PRODUCT_ID,
      PRODUCT_NAME: item.PRODUCT_NAME,
      PRODUCT_SUBTITLE: item.PRODUCT_SUBTITLE,
      PURCHASE_UNIT_PRICE: publicProductPrice(item.DISCOUNT_TYPE, item.PURCHASE_UNIT_PRICE, item.DISCOUNT),
      PRODUCTS: item.PRODUCTS,
      SKU: item.SKU,
      STATUS: item.STATUS,
      ACTION: "",
    }
    return product;
  })
  return result;
}

// FUNCTION TO DELETE A PRODUCT IN PRODUCT DETAIL ARRAY 
const deleteProductDetailArray = (
  productID: string,
  productDetails: ProductDetailType[]
): ProductDetailType[] => {
  return productDetails.filter(item => item.PRODUCT_ID !== productID);
};

const Page = () => {
  const { showNotification } = useNotification();

  // INITALIZE SEARCH PRODUCT FETCHING FUNCTION 
  const {
    loading: loadingSearchProducts,
    searchProduct
  } = useSearchProduct();

  // INITIALIZE GET PRODUCT FETCHING FUNCTION 
  const {
    loading: loadingGetListProducts,
    data: dataGetListProducts,
    error: errorGetListProducts,
    getListProducts
  } = useGetListProducts();
  // INITIALIZE DELETE PRODUCT FETCHING FUNCTION
  const {
    loading: loadingDeleteProduct,
    error: errorDeleteProduct,
    deleteProduct
  } = useDeleteProduct();
  // INITIALIZE GET PRODUCT WITH PAGE NO
  const {
    loading: loadingGetListProductsWithNo,
    data: dataGetListProductsWithNo,
    error: errorGetListProductsWithNo,
    getListProductsWithPageNo
  } = useGetListProductWithPageNo();

  // STATE 
  const [products, setProducts] = useState<ProductDataType[]>([]);
  const [detailProducts, setDetailProducts] = useState<ProductDetailType[]>([]);
  const [windowVisible, setWindowVisible] = useState<boolean>(false);
  const [productDetailVisible, setProductDetailVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedCSVFile, setSelectedCSVFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // FUNCTION TO HANDLE 'ADDING' WINDOW TOGGLE
  const handleWindowToggle = (): void => {
    setWindowVisible((prev) => !prev);
  };
  // FUNCTION TO FETCHING DATA
  const hasFetched = useRef(false);
  const isInitialPageSet = useRef(false);

  // PAGENAVIGATION STATE
  const [totalPages, setTotalPages] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(-1);

  const resetPage = useCallback(async () => {
    try {
      const response = await getListProducts();

      const resData: ProductDetailResponseType[] = response.data;
      const pagination = response.pagination;

      if (resData) {
        const listDetailProduct: ProductDetailType[] = resData.map((item) => ({
          PRODUCT_ID: item.productId,
          PRODUCT_BRAND: item.productBrand,
          PRODUCT_CATEGORY: item.productCategory,
          PRODUCT_NAME: item.productName,
          DESCRIPTION: item.description,
          PRODUCT_SUBTITLE: item.productSubtitle,
          PURCHASE_UNIT_PRICE: item.purchaseUnitPrice,
          PRODUCTS: item.quantity,
          SKU: item.sku,
          STATUS: item.status,
          IMAGE1_URL: item.imageUrl,
          IMAGE2_URL: "",
          IMAGE3_URL: "",
          TAG: "",
          DISCOUNT: item.discount,
          DISCOUNT_TYPE: item.discountType,
          COLOR: "",
        }));

        setDetailProducts(listDetailProduct);
      }

      // SET PAGINATION
      if (pagination) {
        setTotalPages(pagination.totalPages);
        setCurrentPage(pagination.pageNumber);
      }

      isInitialPageSet.current = true;
    } catch (error) {
      alert(`List product fetching data error \n${error}`);
    }
  }, []);

  // INITIAL LOADING PRODUCT PAGE
  useEffect(() => {
    const fetchProducts = async () => {
      if (!hasFetched.current) {
        try {
          const response = await getListProducts();

          const resData: ProductDetailResponseType[] = response.data;
          const pagination = response.pagination;

          if (resData) {
            const listDetailProduct: ProductDetailType[] = resData.map((item) => ({
              PRODUCT_ID: item.productId,
              PRODUCT_BRAND: item.productBrand,
              PRODUCT_CATEGORY: item.productCategory,
              PRODUCT_NAME: item.productName,
              DESCRIPTION: item.description,
              PRODUCT_SUBTITLE: item.productSubtitle,
              PURCHASE_UNIT_PRICE: item.purchaseUnitPrice,
              PRODUCTS: item.quantity,
              SKU: item.sku,
              STATUS: item.status,
              IMAGE1_URL: item.imageUrl,
              IMAGE2_URL: "",
              IMAGE3_URL: "",
              TAG: "",
              DISCOUNT: item.discount,
              DISCOUNT_TYPE: item.discountType,
              COLOR: "",
            }));

            setDetailProducts(listDetailProduct);
          }

          // SET PAGINATION
          if (pagination) {
            setTotalPages(pagination.totalPages);
            setCurrentPage(pagination.pageNumber);
          }

          isInitialPageSet.current = true;
        } catch (error) {
          alert(`List product fetching data error \n${error}`);
        } finally {
          hasFetched.current = true;
        }
      }
    };

    fetchProducts();
  }, []);

  // FUNCTION TO HANDLE PAGENAVIGATION 
  useEffect(() => {
    const fetchProductsWithPageNo = async () => {
      if (!isInitialPageSet.current) return;

      if (searchTerm) {
        handleSearchProductEvent(currentPage);
        return;
      }

      if (showOptionSelect || minPrice || maxPrice){
        const params: ProductFilterParams = {
          status: showOptionSelect,
          minPrice: Number(minPrice) || 0,
          maxPrice: Number(maxPrice) || 0,
          pageNo: currentPage,
        };
        handleFilterProductEvent(params);
        return;
      }
      try {
        const response = await getListProductsWithPageNo(currentPage);

        const resData: ProductDetailResponseType[] = response.data;
        const pagination = response.pagination;

        if (resData) {
          const listDetailProduct: ProductDetailType[] = resData.map((item) => ({
            PRODUCT_ID: item.productId,
            PRODUCT_BRAND: item.productBrand,
            PRODUCT_CATEGORY: item.productCategory,
            PRODUCT_NAME: item.productName,
            DESCRIPTION: item.description,
            PRODUCT_SUBTITLE: item.productSubtitle,
            PURCHASE_UNIT_PRICE: item.purchaseUnitPrice,
            PRODUCTS: item.quantity,
            SKU: item.sku,
            STATUS: item.status,
            IMAGE1_URL: item.imageUrl,
            IMAGE2_URL: "",
            IMAGE3_URL: "",
            TAG: "",
            DISCOUNT: item.discount,
            DISCOUNT_TYPE: item.discountType,
            COLOR: "",
          }));

          setDetailProducts(listDetailProduct);
        }

        if (pagination) {
          setCurrentPage(pagination.pageNumber);
          setTotalPages(pagination.totalPages);
        }
      } catch (error) {
        showNotification(String(error), true);
      } finally {
        hasFetched.current = true;
      }
    };

    fetchProductsWithPageNo();
  }, [currentPage]);


  // FUNCTION TO HANDLE EVEN IF THE PRODUCT DETAILS ARRAY CHANGED
  useEffect(() => {
    const data = productTableData(detailProducts);
    setProducts(prev => {
      const same = JSON.stringify(prev) === JSON.stringify(data);
      return same ? prev : data;
    });
  }, [detailProducts]);

  // FUNCTION TO HANDLE 'DEARCH PRODUCT` ACTION 
  const handleSearchProductEvent = async (pageNo?: number) => {
    try {
      const response = await searchProduct(searchTerm, pageNo || 1);
      const resData: ProductDetailResponseType[] = response.data;
      const pagination = response.pagination;

      if (resData) {
        const listDetailProduct: ProductDetailType[] = resData.map((item) => ({
          PRODUCT_ID: item.productId,
          PRODUCT_BRAND: item.productBrand,
          PRODUCT_CATEGORY: item.productCategory,
          PRODUCT_NAME: item.productName,
          DESCRIPTION: item.description,
          PRODUCT_SUBTITLE: item.productSubtitle,
          PURCHASE_UNIT_PRICE: item.purchaseUnitPrice,
          PRODUCTS: item.quantity,
          SKU: item.sku,
          STATUS: item.status,
          IMAGE1_URL: item.imageUrl,
          IMAGE2_URL: "",
          IMAGE3_URL: "",
          TAG: "",
          DISCOUNT: item.discount,
          DISCOUNT_TYPE: item.discountType,
          COLOR: "",
        }));

        setDetailProducts(listDetailProduct);
      }

      // SET PAGINATION
      if (pagination) {
        setTotalPages(pagination.totalPages);
        setCurrentPage(pagination.pageNumber);
      }

      isInitialPageSet.current = true;

    } catch (error) {
      showNotification(String(error), true);
    } finally {
      hasFetched.current = true;
    }

  }
  // FUNCTION TO HANDLE 'ADDING PRODUCT' ACTION
  const handleAddingProductEvent = (newProduct: ProductDataType): void => {
    const arr = [...products];
    arr.push(newProduct);
    setProducts(arr);
  }
  // FUNCTION TO HANDLE 'ADDING PRODUCT DETAIL' ACTION
  const handleAddingDetailProductEvent = (newProductDetail: ProductDetailType): void => {
    console.log(newProductDetail);
    const arr = [...detailProducts];
    arr.push(newProductDetail);
    setDetailProducts(arr);
  }
  //  FUNCTION TO HANDLE 'VIEW PRODUCT DETAIL' ACTION
  const handleDetailProductWindowToggle = (product: HTMLElement | null): void => {
    setProductDetailVisible((prev) => !prev);
    if (product) {
      const productID = product.getAttribute("id");
      setSelectedProduct(productID);
    }
    else {
      setSelectedProduct(null);
    }
  }
  // FUNCTION TO HANDLE 'DELETE SPECIFIC PRODUCT' ACTION
  const handleDeleteProductButtonToggle = async (product: HTMLElement | null): Promise<void> => {
    const productId = product?.getAttribute("id");

    if (productId) {
      try {
        const response = await deleteProduct(productId);

        if (response) {
          const newDetailProductArray = deleteProductDetailArray(productId, detailProducts);
          setDetailProducts(newDetailProductArray);
          showNotification("Delete product successfully");
        } else {
          showNotification("Delete failed!", true);
        }
      } catch (error) {
        showNotification(`Delete failed ${error}`, true);
      }
    } else {
      showNotification("Invalid product ID!", true);
    }
  };

  const [showOptionSelect, setShowOptionSelect] = useState<string>("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const handleFilterProductEvent = async ({
    status,
    pageNo,
    minPrice,
    maxPrice,
  }: ProductFilterParams) => {
    try {
      const response = await getListProductsWithPageNo({
        pageNo,
        status,
        minPrice,
        maxPrice,
      });

      const resData: ProductDetailResponseType[] = response.data;
      const pagination = response.pagination;

      if (resData) {
        const listDetailProduct: ProductDetailType[] = resData.map((item) => ({
          PRODUCT_ID: item.productId,
          PRODUCT_BRAND: item.productBrand,
          PRODUCT_CATEGORY: item.productCategory,
          PRODUCT_NAME: item.productName,
          DESCRIPTION: item.description,
          PRODUCT_SUBTITLE: item.productSubtitle,
          PURCHASE_UNIT_PRICE: item.purchaseUnitPrice,
          PRODUCTS: item.quantity,
          SKU: item.sku,
          STATUS: item.status,
          IMAGE1_URL: item.imageUrl,
          IMAGE2_URL: "",
          IMAGE3_URL: "",
          TAG: "",
          DISCOUNT: item.discount,
          DISCOUNT_TYPE: item.discountType,
          COLOR: "",
        }));

        setDetailProducts(listDetailProduct);
      }

      if (pagination) {
        setTotalPages(pagination.totalPages);
        setCurrentPage(pagination.pageNumber);
      } else {
        setCurrentPage(pageNo);
      }
    } catch (error) {
      showNotification(String(error), true);
    }
  };


  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="bg-transparent w-full h-full flex flex-col gap-1">
        {/* PAGE HEADER */}
        <ProductsPageHeader
          currentPage={currentPage}
          resetPage={resetPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleWindowToggle={handleWindowToggle}
          handleSearchProductEvent={handleSearchProductEvent}
          handleFilterProductEvent={handleFilterProductEvent}

          showOptionSelect={showOptionSelect}
          setShowOptionSelect={setShowOptionSelect}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />
        {/* PRODUCT TABLE */}
        <ProductsTable
          loadingDeleteProduct={loadingDeleteProduct}
          handleDeleteProductButtonToggle={handleDeleteProductButtonToggle}
          sampleProducts={products}
          handleWindowToggle={handleWindowToggle}
          handleDetailProductWindowToggle={handleDetailProductWindowToggle}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>

      {/* --- ADDING PRODUCT WINDOW OR PRODUCT DETAIL WINDOW */}
      {productDetailVisible ? (
        <>
          {/* --- BACKDROP-PRODUCT DETAIL WINDOW --- */}
          <div
            className={`fixed inset-0 z-[90] transition-all duration-500 ${windowVisible
              ? "bg-black/40 backdrop-blur-sm visible opacity-100"
              : "invisible opacity-0"
              }`}
            onClick={() => {
              handleWindowToggle();
              handleDetailProductWindowToggle(null);
            }}
          ></div>

          {/* --- PRODUCT DETAIL WINDOW --- */}
          <div
            className={`fixed left-0 w-full h-full rounded-t-2xl absolute shadow-lg z-[100] transition-transform duration-500 ${windowVisible ? "bottom-0" : "translate-y-full"
              }`}
          >
            <ProductDetailWindow
              updateProductDetail={(productID, newProductUpdate) => {
                setDetailProducts((prev) => {
                  const index = prev.findIndex((item) => item.PRODUCT_ID === productID);
                  if (index === -1) return prev;

                  const updated = [...prev];
                  updated[index] = { ...updated[index], ...newProductUpdate };
                  return updated;
                });
              }}
              productID={selectedProduct}
              detailProductArray={detailProducts}
              handleWindowToggle={handleWindowToggle}
            />
          </div>
        </>
      ) : (
        <>
          {/* --- BACKDROP --- */}
          <div
            className={`fixed inset-0 z-[90] transition-all duration-500 ${windowVisible
              ? "bg-black/40 backdrop-blur-sm visible opacity-100"
              : "invisible opacity-0"
              }`}
            onClick={handleWindowToggle}
          ></div>

          {/* --- ADDING PRODUCT WINDOW --- */}
          <div
            className={`fixed left-0 w-full h-full rounded-t-2xl absolute shadow-lg z-[100] transition-transform duration-500 ${windowVisible ? "bottom-0" : "translate-y-full"
              }`}
          >
            {selectedCSVFile ?
              <ProductInCSVFile selectedCSVFile={selectedCSVFile} setSelectedCSVFile={setSelectedCSVFile} handleWindowToggle={handleWindowToggle} /> :
              <AddingProductWindow
                handleWindowToggle={handleWindowToggle}
                handleAddingDetailProductEvent={handleAddingDetailProductEvent}
                handleAddingProductEvent={handleAddingProductEvent}
                setSelectedCSVFile={setSelectedCSVFile}
              />
            }
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
