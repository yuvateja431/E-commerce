import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;
export const RevenueCard = ({ title, amount, growth, period = '' }) => {
    const isPositive = growth >= 0;
    return (<motion.div whileHover={{ scale: 1.03 }} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-lg p-5 flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}{period && ` (${period})`}
        </h3>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? (<FiArrowUpRight className="inline"/>) : (<FiArrowDownRight className="inline"/>)}
          {Math.abs(growth)}%
        </div>
      </div>
      <p className="mt-2 text-2xl font-black text-gray-900 dark:text-gray-100">
        {formatCurrency(amount)}
      </p>
    </motion.div>);
};
