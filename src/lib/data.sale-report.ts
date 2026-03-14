//----------------------------------------GET SALE REPOST RESPONSE AND RESQUEST TYPE----------------------------------------//
type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface RevenueChartData {
  name: WeekDay;
  current: number;
  past: number;
}

export interface ApiResponseGetSaleReportType {
  name: string;
  currentAmount: number;
  pastAmount: number;
  percentage: number;
  status: "profit" | "loss" | "neutral";
  chartData: RevenueChartData[];
}

export interface StatsData {
  orderRevenue: ApiResponseGetSaleReportType;
  quotationRevenue: ApiResponseGetSaleReportType;
  tasksCompleted: ApiResponseGetSaleReportType;
  leadConversion: ApiResponseGetSaleReportType;
}
