import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setStep, setLoading } from "../../store/slices/checkoutSlice";
import { fetchAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from "../../services/checkoutService";
import toast from "react-hot-toast";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

export default function AddressStep() {
  const dispatch = useDispatch();
  const selectedAddressId = useSelector((state: any) => state.checkout.selectedAddressId);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const loadAddresses = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await fetchAddresses();
      setAddresses(data);
    } catch (e) {
      toast.error("Failed to load addresses");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSelect = (id: string) => {
    dispatch(setAddress(id));
  };

  const handleEdit = (addr: any) => {
    setEditing(addr);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      loadAddresses();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const handleDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address set");
      loadAddresses();
    } catch (e) {
      toast.error("Failed to set default");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await updateAddress(editing.id, values);
        toast.success("Address updated");
      } else {
        await createAddress(values);
        toast.success("Address added");
      }
      setShowForm(false);
      setEditing(null);
      loadAddresses();
    } catch (e) {
      toast.error("Operation failed");
    }
  };

  return (
    <div>
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          selected={addr.id === selectedAddressId}
          onSelect={() => handleSelect(addr.id)}
          onEdit={() => handleEdit(addr)}
          onDelete={() => handleDelete(addr.id)}
          onSetDefault={() => handleDefault(addr.id)}
        />
      ))}
      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={() => setShowForm(true)}
      >
        Add New Address
      </button>

      {showForm && (
        <AddressForm
          initialData={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSubmit={handleSubmit}
        />
      )}

      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          disabled={!selectedAddressId}
          onClick={() => dispatch(setStep(1))}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
