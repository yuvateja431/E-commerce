import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../services/api";
import {
  FiCheckCircle,
  FiCreditCard,
  FiTruck,
  FiMapPin,
  FiLock,
  FiArrowRight,
  FiShoppingBag,
  FiTag,
  FiShield,
  FiRotateCcw,
  FiCheck,
  FiHome,
  FiBriefcase,
  FiAlertCircle,
} from "react-icons/fi";
import type { RootState } from "../../store";
import { clearCart } from "../../store/cartSlice";
import { selectLocation } from "../../store/slices/locationSlice";
import { LocationModal } from "../../components/LocationModal";
import { deduplicateAddresses } from "../../utils/addressUtils";
import toast from "react-hot-toast";
import OrderConfirmationPage from "../checkout/OrderConfirmationPage";

/* ── Custom Vector Logos & Icons matching Image 1 ── */
const UpiLogo = ({ className = "h-5" }: { className?: string }) => (
  <div className={`flex items-center gap-0.5 font-black text-slate-800 tracking-tighter italic text-base ${className}`}>
    <span className="font-extrabold font-sans">UPI</span>
    <div className="flex items-center ml-0.5">
      <span className="text-emerald-500 text-xs font-black">▲</span>
      <span className="text-orange-500 text-xs font-black -ml-1">▶</span>
    </div>
  </div>
);

const MastercardLogo = () => (
  <div className="flex items-center justify-center">
    <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] -ml-1.5 opacity-90" />
  </div>
);

const BanknoteIcon = ({ className = "w-7 h-7 text-emerald-500" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path strokeLinecap="round" d="M6 12h.01M18 12h.01" />
  </svg>
);

const CardOutlineIcon = ({ className = "w-7 h-7 text-indigo-600" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="6" y1="15" x2="10" y2="15" />
  </svg>
);

const checkoutSchema = z.object({
  street: z.string().min(1, "Street address is required"),
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
  
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const deliveryLocation = useSelector(selectLocation);
  const { user } = useSelector((state: RootState) => state.auth);
  const { cart } = useSelector((state: RootState) => state.cart || { cart: { items: [] } });
  const { instantOrder } = useSelector((state: RootState) => state.checkout || { instantOrder: null });
  const [instantProduct, setInstantProduct] = useState<any>(null);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load saved user addresses if logged in
  useEffect(() => {
    if (user) {
      api
        .get("/addresses/addresses")
        .then((res) => {
          const raw = res.data?.data || [];
          setSavedAddresses(deduplicateAddresses(raw));
        })
        .catch(() => setSavedAddresses([]));
    }
  }, [user]);

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

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      paymentMethod: "CARD"
    }
  });

  // Sync Shipping Address automatically from saved address or delivery location
  useEffect(() => {
    if (selectedAddressId && savedAddresses.length > 0) {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        setValue("street", addr.addressLine1 || "");
        setValue("city", addr.city || "");
        setValue("state", addr.state || "");
        setValue("zipCode", addr.postalCode || "");
        setValue("country", addr.country || "India");
        return;
      }
    }

    if (savedAddresses.length > 0) {
      const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddr.id);
      setValue("street", defaultAddr.addressLine1 || "");
      setValue("city", defaultAddr.city || "");
      setValue("state", defaultAddr.state || "");
      setValue("zipCode", defaultAddr.postalCode || "");
      setValue("country", defaultAddr.country || "India");
    } else if (deliveryLocation && (deliveryLocation.city || deliveryLocation.pincode)) {
      setValue("street", deliveryLocation.addressLine || "");
      setValue("city", deliveryLocation.city || "");
      setValue("state", deliveryLocation.stateName || "");
      setValue("zipCode", deliveryLocation.pincode || "");
      setValue("country", "India");
    }
  }, [deliveryLocation, savedAddresses, selectedAddressId, setValue]);

  const selectedPayment = watch("paymentMethod");

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
  const total = Math.max(0, subtotal + shipping - discountAmount);

  if (instantOrder && !instantProduct && fetchingProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <p className="text-xl font-semibold text-gray-500 font-sans">Loading product details for checkout...</p>
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
      
      if (res.data?.data?.id) {
        dispatch({ type: "checkout/setOrderId", payload: res.data.data.id });
      }
      
      toast.success("Order placed successfully!");
      setStep(3);
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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Section (7-8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Shipping Address Card */}
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between gap-3 mb-7">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FiMapPin size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Shipping Address</h2>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">Enter or select the address for order delivery</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  >
                    <FiMapPin size={14} /> Update Location
                  </button>
                </div>

                {/* Auto-applied Delivery Address Notification */}
                {(watch("city") || deliveryLocation?.city) ? (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FiCheck size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-950">
                          Automatically taking delivery address for Shipping Address
                        </p>
                        <p className="text-xs font-semibold text-emerald-700">
                          {watch("city") ? `${watch("street") ? watch("street") + ", " : ""}${watch("city")}, ${watch("state")} - ${watch("zipCode")}` : `${deliveryLocation.city} ${deliveryLocation.pincode}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <FiAlertCircle size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-900">
                        No delivery address pre-selected
                      </p>
                      <p className="text-xs font-medium text-amber-700">
                        Please enter your shipping address details below to proceed.
                      </p>
                    </div>
                  </div>
                )}

                {/* Saved User Addresses Selection */}
                {savedAddresses.length > 0 && (
                  <div className="mb-6 space-y-2.5">
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Select from Saved Addresses
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              setValue("street", addr.addressLine1 || "");
                              setValue("city", addr.city || "");
                              setValue("state", addr.state || "");
                              setValue("zipCode", addr.postalCode || "");
                              setValue("country", addr.country || "India");
                            }}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-50/60 shadow-sm ring-1 ring-indigo-600/20"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 mt-0.5">
                                {addr.addressType === "HOME" ? <FiHome size={14} /> : <FiBriefcase size={14} />}
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-900">{addr.name || user?.firstName}</p>
                                <p className="text-[11px] text-slate-600 line-clamp-1">{addr.addressLine1}</p>
                                <p className="text-[11px] font-bold text-slate-800">{addr.city}, {addr.postalCode}</p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                <FiCheck size={12} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Street Address</label>
                    <div className="relative">
                      <input
                        {...register("street")}
                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition text-sm font-semibold text-slate-800 placeholder-slate-400"
                        placeholder="House / Flat No., Street, Area"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none">
                        <FiMapPin size={18} />
                      </div>
                    </div>
                    {errors.street && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.street.message}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">City</label>
                    <input
                      {...register("city")}
                      className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition text-sm font-semibold text-slate-800 placeholder-slate-400"
                      placeholder="City e.g. Hyderabad"
                    />
                    {errors.city && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.city.message}</p>}
                  </div>

                  {/* State / Province */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">State / Province</label>
                    <input
                      {...register("state")}
                      className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition text-sm font-semibold text-slate-800 placeholder-slate-400"
                      placeholder="State e.g. Telangana"
                    />
                    {errors.state && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.state.message}</p>}
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Zip Code / Pincode</label>
                    <input
                      {...register("zipCode")}
                      className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition text-sm font-semibold text-slate-800 placeholder-slate-400"
                      placeholder="500034"
                    />
                    {errors.zipCode && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.zipCode.message}</p>}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Country</label>
                    <input
                      {...register("country")}
                      className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition text-sm font-semibold text-slate-800 placeholder-slate-400"
                      placeholder="India"
                    />
                    {errors.country && <p className="text-rose-500 text-xs font-bold mt-1.5">{errors.country.message}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3.5 mb-7">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <CardOutlineIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Payment Method</h2>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">Choose your preferred payment option</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Option 1: CARD */}
                  <label
                    className={`relative flex flex-col justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 min-h-[115px] ${
                      selectedPayment === "CARD"
                        ? "border-indigo-600 bg-white shadow-md ring-1 ring-indigo-600/20"
                        : "border-slate-200/80 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="CARD"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <CardOutlineIcon className="w-8 h-8 text-indigo-600" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                        selectedPayment === "CARD" ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                      }`}>
                        {selectedPayment === "CARD" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-extrabold text-slate-900 text-sm">Card</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">Credit / Debit Card</p>
                    </div>
                  </label>

                  {/* Option 2: UPI */}
                  <label
                    className={`relative flex flex-col justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 min-h-[115px] ${
                      selectedPayment === "UPI"
                        ? "border-indigo-600 bg-white shadow-md ring-1 ring-indigo-600/20"
                        : "border-slate-200/80 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="UPI"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <UpiLogo className="h-6" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                        selectedPayment === "UPI" ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                      }`}>
                        {selectedPayment === "UPI" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-extrabold text-slate-900 text-sm">UPI</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">Digital Payment</p>
                    </div>
                  </label>

                  {/* Option 3: COD */}
                  <label
                    className={`relative flex flex-col justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 min-h-[115px] ${
                      selectedPayment === "COD"
                        ? "border-indigo-600 bg-white shadow-md ring-1 ring-indigo-600/20"
                        : "border-slate-200/80 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="COD"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <BanknoteIcon className="w-8 h-8 text-emerald-500" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                        selectedPayment === "COD" ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                      }`}>
                        {selectedPayment === "COD" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-extrabold text-slate-900 text-sm">COD</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">Pay at door</p>
                    </div>
                  </label>

                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white py-4.5 px-6 rounded-2xl font-black text-base transition duration-200 shadow-lg shadow-indigo-200 flex items-center justify-between disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <FiLock size={18} />
                </div>
                <span>{loading ? "Processing Purchase..." : `Complete Purchase • ₹${total.toFixed(2)}`}</span>
                <FiArrowRight size={20} />
              </button>

            </form>
          </div>

          {/* Right Sidebar: Your Order (4-5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FiShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Order</h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">Review your items and total</p>
                </div>
              </div>

              {/* Item List */}
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {items.map((item: any) => {
                  const itemPrice = item.variantId && item.product.variants
                    ? (item.product.discountPrice || item.product.price) + (item.product.variants.find((v: any) => v.id === item.variantId)?.additionalPrice || 0)
                    : (item.product.discountPrice || item.product.price);
                  return (
                    <div key={item.id} className="flex items-center gap-3.5 p-2 rounded-2xl border border-slate-100 hover:border-indigo-100 transition">
                      <img
                        src={item.product.images?.[0] || "https://placehold.co/100x100"}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-2xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <p className="font-extrabold text-slate-900 text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-black text-sm text-slate-900 shrink-0">₹{(itemPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-slate-500">
                  <span>Shipping</span>
                  <span className="font-extrabold text-emerald-600">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>

                {/* Discount Code Input Box */}
                <div className="pt-3">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="DISCOUNT CODE"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 outline-none text-xs font-bold tracking-wider uppercase"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCode}
                        className="px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs disabled:opacity-50"
                      >
                        {validatingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <div>
                        <span className="font-black text-emerald-800 text-xs uppercase tracking-wider">{appliedCoupon.code}</span>
                        <p className="text-[11px] font-semibold text-emerald-600">Coupon applied</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs font-extrabold text-rose-500 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between font-medium text-emerald-600 text-sm">
                    <span>Discount</span>
                    <span className="font-extrabold">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total Banner Box */}
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100/80 flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-base">Total</span>
                <span className="font-black text-[#4F46E5] text-2xl">₹{total.toFixed(2)}</span>
              </div>

              {/* Trust Badges Widget */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <FiShield size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Secure Checkout</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Your payment information is safe with us</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                    <FiRotateCcw size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Easy Returns</h4>
                    <p className="text-[11px] text-slate-400 font-medium">7-day return policy on all orders</p>
                  </div>
                </div>
              </div>

              {/* Payment Acceptance Logos Row (VISA, Mastercard, RuPay, UPI, COD matching Image 1) */}
              <div className="flex items-center justify-between gap-1.5 pt-1">
                <span className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-black text-[#1A1F71] tracking-wider shadow-2xs">
                  VISA
                </span>
                <span className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center">
                  <MastercardLogo />
                </span>
                <span className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-black italic text-[#0A2540] tracking-tight shadow-2xs">
                  RuPay<span className="text-emerald-500 font-bold">▶</span>
                </span>
                <span className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center">
                  <UpiLogo className="h-3.5 text-[11px]" />
                </span>
                <span className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-black text-slate-800 tracking-wider shadow-2xs">
                  COD
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── Location Modal for updating delivery address on Checkout Page ── */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};
