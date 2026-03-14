//************************************************ PRODUCT PAGE ****************************************************/
// ---  PRODUCT (DISPLAY IN PRODUCT TABLE) DATATYPE ---
export type ProductDataType = {
  PRODUCT_ID: string,
  PRODUCT_NAME: string;
  PRODUCT_SUBTITLE: string;   // Added subtitle field
  PURCHASE_UNIT_PRICE: number;
  PRODUCTS: number;
  SKU: string;
  STATUS: string;
  ACTION: string;
};

// --- DETAIL PRODUCT DATATYPE ---
export type ProductDetailType = {
  PRODUCT_ID: string,
  PRODUCT_BRAND: string,
  PRODUCT_CATEGORY: string,
  PRODUCT_NAME: string;
  DESCRIPTION: string;
  PRODUCT_SUBTITLE: string;
  PURCHASE_UNIT_PRICE: number;
  PRODUCTS: number;
  SKU: string;
  STATUS: string;
  IMAGE1_URL: string;
  IMAGE2_URL: string;
  IMAGE3_URL: string;
  TAG: string | null;
  DISCOUNT: number;
  DISCOUNT_TYPE: string;
  COLOR: string;
};

// PRODUCT DISCOUNT OPTIONS
export const discountOption = ["PERCENT", "AMOUNT"];

// ----- PRODUCT CATEGORY DATA TYPE
export type productCategoryType = {
  id: number,
  key: string,
  label: string,
};

// ----- PRODUCT CATEGORY TABLE
export const productCategory: productCategoryType[] = [
  {
    id: 1,
    key: "MACBOOK",
    label: "MacBook",
  },
  {
    id: 2,
    key: "IPAD",
    label: "iPad",
  },
  {
    id: 3,
    key: "IPHONE",
    label: "iPhone",
  },
  {
    id: 4,
    key: "AIRPOD",
    label: "Air pod",
  },
  {
    id: 5,
    key: "IMAC",
    label: "Imac",
  },
  {
    id: 6,
    key: "MAC_MINI",
    label: "Mac mini",
  },
  {
    id: 7,
    key: "APPLE_DISPLAY",
    label: "Apple display",
  },
  {
    id: 8,
    key: "ACCESSORIES",
    label: "Apple accessories"
  },
  {
    id: 9,
    key: "APPLE_WATCH",
    label: "Apple Watch",
  }
];

// ----- PRODUCT COLOR OPTION
export type productColorType = {
  id: number,
  key: string,
  colors: string[],
}
export const productColor: productColorType[] = [
  {
    id: 1,
    key: "MACBOOK",
    colors: ["#D4AF37", "#B8B0B0", "#A3AAAE", "#F5F5F7"],
  },
  {
    id: 2,
    key: "IPAD",
    colors: ["#E8C5A3", "#B1B1B1", "#1C1C1E", "#F5F5F7", "#C5B9E3"], // Starlight, Silver, Space Gray, Blue, Purple
  },
  {
    id: 3,
    key: "IPHONE",
    // iPhone 15 style colors
    colors: ["#1C1C1E", "#D4AF37", "#F2F2F2", "#C5B9E3", "#E8C5A3", "#2B6CB0"], // Black, Gold, White, Purple, Starlight, Blue
  },
  {
    id: 4,
    key: "AIRPOD",
    colors: ["#F2F2F2"], // White
  },
  {
    id: 5,
    key: "IMAC",
    colors: ["#0A84FF", "#FF453A", "#30D158", "#FFD60A", "#BF5AF2", "#FF9F0A", "#F5F5F7"], // Blue, Red, Green, Yellow, Purple, Orange, Silver
  },
  {
    id: 6,
    key: "MAC_MINI",
    colors: ["#B1B1B1", "#1C1C1E"], // Silver, Space Gray
  },
  {
    id: 7,
    key: "APPLE_DISPLAY",
    colors: ["#F5F5F7", "#A3AAAE"], // Silver, Space Gray
  },
  {
    id: 8,
    key: "ACCESSORIES",
    colors: ["#1C1C1E", "#F5F5F7", "#E8C5A3", "#0A84FF", "#FF9F0A"], // Black, White, Starlight, Blue, Orange
  },
  {
    id: 9,
    key: "APPLE_WATCH",
    colors: [
      "#C0C6CC", // Silver
      "#1D1D1F", // Space Gray
      "#D7B18A", // Gold
      "#0B1320", // Midnight
      "#F3EAE3", // Starlight
      "#2A2A2D", // Graphite
      "#93B6D6", // Sierra Blue
      "#2E8B57", // Green
      "#007AFF", // Blue
      "#FF3B30", // Product(RED)
      "#FFB6C1", // Pink
      "#FFFFFF", // White
      "#000000"  // Black
    ]
  }
];
// ----- PRODUCT CATEGORY OPTIONS
export const categoryOption = productCategory.map(item => item.label);

// ----- PRODUCT STATUS OPTION 
export const productStatusOption = ["Active", "Low Stock", "Preorder", "Out of Stock"];

// ---------- PRODUCT FETCHING DATA TYPE
export interface ProductDetailRequestType {
  sku: string;
  name: string;
  description: string;
  subtitle: string;
  brand: string;
  category: string;
  quantity: number;
  status: "AVAILABLE" | "OUT_OF_STOCK" | "INACTIVE" | string; // extendable
  price: number;
  discount: number;
  discountType: "PERCENT" | "AMOUNT" | string;
}

export interface ProductDetailResponseType {
  productId: string,
  sku: string,
  productName: string,
  description: string,
  productSubtitle: string,
  productBrand: string,
  productCategory: string,
  quantity: number,
  status: string,
  purchaseUnitPrice: number
  discount: number,
  discountType: string,
  imageUrl: string,
  tag: string | null
}

// types/product.ts
export interface ProductFilterParams {
  status: string;
  pageNo: number;
  minPrice: number;
  maxPrice: number;
}
