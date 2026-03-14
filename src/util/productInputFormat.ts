import { ProductDataType, ProductDetailType } from "@/lib/data.product";

// REQUIRED FIELDS:
// * PRODUCT_NAME: string
// * PRODUCT_ID: string
// * PRODUCT_BRAND: string
// * PRODUCT_CATEGORY: string
// * PURCHASE_UNIT_PRICE: number
// * PRODUCTS: number
// OPTIONAL:
// * DISCOUNT: number | null
// * DISCOUNT_TYPE: string
// * COLOR: string | null

export const productInputFormat = (detailProduct: ProductDetailType): ProductDataType | null => {
  // Check for required fields
  const missingFields: string[] = [];

  // Check each required field and add to missingFields if invalid
  if (!detailProduct.PRODUCT_NAME || detailProduct.PRODUCT_NAME.trim() === "") {
    missingFields.push("PRODUCT_NAME");
  }

  if (!detailProduct.PRODUCT_ID || detailProduct.PRODUCT_ID.trim() === "") {
    missingFields.push("PRODUCT_ID");
  }

  if (!detailProduct.PRODUCT_BRAND || detailProduct.PRODUCT_BRAND.trim() === "") {
    missingFields.push("PRODUCT_BRAND");
  }

  if (!detailProduct.PRODUCT_CATEGORY || detailProduct.PRODUCT_CATEGORY.trim() === "") {
    missingFields.push("PRODUCT_CATEGORY");
  }

  if (
    detailProduct.PURCHASE_UNIT_PRICE == null ||
    isNaN(Number(detailProduct.PURCHASE_UNIT_PRICE)) ||
    Number(detailProduct.PURCHASE_UNIT_PRICE) <= 0
  ) {
    missingFields.push("PURCHASE_UNIT_PRICE");
  }

  if (
    detailProduct.PRODUCTS == null ||
    isNaN(Number(detailProduct.PRODUCTS)) ||
    Number(detailProduct.PRODUCTS) <= 0
  ) {
    missingFields.push("PRODUCTS");
  }

  // If there are missing or invalid fields → warn and return null
  if (missingFields.length > 0) {
    alert(`❌ Missing or invalid product fields: ${missingFields.join(", ")}`);
    return null;
  }

  const discountType = detailProduct.DISCOUNT_TYPE;
  const productPrice = Number(detailProduct.PURCHASE_UNIT_PRICE) || 0;
  const discountValue = Number(detailProduct.DISCOUNT) || 0;

  // Compute public (final) price after discount
  const publicProductPrice = (): number => {
    if (discountType === "PERCENT") {
      return productPrice * (1 - discountValue / 100);
    } else if (discountType === "fixed") {
      return productPrice - discountValue;
    } else {
      // no valid discount type
      return productPrice;
    }
  };

  // Return formatted product data
  const formatted: ProductDataType = {
    PRODUCT_ID: detailProduct.PRODUCT_ID,
    PRODUCT_NAME: detailProduct.PRODUCT_NAME,
    PRODUCT_SUBTITLE: detailProduct.PRODUCT_SUBTITLE,
    PURCHASE_UNIT_PRICE: publicProductPrice(),
    PRODUCTS: detailProduct.PRODUCTS,
    SKU: "",
    STATUS: detailProduct.STATUS,
    ACTION: "Edit",
  };

  return formatted;
};