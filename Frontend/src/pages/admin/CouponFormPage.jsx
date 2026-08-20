import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import api from "../../services/api";
import toast from "react-hot-toast";
const parseNumberOrNull = (val) => {
    if (val === "" || val === null || val === undefined || Number.isNaN(Number(val))) {
        return null;
    }
    return Number(val);
};
const baseSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
    description: z.string().optional().nullable(),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.preprocess((v) => (v === "" || v === null || Number.isNaN(Number(v)) ? undefined : Number(v)), z.number({ message: "Discount value is required" }).min(0.01, "Value must be greater than 0")),
    minOrderAmount: z.preprocess(parseNumberOrNull, z.number().nullable().optional()),
    maxDiscountAmount: z.preprocess(parseNumberOrNull, z.number().nullable().optional()),
    usageLimit: z.preprocess(parseNumberOrNull, z.number().nullable().optional()),
    perUserLimit: z.preprocess(parseNumberOrNull, z.number().nullable().optional()),
    validFrom: z.string().min(1, "Valid from date is required"),
    expiryDate: z.string().min(1, "Expiry date is required"),
    newCustomersOnly: z.boolean().default(false),
    freeShipping: z.boolean().default(false),
    status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]).default("ACTIVE"),
});
const schema = baseSchema
    .refine(data => {
    if (!data.validFrom || !data.expiryDate)
        return true;
    return new Date(data.expiryDate) > new Date(data.validFrom);
}, {
    message: "Expiry date must be after valid from date",
    path: ["expiryDate"]
})
    .refine(data => {
    if (data.discountType === "PERCENTAGE" && Number(data.discountValue) > 100)
        return false;
    return true;
}, {
    message: "Percentage cannot exceed 100",
    path: ["discountValue"]
});
export const CouponFormPage = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const defaultValidFrom = new Date().toISOString().slice(0, 16);
    const defaultExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            code: "",
            discountType: "PERCENTAGE",
            discountValue: 10,
            status: "ACTIVE",
            newCustomersOnly: false,
            freeShipping: false,
            validFrom: defaultValidFrom,
            expiryDate: defaultExpiryDate,
        }
    });
    const discountType = watch("discountType");
    useEffect(() => {
        if (isEditMode) {
            const fetchCoupon = async () => {
                try {
                    const res = await api.get(`/coupons/${id}`);
                    const data = res.data?.data || res.data;
                    if (data.validFrom)
                        data.validFrom = new Date(data.validFrom).toISOString().slice(0, 16);
                    if (data.expiryDate)
                        data.expiryDate = new Date(data.expiryDate).toISOString().slice(0, 16);
                    reset(data);
                }
                catch (err) {
                    toast.error(err.response?.data?.message || "Failed to fetch coupon details");
                    navigate("/admin/coupons");
                }
                finally {
                    setLoading(false);
                }
            };
            fetchCoupon();
        }
    }, [id, isEditMode, reset, navigate]);
    const onSubmit = async (data) => {
        try {
            setSaving(true);
            const payload = {
                name: data.name.trim(),
                code: data.code.trim().toUpperCase(),
                description: data.description?.trim() || null,
                discountType: data.discountType,
                discountValue: Number(data.discountValue),
                minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : null,
                maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null,
                usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
                perUserLimit: data.perUserLimit ? Number(data.perUserLimit) : null,
                validFrom: new Date(data.validFrom).toISOString(),
                expiryDate: new Date(data.expiryDate).toISOString(),
                newCustomersOnly: Boolean(data.newCustomersOnly),
                freeShipping: Boolean(data.freeShipping),
                status: data.status || "ACTIVE",
            };
            if (isEditMode) {
                await api.put(`/coupons/${id}`, payload);
                toast.success("Coupon updated successfully");
            }
            else {
                await api.post(`/coupons`, payload);
                toast.success("Coupon created successfully");
            }
            navigate("/admin/coupons");
        }
        catch (err) {
            toast.error(err.response?.data?.message || err.message || "Failed to save coupon");
        }
        finally {
            setSaving(false);
        }
    };
    const onInvalid = (errors) => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            const firstErr = errors[errorKeys[0]];
            toast.error(firstErr?.message || "Please fix validation errors before saving.");
        }
    };
    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 8; i++)
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        setValue("code", code, { shouldValidate: true });
    };
    if (loading)
        return <div className="p-8 text-center text-slate-500 font-medium">Loading coupon details...</div>;
    return (<div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/coupons" className="text-gray-500 hover:text-indigo-600 transition cursor-pointer">
          <FiArrowLeft size={24}/>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Coupon" : "Create New Coupon"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Name *</label>
              <input {...register("name")} className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. Summer Sale 2026"/>
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
              <div className="flex gap-2">
                <input {...register("code")} className={`flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none uppercase ${errors.code ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. SUMMER50"/>
                <button type="button" onClick={generateCode} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 text-sm font-medium transition cursor-pointer">Generate</button>
              </div>
              {errors.code && <p className="text-red-500 text-xs mt-1 font-medium">{errors.code.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea {...register("description")} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Brief description of the coupon..."/>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Discount Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
              <select {...register("discountType")} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white cursor-pointer">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
              <input type="number" step="0.01" {...register("discountValue")} className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${errors.discountValue ? 'border-red-500' : 'border-gray-200'}`} placeholder="e.g. 10"/>
              {errors.discountValue && <p className="text-red-500 text-xs mt-1 font-medium">{errors.discountValue.message}</p>}
            </div>

            {discountType === 'PERCENTAGE' && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Discount Amount (₹)</label>
                <input type="number" {...register("maxDiscountAmount")} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Optional"/>
              </div>)}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount (₹)</label>
              <input type="number" {...register("minOrderAmount")} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Optional"/>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Limits & Validity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit (Total uses)</label>
              <input type="number" {...register("usageLimit")} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Unlimited"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Per User Limit</label>
              <input type="number" {...register("perUserLimit")} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Unlimited"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid From *</label>
              <input type="datetime-local" {...register("validFrom")} className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${errors.validFrom ? 'border-red-500' : 'border-gray-200'}`}/>
              {errors.validFrom && <p className="text-red-500 text-xs mt-1 font-medium">{errors.validFrom.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
              <input type="datetime-local" {...register("expiryDate")} className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none ${errors.expiryDate ? 'border-red-500' : 'border-gray-200'}`}/>
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1 font-medium">{errors.expiryDate.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Conditions</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register("newCustomersOnly")} className="w-5 h-5 text-indigo-600 rounded cursor-pointer"/>
              <span className="text-gray-700 font-medium">New Customers Only</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register("freeShipping")} className="w-5 h-5 text-indigo-600 rounded cursor-pointer"/>
              <span className="text-gray-700 font-medium">Includes Free Shipping</span>
            </label>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select {...register("status")} className="w-full md:w-1/2 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white cursor-pointer">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link to="/admin/coupons" className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition cursor-pointer">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm">
            <FiSave /> {saving ? "Saving..." : "Save Coupon"}
          </button>
        </div>
      </form>
    </div>);
};
