"use client";

import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", present: 100, absent: 40 },
  { name: "Tue", present: 120, absent: 20 },
  { name: "Wed", present: 110, absent: 50 },
  { name: "Thus", present: 150, absent: 20 },
  { name: "Fri", present: 100, absent: 15 },
];

const AttendanceChart = () => {
  return (
    <div className="bg-white w-full h-full rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-101 hover:shadow-lg hover:shadow-gray-300/50">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} className="cursor-pointer"/>
      </div>

      {/* CHART */}
      <div className="w-full h-[90%] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip contentStyle={{ borderRadius: "10px", border: "#ddd" }} />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }}
            />
            <Bar
              dataKey="present"
              fill="#CFCEFF"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="absent"
              fill="#FAE27C"
              legendType="circle"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
