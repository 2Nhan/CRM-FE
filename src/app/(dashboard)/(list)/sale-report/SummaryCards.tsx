"use client";

import { motion } from "framer-motion";
import { DollarSign, Target, Activity, Users } from "lucide-react";

interface SummaryCardsProps {
  totalRevenue: number;
  totalOrders: number;
  totalTasks: number;
  totalLeads: number;
}

const SummaryCards = ({
  totalRevenue,
  totalOrders,
  totalTasks,
  totalLeads
}: SummaryCardsProps) => {
  const formatCurrency = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: <Target className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600"
    },
    {
      title: "Tasks Completed",
      value: totalTasks.toString(),
      icon: <Activity className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600"
    },
    {
      title: "Lead Conversions",
      value: totalLeads.toString(),
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
              <div className="text-white">{card.icon}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {card.title}
          </h3>
          <p className={`text-2xl font-bold ${card.textColor}`}>
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;