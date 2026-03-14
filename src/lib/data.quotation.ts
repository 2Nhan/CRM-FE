//---------------------------------------- QUOTATION TABLE -----------------------------------------
export type QuotationRow = {
  QuotationID?: string | null;
  QuotationTitle?: string | null;
  QuotationContent?: string | null;
  CreatedAt?: string | null;
  CustomerName?: string | null;
  FinalAmount?: number | null;
  Status?: string | null;
  Items?: number | null;
  ValidUntil?: string | null;
};

//---------------------------------------- QUOTATION STATISTIC -----------------------------------------
export type QuotationStatisticType = Record<string, number>;

//----------------------------------------- SAVE QUOTATION REQUEST TYPE -----------------------------------------
export type QuotationItemType = {
  id: string;
  productName: string;
  productID: string,
  description: string;
  quantity: number;
  price: number;
  total: number;
};

export type QuotationType = {
  leadID: string;
  title: string;
  content: string;
  items: QuotationItemType[];
};

//---------------------------------------- QUOTATION API RESPONSE -----------------------------------------
export interface QuotationItem {
  productId: string;
  name: string;
  discount: number;
  discountType: "PERCENT" | "AMOUNT" | string; 
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface UserRef {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email: string;
}

export interface Lead {
  id: string;
  fullName: string;
  email: string;
}

export interface ApiResponseListAllQuotation {
  id: string;
  lead: Lead;
  title: string;
  content: string;
  validUntil: string; 
  status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired" | string; 
  fileUrl: string | null;
  items: QuotationItem[];
  createdBy: UserRef;
  createdAt: string; 
  updatedAt: string; 
  untaxedAmount: number;
  finalAmount: number | null;
}

//---------------------------------------- REQUEST AND RESPONSE QUOTAION SUMMARY -----------------------------------------
export interface ApiResponseQuotationSummary{
  Draft: number,
  Ordered: number,
  Expired: number,
  Sent: number,
}
