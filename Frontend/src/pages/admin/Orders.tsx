import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiEye, FiCheck, FiTruck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data?.data?.orders || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order ID</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((order: any) => (
            <tr key={order.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
              <td className="px-6 py-4 text-gray-600 text-sm">{order.user?.firstName} {order.user?.lastName}</td>
              <td className="px-6 py-4 font-bold text-gray-900">${order.totalAmount}</td>
              <td className="px-6 py-4">
                <select 
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className="bg-gray-50 border-none text-xs font-bold py-1 px-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-lg transition">
                  <FiEye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
