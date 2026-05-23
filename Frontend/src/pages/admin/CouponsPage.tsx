import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";
import api from "../../services/api";

export const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/coupons?search=${search}`);
      setCoupons(res.data.data.coupons);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await api.delete(`/coupons/${id}`);
        fetchCoupons();
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete coupon");
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.patch(`/coupons/${id}/toggle-status`);
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to toggle status");
    }
  };

  if (loading && coupons.length === 0) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Coupons Management</h1>
        <Link 
          to="/admin/coupons/create" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <FiPlus /> Create Coupon
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium">
            <FiFilter /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="p-4">Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon: any) => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{coupon.code}</div>
                    <div className="text-xs text-gray-500">{coupon.name}</div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{coupon.discountType}</td>
                  <td className="p-4 font-medium text-gray-900">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleStatus(coupon.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        coupon.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                        coupon.status === 'EXPIRED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {coupon.status}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link to={`/admin/coupons/${coupon.id}`} className="text-indigo-600 hover:text-indigo-900">
                        <FiEdit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
