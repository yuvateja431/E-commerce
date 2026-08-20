import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
// Mock sales data – replace with real API data later
const mockData = [
    { name: "1 May", revenue: 32000 },
    { name: "2 May", revenue: 28000 },
    { name: "3 May", revenue: 35000 },
    { name: "4 May", revenue: 40000 },
    { name: "5 May", revenue: 30000 },
    { name: "6 May", revenue: 45000 },
    { name: "7 May", revenue: 42000 },
];
export const RevenueChart = () => {
    return (<motion.div whileHover={{ scale: 1.02 }} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg p-4">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={mockData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9"/>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: "600" }}/>
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: "600" }}/>
          <Tooltip contentStyle={{
            background: "#FFFFFF",
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            fontSize: "11px",
            fontWeight: "bold",
            color: "#1E293B",
        }} itemStyle={{ color: "#4F46E5" }}/>
          <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" activeDot={{ r: 6, stroke: "#FFFFFF", strokeWidth: 2, fill: "#4F46E5" }}/>
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>);
};
