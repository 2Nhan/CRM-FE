"use client";

import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts";
import Image from "next/image";

const data = [
  { name: "Total", count: 100, fill: "#fff" },
  { name: "Boys", count: 55, fill: "#CFCEFF" },
  { name: "Girls", count: 45, fill: "#FAE27C" },
];

const CountChart = () => {
  return (
    <div className="bg-white rounded-2xl w-full h-full p-4 flex flex-col justify-between transition-all duration-300 hover:scale-101 hover:shadow-lg hover:shadow-gray-300/50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Student</h1>
        <Image src="/moredark.png" alt="more-icon" width={20} height={20} className="cursor-pointer"/>
      </div>

      {/* Chart */}
      <div className="w-full h-[75%] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image src="/maleFemale.png" alt="" width={50} height={50} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Bottom Info */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 rounded-full bg-lamaPurple"></div>
          <h1 className="font-semibold">1,234</h1>
          <h2 className="text-xs text-gray-400">Boys (55%)</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 rounded-full bg-lamaYellow"></div>
          <h1 className="font-semibold">1,234</h1>
          <h2 className="text-xs text-gray-400">Girls (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
