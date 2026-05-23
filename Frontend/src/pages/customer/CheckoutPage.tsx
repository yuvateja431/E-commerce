import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../services/api";
import { FiCheckCircle, FiCreditCard, FiTruck, FiMapPin } from "react-icons/fi";
import type { RootState } from "../../store";
import { clearCart } from "../../store/cartSlice";
import toast from "react-hot-toast";
import OrderConfirmationPage from "../checkout/OrderConfirmationPage";

const checkoutSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["CARD", "UPI", "COD"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const { cart } = useSelector((state: RootState) => state.cart || { cart: { items: [] } });
  const { instantOrder } = useSelector((state: RootState) => state.checkout || { instantOrder: null });
  const [instantProduct, setInstantProduct] = useState<any>(null);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (instantOrder?.productId) {
      setFetchingProduct(true);
      api.get(`/products/${instantOrder.productId}`)
        .then(res => {
          setInstantProduct(res.data.data);
        })
        .catch(err => {
          console.error("Failed to fetch product for instant checkout:", err);
          toast.error("Failed to load product details");
        })
        .finally(() => {
          setFetchingProduct(false);
        });
    }
  }, [instantOrder]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "CARD" }
  });

  const items = instantOrder && instantProduct ? [
    {
      id: "instant",
      productId: instantOrder.productId,
      variantId: instantOrder.variantId,
      quantity: instantOrder.quantity,
      product: instantProduct
    }
  ] : (cart?.items || []);

  const subtotal = items.reduce((acc: number, item: any) => {
    const itemPrice = item.variantId && item.product.variants
      ? (item.product.discountPrice || item.product.price) + (item.product.variants.find((v: any) => v.id === item.variantId)?.additionalPrice || 0)
      : (item.product.discountPrice || item.product.price);
    return acc + (itemPrice * item.quantity);
  }, 0);

  const shipping: number = 0;
  const total = subtotal + shipping - discountAmount;

  if (instantOrder && !instantProduct && fetchingProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <p className="text-xl font-semibold text-gray-600 font-sans">Loading product details for checkout...</p>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const res = await api.post("/coupons/validate", {
        code: couponCode,
        cartTotal: subtotal
      });
      setAppliedCoupon(res.data.data.coupon);
      setDiscountAmount(res.data.data.discountAmount);
      toast.success("Coupon applied!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    try {
      const payload = {
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        },
        paymentMethod: data.paymentMethod,
        couponId: appliedCoupon ? appliedCoupon.id : undefined,
        instantOrder: instantOrder ? {
          productId: instantOrder.productId,
          variantId: instantOrder.variantId,
          quantity: instantOrder.quantity
        } : undefined
      };

      const res = await api.post("/orders/checkout", payload);
      
      if (!instantOrder) {
        dispatch(clearCart() as any);
      }
      
      // Dispatch the new order ID to the checkout slice so OrderConfirmationPage can fetch and display it
      if (res.data?.data?.id) {
        dispatch({ type: "checkout/setOrderId", payload: res.data.data.id });
      }
      
      toast.success("Order placed successfully!");
      setStep(3); // Show success
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="py-8">
        <OrderConfirmationPage />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Shipping Address */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <FiMapPin size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                  <input
                    {...register("street")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="123 Main St"
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <input
                    {...register("city")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="New York"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State / Province</label>
                  <input
                    {...register("state")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="NY"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code</label>
                  <input
                    {...register("zipCode")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="10001"
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                  <input
                    {...register("country")}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="USA"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <FiCreditCard size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["CARD", "UPI", "COD"].map((method) => (
                  <label
                    key={method}
                    className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition ${watch("paymentMethod") === method ? "border-indigo-600 bg-indigo-50" : "border-gray-100 hover:border-indigo-200"
                      }`}
                  >
                    <input
                      type="radio"
                      value={method}
                      {...register("paymentMethod")}
                      className="absolute opacity-0"
                    />
                    <span className="font-bold text-gray-900">{method}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {method === "CARD" ? "Credit/Debit Card" : method === "UPI" ? "Digital Payment" : "Pay at door"}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : `Complete Purchase • ₹${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary (Sidebar) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Order</h3>
            <div className="space-y-6 max-h-[400px] overflow-y-auto mb-8 pr-2">
              {items.map((item: any) => {
                const itemPrice = item.variantId && item.product.variants
                  ? (item.product.discountPrice || item.product.price) + (item.product.variants.find((v: any) => v.id === item.variantId)?.additionalPrice || 0)
                  : (item.product.discountPrice || item.product.price);
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.product.images?.[0] || "https://placehold.co/100x100"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-bold text-sm text-gray-900 mt-1">₹{(itemPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="font-bold text-gray-900">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
              </div>

              {/* Coupon Section */}
              <div className="pt-4 border-t border-gray-100">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Discount code"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponCode}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition whitespace-nowrap"
                    >
                      {validatingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-700 text-sm uppercase">{appliedCoupon.code}</span>
                      </div>
                      <span className="text-xs text-green-600">Coupon applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-500 font-bold hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Discount</span>
                  <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-indigo-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
