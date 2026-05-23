import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FiEye, FiShoppingCart } from "react-icons/fi";

interface Order {
  id: string;
  customer: string;
  total: number; // in INR
  status: string;
  date: string; // ISO string
}

export const RecentTransactions: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders?limit=5"); // Adjust endpoint as needed
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch recent orders", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg p-4">
      <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-100 mb-4">Recent Transactions</h3>
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-2 text-left">Order ID</th>
            <th className="p-2 text-left">Customer</th>
            <th className="p-2 text-right">Total</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-center">View</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-gray-100 dark:border-gray-600">
              <td className="p-2 font-medium text-indigo-600 dark:text-indigo-400">#{o.id}</td>
              <td className="p-2 text-gray-600 dark:text-gray-300">{o.customer}</td>
              <td className="p-2 text-right font-semibold text-gray-800 dark:text-gray-100">
                ₹{o.total.toLocaleString("en-IN")}
              </td>
              <td className="p-2 text-gray-500 dark:text-gray-400">{o.status}</td>
              <td className="p-2 text-gray-500 dark:text-gray-400">
                {new Date(o.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </td>
              <td className="p-2 text-center">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <FiEye size={16} className="text-gray-600 dark:text-gray-300" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
