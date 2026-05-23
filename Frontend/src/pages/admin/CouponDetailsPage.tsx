import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiClock, FiActivity, FiUsers, FiDollarSign } from "react-icons/fi";
import api from "../../services/api";

export const CouponDetailsPage = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await api.get(`/coupons/${id}`);
        setCoupon(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load coupon details");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupon();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !coupon) return <div className="p-8 text-center text-red-500">{error || "Coupon not found"}</div>;

  const totalDiscountGiven = coupon.orders?.reduce((sum: number, order: any) => {
    // Assuming order logic stored discount amount, if not we can roughly estimate
    // Realistically you should fetch aggregate metrics from backend for accuracy
    return sum + (coupon.discountType === 'FIXED' ? coupon.discountValue : 0);
  }, 0); // Placeholder for actual calculation

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/coupons" className="text-gray-500 hover:text-indigo-600 transition">
            <FiArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{coupon.code}</h1>
            <p className="text-gray-500">{coupon.name}</p>
          </div>
        </div>
        <Link 
          to={`/admin/coupons/${coupon.id}/edit`} 
          className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-100 transition font-medium"
        >
          <FiEdit /> Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FiActivity size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Status</p>
              <p className="text-lg font-bold text-gray-900">{coupon.status}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Uses</p>
              <p className="text-lg font-bold text-gray-900">{coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Discount</p>
              <p className="text-lg font-bold text-gray-900">
                {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
              <FiClock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Expiry</p>
              <p className="text-lg font-bold text-gray-900">{new Date(coupon.expiryDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Usage</h2>
            {coupon.orders?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {coupon.orders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-indigo-600">{order.id.slice(0, 8)}...</td>
                        <td className="p-4 text-gray-900">{order.user.firstName} {order.user.lastName}</td>
                        <td className="p-4 text-gray-900">₹{order.totalAmount}</td>
                        <td className="p-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">This coupon hasn't been used yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Coupon Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Description</p>
                <p className="text-gray-900 mt-1">{coupon.description || 'No description provided.'}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Min Order Amount</p>
                <p className="text-gray-900 mt-1">{coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : 'None'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Max Discount</p>
                <p className="text-gray-900 mt-1">{coupon.maxDiscountAmount ? `₹${coupon.maxDiscountAmount}` : 'None'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Valid From</p>
                <p className="text-gray-900 mt-1">{new Date(coupon.validFrom).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Per User Limit</p>
                <p className="text-gray-900 mt-1">{coupon.perUserLimit || 'Unlimited'}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Conditions</p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${coupon.newCustomersOnly ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className="text-sm text-gray-700">New Customers Only</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${coupon.freeShipping ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className="text-sm text-gray-700">Includes Free Shipping</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
