"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import StatisticsHeader from "./StatisticsHeader";
import SummaryCards from "./SummaryCards";
import StatisticsGrid from "./StatisticGrid";
import useGetOrderRevenue from "@/fetching/sale-report/getOrderRevenue";
import FetchingLoadingStatus from "@/components/FetchingLoadingStatus";
import useGetQuotationRevenue from "@/fetching/sale-report/getQuotationRevenue";
import useGetTasksCompleted from "@/fetching/sale-report/getTasksCompleted";
import useGetLeadConversion from "@/fetching/sale-report/getLeadConversion";
import { StatsData } from "@/lib/data.sale-report";
import useGetTotalSummary from "@/fetching/sale-report/getTotalSummary";

const SalesStatisticsPage = () => {
  const { loading: getOrderRevenueLoading, getOrderRevenue } = useGetOrderRevenue();
  const { loading: getQuotationRevenueLoading, getQuotationRevenue } = useGetQuotationRevenue();
  const { loading: getTasksCompletedLoading, getTasksCompleted } = useGetTasksCompleted();
  const { loading: getLeadConversionLoading, getLeadConversion } = useGetLeadConversion();
  const { loading: getTotalSummaryLoading, getTotalSummary } = useGetTotalSummary();


  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [summaryStatsData, setSummaryStatsData] = useState<{
    totalRevenue: number;
    totalOrders: number;
    totalTasks: number;
    totalLeads: number;
  } | null>(null);




  const handleRefresh = async () => {
    // TODO: Fetch fresh data from your API
    fetching();
    // Example: const data = await fetchStatistics();
    // setStatsData(data);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting data...");
  };

  const fetching = useCallback(async () => {
    try {
      const [
        orderRevenue,
        quotationRevenue,
        tasksCompleted,
        leadConversion,
        totalSummary
      ] = await Promise.all([
        getOrderRevenue(),
        getQuotationRevenue(),
        getTasksCompleted(),
        getLeadConversion(),
        getTotalSummary()
      ]);

      const stats: StatsData = {
        orderRevenue,
        quotationRevenue,
        tasksCompleted,
        leadConversion,
      };

      setStatsData(stats);

      setSummaryStatsData({
        totalRevenue: totalSummary.totalRevenue || 0,
        totalOrders: totalSummary.totalOrders || 0,
        totalTasks: totalSummary.totalTasks || 0,
        totalLeads: totalSummary.totalLeads || 0,
      });

    } catch (error) {
      console.error("Fetching statistics failed:", error);
    }
  }, []);

  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetching();
  }, [fetching]);


  if (
    getTotalSummaryLoading ||
    getOrderRevenueLoading ||
    getQuotationRevenueLoading ||
    getTasksCompletedLoading ||
    getLeadConversionLoading ||
    !statsData ||
    !summaryStatsData
  ) {
    return <FetchingLoadingStatus loading={true} fullScreen={true} color="#1890ff" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <StatisticsHeader
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        <SummaryCards
          totalRevenue={summaryStatsData.totalRevenue}
          totalOrders={summaryStatsData.totalOrders}
          totalTasks={summaryStatsData.totalTasks}
          totalLeads={summaryStatsData.totalLeads}
        />

        <StatisticsGrid
          orderRevenue={statsData.orderRevenue}
          quotationRevenue={statsData.quotationRevenue}
          tasksCompleted={statsData.tasksCompleted}
          leadConversion={statsData.leadConversion}
        />
      </div>
    </div>
  );
};

export default SalesStatisticsPage;