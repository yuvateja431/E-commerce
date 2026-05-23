import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiAlertTriangle, FiArrowUp, FiArrowDown } from "react-icons/fi";
import toast from "react-hot-toast";

export const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data?.data?.products || []);
    } catch (error) {
      toast.error("Failed to fetch inventory");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id: string, quantity: number) => {
    try {
      await api.patch(`/products/${id}/stock`, { quantity });
      toast.success("Stock updated");
      fetchInventory();
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Current Stock</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Quick Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product: any) => {
            const isLow = product.inventory?.stock <= product.inventory?.lowStockThreshold;
            return (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.images?.[0] || "https://placehold.co/40x40"} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">ID: {product.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-extrabold text-gray-900 text-lg">
                  {product.inventory?.stock}
                </td>
                <td className="px-6 py-4">
                  {isLow ? (
                    <span className="flex items-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded-lg w-fit">
                      <FiAlertTriangle /> LOW STOCK
                    </span>
                  ) : (
                    <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg w-fit">
                      HEALTHY
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleUpdateStock(product.id, 10)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition border border-indigo-100 flex items-center gap-1 text-xs font-bold"
                    >
                      <FiArrowUp /> Restock (+10)
                    </button>
                    <button 
                      onClick={() => handleUpdateStock(product.id, -1)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition border border-gray-100 flex items-center gap-1 text-xs font-bold"
                    >
                      <FiArrowDown /> Correct (-1)
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
