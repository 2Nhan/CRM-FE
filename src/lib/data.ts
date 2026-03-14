// TEMPORARY DATA

export let role = "Admin";

// export const URL = "http://13.251.45.52:8088/crm/api/v1";
export const URL = "https://www.crmsoft.site/crm/api/v1";

// YOU SHOULD CHANGE THE DATES OF THE EVENTS TO THE CURRENT DATE TO SEE THE EVENTS ON THE CALENDAR
export const calendarEvents = [
  // Week 1
  {
    title: "Math",
    allDay: false,
    start: new Date(2025, 9, 20, 8, 0), // Oct 20, 2025 - 08:00
    end: new Date(2025, 9, 20, 8, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2025, 9, 22, 9, 0), // Oct 21, 2025 - 09:00
    end: new Date(2025, 9, 22, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2025, 9, 22, 10, 0), // Oct 22, 2025 - 10:00
    end: new Date(2025, 9, 22, 10, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2025, 9, 23, 11, 0), // Oct 23, 2025 - 11:00
    end: new Date(2025, 9, 23, 11, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2025, 9, 24, 8, 0), // Oct 24, 2025 - 08:00
    end: new Date(2025, 9, 24, 8, 45),
  },
  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2025, 9, 25, 9, 0), // Oct 25, 2025 - 09:00
    end: new Date(2025, 9, 25, 9, 45),
  },

  // Week 2
  {
    title: "Music",
    allDay: false,
    start: new Date(2025, 9, 25, 11, 0), // Oct 27, 2025 - 10:00
    end: new Date(2025, 9, 25, 11, 45),
  },
  {
    title: "Geography",
    allDay: false,
    start: new Date(2025, 9, 25, 13, 0), // Oct 28, 2025 - 13:00
    end: new Date(2025, 9, 25, 13, 45),
  },
  {
    title: "Art",
    allDay: false,
    start: new Date(2025, 9, 25, 8, 0), // Oct 29, 2025 - 08:00
    end: new Date(2025, 9, 25, 8, 45),
  },
  {
    title: "Literature",
    allDay: false,
    start: new Date(2025, 9, 25, 9, 0), // Nov 1, 2025 - 09:00
    end: new Date(2025, 9, 25, 9, 45),
  },
  {
    title: "Cycber security",
    allDay: false,
    start: new Date(2025, 9, 25, 9, 0), // Nov 1, 2025 - 09:00
    end: new Date(2025, 9, 25, 9, 45),
  },

  // Extra activities & duplicates for variety
  {
    title: "Math Review Session",
    allDay: false,
    start: new Date(2025, 9, 22, 15, 0), // Oct 22, 2025 - 15:00
    end: new Date(2025, 9, 22, 16, 0),
  },
  {
    title: "Science Club Meeting",
    allDay: false,
    start: new Date(2025, 9, 24, 14, 0), // Oct 24, 2025 - 14:00
    end: new Date(2025, 9, 24, 15, 0),
  },
  {
    title: "Class Council Meeting",
    allDay: false,
    start: new Date(2025, 9, 25, 16, 0), // Oct 25, 2025 - 16:00
    end: new Date(2025, 9, 25, 17, 0),
  },
  {
    title: "English Debate Practice",
    allDay: false,
    start: new Date(2025, 9, 28, 10, 0), // Oct 28, 2025 - 10:00
    end: new Date(2025, 9, 28, 11, 0),
  },
  {
    title: "Midterm Exam - Physics",
    allDay: false,
    start: new Date(2025, 9, 30, 9, 0), // Oct 30, 2025 - 09:00
    end: new Date(2025, 9, 30, 10, 0),
  },
  {
    title: "Sports Day",
    allDay: true,
    start: new Date(2025, 9, 31), // Oct 31, 2025
    end: new Date(2025, 9, 31),
  },
  {
    title: "Parent Meeting",
    allDay: false,
    start: new Date(2025, 10, 2, 14, 0), // Nov 2, 2025 - 14:00
    end: new Date(2025, 10, 2, 15, 30),
  },
  {
    title: "Group Project Presentation",
    allDay: false,
    start: new Date(2025, 10, 3, 9, 0), // Nov 3, 2025 - 09:00
    end: new Date(2025, 10, 3, 10, 30),
  },
  {
    title: "Final Exam - Chemistry",
    allDay: false,
    start: new Date(2025, 10, 5, 8, 30), // Nov 5, 2025 - 08:30
    end: new Date(2025, 10, 5, 10, 0),
  },
];

// Set up Sales Dashboard data
//**** Last week financial data
export const lastWeekFinancialData = [
  {
    title: "Total revenue",
    amount: 2600000,
    duration: "from last week",
    status: "profit",
    percentage: 10,
  },
  {
    title: "Average order revenue",
    amount: 455,
    duration: "from last week",
    status: "profit",
    percentage: 10,
  },
  {
    title: "Product sold",
    amount: 5888,
    duration: "from last week",
    status: "profit",
    percentage: 10,
  },
  {
    title: "Pageviews",
    amount: 823067,
    duration: "from last week",
    status: "profit",
    percentage: 10,
  },
];
//**** Last week financial comparation
export const lastWeekFinancialComparation = [
  {
    name: "E-Commerce Sales",
    currentAmount: 28500,
    pastAmount: 19432,
    percentage: 46.6,
    status: "profit",
    chartData: [
      { name: "Mon", current: 4200, past: 2900 },
      { name: "Tue", current: 3800, past: 2800 },
      { name: "Wed", current: 3600, past: 2600 },
      { name: "Thu", current: 4600, past: 3200 },
      { name: "Fri", current: 5800, past: 3400 },
      { name: "Sat", current: 4200, past: 2100 },
      { name: "Sun", current: 3300, past: 2232 },
    ],
  },
  {
    name: "In-Store Retail",
    currentAmount: 14200,
    pastAmount: 18950,
    percentage: -25.1,
    status: "loss",
    chartData: [
      { name: "Mon", current: 1800, past: 2600 },
      { name: "Tue", current: 1700, past: 2550 },
      { name: "Wed", current: 1600, past: 2450 },
      { name: "Thu", current: 2000, past: 2900 },
      { name: "Fri", current: 2500, past: 3350 },
      { name: "Sat", current: 2200, past: 3100 },
      { name: "Sun", current: 2400, past: 2000 },
    ],
  },
  {
    name: "Digital Subscriptions",
    currentAmount: 18800,
    pastAmount: 14200,
    percentage: 32.4,
    status: "profit",
    chartData: [
      { name: "Mon", current: 2600, past: 2000 },
      { name: "Tue", current: 2700, past: 1980 },
      { name: "Wed", current: 2750, past: 1950 },
      { name: "Thu", current: 2800, past: 2050 },
      { name: "Fri", current: 2850, past: 2100 },
      { name: "Sat", current: 2700, past: 2080 },
      { name: "Sun", current: 2400, past: 2040 },
    ],
  },
  {
    name: "Enterprise Contracts",
    currentAmount: 25800,
    pastAmount: 29800,
    percentage: -13.4,
    status: "loss",
    chartData: [
      { name: "Mon", current: 3500, past: 4600 },
      { name: "Tue", current: 3200, past: 4100 },
      { name: "Wed", current: 3000, past: 3800 },
      { name: "Thu", current: 3800, past: 4400 },
      { name: "Fri", current: 4200, past: 4700 },
      { name: "Sat", current: 3600, past: 3900 },
      { name: "Sun", current: 2000, past: 3500 },
    ],
  },
];

//**** Sales table data structure
export type saleRow = {
  NameUser: string;
  UserAvatar: string;
  Company: string;
  Phone: string;
  JoiningData: string;
  Projects: number;
  Status: "Active" | "Pending" | "Inactive" | "Failed";
};

export const salesDataRow: saleRow[] = [
  {
    NameUser: "Zachary Gomez",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg",
    Company: "IBM",
    Phone: "+1 454 544 85 58",
    JoiningData: "8 March 2025",
    Projects: 21,
    Status: "Pending",
  },
  {
    NameUser: "Emily Tran",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Emma_Watson_2013.jpg",
    Company: "Google",
    Phone: "+84 965 225 899",
    JoiningData: "12 July 2025",
    Projects: 34,
    Status: "Active",
  },
  {
    NameUser: "Michael Chen",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/Michael_Chen_portrait.jpg",
    Company: "Tencent",
    Phone: "+86 137 9954 2211",
    JoiningData: "3 May 2024",
    Projects: 10,
    Status: "Inactive",
  },
  {
    NameUser: "Hana Suzuki",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Haru_Nemuri_at_Japan_Nite_2019_%28cropped%29.jpg",
    Company: "Sony",
    Phone: "+81 70 3321 9988",
    JoiningData: "14 September 2023",
    Projects: 42,
    Status: "Active",
  },
  {
    NameUser: "Kim Minho",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Minho_at_a_fansigning_event_in_2021.jpg",
    Company: "Samsung",
    Phone: "+82 10 4423 1212",
    JoiningData: "22 January 2025",
    Projects: 17,
    Status: "Pending",
  },
  {
    NameUser: "Anna Schmidt",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Anna_Schmidt_portrait.jpg",
    Company: "Siemens",
    Phone: "+49 162 889 5521",
    JoiningData: "5 June 2024",
    Projects: 26,
    Status: "Active",
  },
  {
    NameUser: "Nguyen Van Nam",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/8/85/Nguyen_Van_Nam_portrait.jpg",
    Company: "VNG Corp",
    Phone: "+84 912 123 456",
    JoiningData: "18 February 2025",
    Projects: 9,
    Status: "Inactive",
  },
  {
    NameUser: "John Carter",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/John_Carter_portrait.jpg",
    Company: "Amazon",
    Phone: "+1 202 555 0148",
    JoiningData: "9 November 2024",
    Projects: 31,
    Status: "Active",
  },
  {
    NameUser: "Li Wei",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/a/a3/Li_Wei_portrait.jpg",
    Company: "Alibaba",
    Phone: "+86 189 5544 6622",
    JoiningData: "1 August 2025",
    Projects: 12,
    Status: "Failed",
  },
  {
    NameUser: "Yuna Park",
    UserAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Yuna_Park_portrait.jpg",
    Company: "Hyundai",
    Phone: "+82 10 7777 9999",
    JoiningData: "15 December 2024",
    Projects: 24,
    Status: "Pending",
  },
];

// Set up Customer table data
//**** Declare the tableRowDataType
export type tableRowDataType = {
  info: string;
  gmail: string;
  customerID: string;
  majority: string;
  company: string;
  phone: string;
  address: string;
  actions: string;
};
//**** sample dataset
export const tableRows: tableRowDataType[] = [
  {
    info: "Nguyen Van An",
    gmail: "an.nguyen@gmail.com",
    customerID: "CUST001",
    majority: "Retail",
    company: "AnMart",
    phone: "+84 912 345 678",
    address: "12 Nguyen Trai, District 5, HCMC",
    actions: "View | Edit | Delete",
  },
  {
    info: "Tran Thanh Thao",
    gmail: "thao.tran@viettrade.vn",
    customerID: "CUST002",
    majority: "Wholesale",
    company: "VietTrade Co., Ltd",
    phone: "+84 911 234 567",
    address: "45 Hai Ba Trung, District 1, HCMC",
    actions: "Verify | Delete",
  },
  {
    info: "Le Minh",
    gmail: "minh.le@technova.vn",
    customerID: "CUST003",
    majority: "Corporate",
    company: "TechNova Solutions",
    phone: "+84 905 678 910",
    address: "22 Pham Van Dong, Thu Duc City",
    actions: "View | Edit",
  },
  {
    info: "Pham Hoa",
    gmail: "hoa.pham@smarthome.vn",
    customerID: "CUST004",
    majority: "Retail",
    company: "SmartHome Depot",
    phone: "+84 937 123 456",
    address: "90 Le Loi, District 3, HCMC",
    actions: "View | Delete",
  },
  {
    info: "Nguyen Quan",
    gmail: "quang.nguyen@megabuild.vn",
    customerID: "CUST005",
    majority: "Enterprise",
    company: "MegaBuild Construction",
    phone: "+84 902 555 111",
    address: "8 Nguyen Hue, District 1, HCMC",
    actions: "View | Edit | Promote",
  },
  {
    info: "Tran Lan",
    gmail: "lan.tran@ecostyle.vn",
    customerID: "CUST006",
    majority: "Retail",
    company: "EcoStyle Fashion",
    phone: "+84 916 777 222",
    address: "34 Tran Hung Dao, District 1, HCMC",
    actions: "View | Reactivate | Delete",
  },
  {
    info: "Huy Do",
    gmail: "huy.do@greentech.vn",
    customerID: "CUST007",
    majority: "Corporate",
    company: "GreenTech Energy",
    phone: "+84 938 111 444",
    address: "128 Vo Van Tan, District 3, HCMC",
    actions: "View | Edit",
  },
  {
    info: "Linh Pham",
    gmail: "linh.pham@quickbuy.vn",
    customerID: "CUST008",
    majority: "Retail",
    company: "QuickBuy Express",
    phone: "+84 909 888 777",
    address: "56 Cach Mang Thang 8, District 10, HCMC",
    actions: "View | Resolve | Delete",
  },
  {
    info: "Thanh Nguyen",
    gmail: "thanh.nguyen@lotusfood.vn",
    customerID: "CUST009",
    majority: "Wholesale",
    company: "Lotus Food Imports",
    phone: "+84 919 222 333",
    address: "77 Nguyen Thi Minh Khai, District 3, HCMC",
    actions: "View | Edit",
  },
  {
    info: "Duy Tran",
    gmail: "duy.tran@bluesky.vn",
    customerID: "CUST010",
    majority: "Retail",
    company: "BlueSky Electronics",
    phone: "+84 903 444 999",
    address: "21 Ly Thuong Kiet, District 10, HCMC",
    actions: "View | Reward | Delete",
  },
];

//---------------------------------------------------- API RESPONSE COMMONE TYPE ----------------------------------------------------
export interface ApiResponseError {
  code: number;
  message: string;
}
export interface ApiResponse {
  code: number;
  message: string;
  data?: any;
  error?: ApiResponseError | ApiResponseError[];
}
export interface ApiResponsePagination {
  hasPre: boolean;
  hasNext: boolean;
  pageNumber: number;
  totalPages: number;
}
