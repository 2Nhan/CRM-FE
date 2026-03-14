export type OrderItemType = {
  productId: string;
  name: string;
  discount: number;
  discountType: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type CreatedByType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type OrderDataType = {
  id: string;
  orderCode: string;
  buyerName: string;
  shippingAddress: string;
  status: string;
  totalAmount: number;
  items: OrderItemType[];
  createdBy: CreatedByType;
};



export const sampleOrders: OrderDataType[] = [
  {
    id: "a55a6e4a-5a9e-4ed2-b33b-ad9edb3447f0",
    orderCode: "ORDER001",
    buyerName: "Le Tu Nhan",
    shippingAddress: "80A Bui Thi Xuan, Quy Nhon, Binh Dinh",
    status: "Pending",
    totalAmount: 526680000.0,
    items: [
      {
        productId: "1e79d515-b6d7-47bc-a2e1-873e854fcc87",
        name: "Macbook Pro M2 Max",
        discount: 5.0,
        discountType: "PERCENT",
        unitPrice: 70000000.0,
        quantity: 6,
        subtotal: 399000000.0,
      },
      {
        productId: "bdd42bd9-5a72-43ae-b7aa-de19580abcb1",
        name: "Ipad Gen 10",
        discount: 5.0,
        discountType: "PERCENT",
        unitPrice: 28000000.0,
        quantity: 3,
        subtotal: 79800000.0,
      },
    ],
    createdBy: {
      id: "978a7957-eeda-4fca-a0a8-83bcc96d6b93",
      firstName: "Quan",
      lastName: "Nguyen Thanh",
      email: "23521266@gmail.com",
    },
  },
  {
    id: "b66b7f5b-6b0f-58g3-940g-bg0fab4558g1",
    orderCode: "ORDER002",
    buyerName: "Nguyen Van A",
    shippingAddress: "123 Le Loi, Da Nang",
    status: "Processing",
    totalAmount: 156000000.0,
    items: [
      {
        productId: "2f80e626-c7e8-58cd-b3f2-984f0daa26ff",
        name: "iPhone 15 Pro",
        discount: 0,
        discountType: "PERCENT",
        unitPrice: 26000000.0,
        quantity: 6,
        subtotal: 156000000.0,
      },
    ],
    createdBy: {
      id: "978a7957-eeda-4fca-a0a8-83bcc96d6b93",
      firstName: "Quan",
      lastName: "Nguyen Thanh",
      email: "23521266@gmail.com",
    },
  },
  {
    id: "c77c8g6c-7c1g-69h4-051h-ch1gbc5669h2",
    orderCode: "ORDER003",
    buyerName: "Tran Thi B",
    shippingAddress: "456 Nguyen Hue, Ho Chi Minh",
    status: "Delivered",
    totalAmount: 84000000.0,
    items: [
      {
        productId: "3g91f737-d8f9-69de-c4g3-095g1ebb37gg",
        name: "Samsung Galaxy S24",
        discount: 10,
        discountType: "PERCENT",
        unitPrice: 21000000.0,
        quantity: 4,
        subtotal: 84000000.0,
      },
    ],
    createdBy: {
      id: "089b968f-ffeb-5gdb-b1b9-94cdd07e7c04",
      firstName: "Minh",
      lastName: "Le Hoang",
      email: "leminh@example.com",
    },
  },
];

export type OrderDetailType = {
  id: string;
  orderCode: string;
  buyerName: string;
  shippingAddress: string;
  status: string;
  totalAmount: number;
  items: OrderItemType[];
  createdBy: CreatedByType;
};

export const orderDetailData: OrderDetailType = {
  id: "a55a6e4a-5a9e-4ed2-b33b-ad9edb3447f0",
  orderCode: "ORDER001",
  buyerName: "Le Tu Nhan",
  shippingAddress: "80A Bui Thi Xuan, Quy Nhon, Binh Dinh",
  status: "Pending",
  totalAmount: 526680000.0,
  items: [
    {
      productId: "1e79d515-b6d7-47bc-a2e1-873e854fcc87",
      name: "Macbook Pro M2 Max",
      discount: 5.0,
      discountType: "PERCENT",
      unitPrice: 70000000.0,
      quantity: 6,
      subtotal: 399000000.0,
    },
    {
      productId: "bdd42bd9-5a72-43ae-b7aa-de19580abcb1",
      name: "Ipad Gen 10",
      discount: 5.0,
      discountType: "PERCENT",
      unitPrice: 28000000.0,
      quantity: 3,
      subtotal: 79800000.0,
    },
  ],
  createdBy: {
    id: "978a7957-eeda-4fca-a0a8-83bcc96d6b93",
    firstName: "Quan",
    lastName: "Nguyen Thanh",
    email: "23521266@gmail.com",
  },
};