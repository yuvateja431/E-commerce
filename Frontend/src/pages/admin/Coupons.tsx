import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiPlus, FiTrash2, FiTag, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch coupons");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await api.delete(`/coupons/${id}`);
        toast.success("Coupon deleted");
        fetchCoupons();
      } catch (error) {
        toast.error("Failed to delete coupon");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition">
          <FiPlus /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon: any) => (
          <div key={coupon.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                <FiTag size={24} />
              </div>
              <button 
                onClick={() => handleDelete(coupon.id)}
                className="text-gray-400 hover:text-red-500 p-2 transition"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{coupon.code}</h3>
              <p className="text-sm font-bold text-indigo-600">
                {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
              </p>
              {coupon.minOrderValue && (
                <p className="text-xs text-gray-500 mt-1">Min. Order: ${coupon.minOrderValue}</p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-50 pt-4">
              <FiCalendar />
              <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
