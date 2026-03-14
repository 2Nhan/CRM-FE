"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartDataPoint {
  name: string;
  current: number;
  past: number;
}

interface StatCardProps {
  name: string;
  currentAmount: number;
  pastAmount: number;
  percentage: number;
  status: "profit" | "loss" | "neutral";
  chartData: ChartDataPoint[];
  icon?: React.ReactNode;
  colorScheme?: {
    primary: string;
    secondary: string;
    gradient: string;
  };
}

const StatCard = ({
  name,
  currentAmount,
  pastAmount,
  percentage,
  status,
  chartData,
  icon,
  colorScheme = {
    primary: "#1e88e5",
    secondary: "#64b5f6",
    gradient: "from-blue-500 to-blue-600"
  }
}: StatCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toFixed(0);
  };

  const formatTooltipValue = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorScheme.gradient}`}>
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">Current Period</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
          status === "profit" 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {status === "profit" ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">{percentage.toFixed(2)}%</span>
        </div>
      </div>

      {/* Amount Display */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-3xl font-bold text-gray-900">
            {formatNumber(currentAmount)}
          </h2>
          <span className="text-sm text-gray-500">
            vs {formatNumber(pastAmount)}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              tickFormatter={formatNumber}
            />
            <Tooltip 
              formatter={(value: number) => formatTooltipValue(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="current" 
              stroke={colorScheme.primary}
              strokeWidth={3}
              dot={{ fill: colorScheme.primary, r: 4 }}
              activeDot={{ r: 6 }}
              name="Current"
            />
            <Line 
              type="monotone" 
              dataKey="past" 
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#94a3b8', r: 3 }}
              name="Past"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default StatCard;