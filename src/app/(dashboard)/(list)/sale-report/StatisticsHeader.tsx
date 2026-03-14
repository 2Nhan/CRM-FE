"use client";

import { motion } from "framer-motion";
import { Calendar, Download, RefreshCw } from "lucide-react";

interface StatisticsHeaderProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  onExport?: () => void;
}

const StatisticsHeader = ({
  title = "Sales Statistics Dashboard",
  subtitle = "Monitor your sales performance and key metrics",
  onRefresh,
  onExport
}: StatisticsHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-md p-6 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
          
          {/* {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )} */}
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticsHeader;