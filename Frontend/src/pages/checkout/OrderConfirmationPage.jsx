import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCheckout, reset } from "../../store/slices/checkoutSlice";
import { fetchOrder } from "../../services/checkoutService";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiMapPin, FiDownload, FiShoppingBag, FiList } from "react-icons/fi";
import { motion } from "framer-motion";
import { generateInvoicePDF } from "../../utils/generateInvoicePDF";
export default function OrderConfirmationPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { confirmedOrder, orderId } = useSelector(selectCheckout);
    useEffect(() => {
        if (!confirmedOrder && orderId) {
            fetchOrder(orderId)
                .then((res) => {
                dispatch({ type: "checkout/setConfirmedOrder", payload: res.data || res });
            })
                .catch(() => toast.error("Failed to load order details"));
        }
    }, [orderId, confirmedOrder, dispatch]);
    if (!orderId) {
        return (<div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <FiPackage size={56} className="mx-auto text-gray-300 mb-4"/>
        <p className="text-xl text-gray-500 font-medium">No order information available.</p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
          Continue Shopping
        </Link>
      </div>);
    }
    const order = confirmedOrder?.data || confirmedOrder;
    const handleDownloadInvoice = () => {
        if (!order) {
            toast.error("Order data not loaded yet");
            return;
        }
        generateInvoicePDF(order);
    };
    const handleViewOrders = () => {
        dispatch(reset());
        navigate("/profile?tab=orders", { state: { tab: "orders" } });
    };
    return (<div className="max-w-2xl mx-auto px-4 py-14">
      {/* Success Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-100">
          <FiCheckCircle size={40} className="text-green-500"/>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500">Thank you for your purchase. Your order is being processed.</p>
      </motion.div>

      {/* Order Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {/* Order Meta */}
        <div className="bg-gray-50 px-8 py-5 grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order ID</p>
            <p className="font-bold text-gray-900 text-sm">#{order?.id?.slice(0, 8) ?? orderId?.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Payment</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${(order?.paymentStatus === "PAID" || order?.status === "SUCCESS")
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"}`}>
              {order?.paymentStatus || order?.status || "—"}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
            <p className="font-bold text-indigo-600">₹{order?.totalAmount?.toFixed(2) ?? "—"}</p>
          </div>
        </div>

        {/* Shipping Address */}
        {order?.address && (<div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="text-indigo-500" size={16}/>
              <h3 className="font-bold text-gray-900">Shipping To</h3>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800">{order.address.fullName}</p>
              <p>{order.address.addressLine1}{order.address.addressLine2 && `, ${order.address.addressLine2}`}</p>
              <p>{order.address.city}, {order.address.state} — {order.address.postalCode}</p>
              {order.address.country && <p>{order.address.country}</p>}
            </div>
          </div>)}

        {/* Items */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 mb-4">
            <FiPackage className="text-indigo-500" size={16}/>
            <h3 className="font-bold text-gray-900">Items</h3>
          </div>
          {order?.items?.length > 0 ? (<ul className="divide-y divide-gray-100">
              {order.items.map((item) => (<li key={item.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {item.product?.images?.[0] && (<img src={item.product.images[0]} alt={item.product?.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100"/>)}
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{item.product?.name ?? "Product"}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                </li>))}
            </ul>) : (<p className="text-sm text-gray-400 italic">No item details available.</p>)}

          {/* Order Total */}
          <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">Shipping</span>
            <span className="font-bold text-sm text-gray-900">
              {order?.shippingAmount === 0 ? "Free" : `₹${order?.shippingAmount?.toFixed(2) ?? "0.00"}`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3">
        <button onClick={handleViewOrders} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm shadow-indigo-200">
          <FiList size={16}/>
          View Order History
        </button>
        <button onClick={handleDownloadInvoice} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition">
          <FiDownload size={16}/>
          Download Invoice
        </button>
        <Link to="/" className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition">
          <FiShoppingBag size={16}/>
          Continue Shopping
        </Link>
      </motion.div>
    </div>);
}
