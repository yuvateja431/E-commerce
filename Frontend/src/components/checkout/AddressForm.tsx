import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(5, "Phone is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  addressType: z.enum(["Home", "Work", "Other"]),
  isDefault: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  initialData?: any;
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
}

export default function AddressForm({ initialData, onCancel, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded w-full max-w-lg shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Address" : "Add New Address"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              {...register("fullName")}
              placeholder="Full Name"
              className="w-full border rounded p-2"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("phone")}
              placeholder="Phone"
              className="w-full border rounded p-2"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <input
              {...register("addressLine1")}
              placeholder="Address Line 1"
              className="w-full border rounded p-2"
            />
            {errors.addressLine1 && (
              <p className="text-red-600 text-sm">{errors.addressLine1.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <input
              {...register("addressLine2")}
              placeholder="Address Line 2 (optional)"
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <input
              {...register("city")}
              placeholder="City"
              className="w-full border rounded p-2"
            />
            {errors.city && (
              <p className="text-red-600 text-sm">{errors.city.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("state")}
              placeholder="State"
              className="w-full border rounded p-2"
            />
            {errors.state && (
              <p className="text-red-600 text-sm">{errors.state.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("postalCode")}
              placeholder="Postal Code"
              className="w-full border rounded p-2"
            />
            {errors.postalCode && (
              <p className="text-red-600 text-sm">{errors.postalCode.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("country")}
              placeholder="Country"
              className="w-full border rounded p-2"
            />
            {errors.country && (
              <p className="text-red-600 text-sm">{errors.country.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <select
              {...register("addressType")}
              className="w-full border rounded p-2"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <input type="checkbox" {...register("isDefault")} className="h-4 w-4" />
            <label className="text-sm">Set as default address</label>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {initialData ? "Update Address" : "Add Address"}
          </button>
        </div>
      </form>
    </div>
  );
}
