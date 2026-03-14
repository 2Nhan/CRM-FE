"use client";

import StatCard from "./StatCard";
import { 
  ShoppingCart, 
  FileText, 
  CheckCircle, 
  TrendingUp 
} from "lucide-react";

interface StatData {
  name: string;
  currentAmount: number;
  pastAmount: number;
  percentage: number;
  status: "profit" | "loss" | "neutral";
  chartData: Array<{
    name: string;
    current: number;
    past: number;
  }>;
}

interface StatisticsGridProps {
  orderRevenue: StatData;
  quotationRevenue: StatData;
  tasksCompleted: StatData;
  leadConversion: StatData;
}

const StatisticsGrid = ({
  orderRevenue,
  quotationRevenue,
  tasksCompleted,
  leadConversion
}: StatisticsGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StatCard
        {...orderRevenue}
        icon={<ShoppingCart className="w-6 h-6 text-white" />}
        colorScheme={{
          primary: "#1e88e5",
          secondary: "#64b5f6",
          gradient: "from-blue-500 to-blue-600"
        }}
      />
      
      <StatCard
        {...quotationRevenue}
        icon={<FileText className="w-6 h-6 text-white" />}
        colorScheme={{
          primary: "#7c3aed",
          secondary: "#a78bfa",
          gradient: "from-purple-500 to-purple-600"
        }}
      />
      
      <StatCard
        {...tasksCompleted}
        icon={<CheckCircle className="w-6 h-6 text-white" />}
        colorScheme={{
          primary: "#059669",
          secondary: "#34d399",
          gradient: "from-green-500 to-green-600"
        }}
      />
      
      <StatCard
        {...leadConversion}
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        colorScheme={{
          primary: "#dc2626",
          secondary: "#f87171",
          gradient: "from-red-500 to-red-600"
        }}
      />
    </div>
  );
};

export default StatisticsGrid;