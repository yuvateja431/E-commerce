import React from "react";
import { CheckCircleIcon, PencilIcon, TrashIcon, StarIcon } from "@heroicons/react/24/outline";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

type Props = {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
};

export default function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  return (
    <div
      className={`border rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow ${
        selected ? "border-indigo-600 ring-2 ring-indigo-200" : "border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{address.fullName}</h3>
          <p className="text-sm text-gray-600">{address.phone}</p>
          <p className="mt-2 text-sm text-gray-800">
            {address.addressLine1}
            {address.addressLine2 && `, ${address.addressLine2}`}
            {address.landmark && `, ${address.landmark}`}
            <br />
            {address.city}, {address.state} - {address.postalCode}
            <br />
            {address.country}
          </p>
        </div>
        <div className="flex flex-col space-y-1">
          {address.isDefault && (
            <StarIcon className="h-5 w-5 text-yellow-500" title="Default address" />
          )}
          {selected && (
            <CheckCircleIcon className="h-5 w-5 text-indigo-600" title="Selected" />
          )}
        </div>
      </div>
      <div className="mt-3 flex space-x-2">
        <button
          type="button"
          className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <PencilIcon className="inline h-4 w-4 mr-1" /> Edit
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm bg-red-200 rounded hover:bg-red-300"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <TrashIcon className="inline h-4 w-4 mr-1" /> Delete
        </button>
        {!address.isDefault && (
          <button
            type="button"
            className="px-2 py-1 text-sm bg-indigo-200 rounded hover:bg-indigo-300"
            onClick={(e) => {
              e.stopPropagation();
              onSetDefault();
            }}
          >
            <StarIcon className="inline h-4 w-4 mr-1" /> Set Default
          </button>
        )}
      </div>
    </div>
  );
}
