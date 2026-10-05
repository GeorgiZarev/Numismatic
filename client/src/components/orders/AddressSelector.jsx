import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchAddresses } from "../../api/addresses";

const AddressSelector = ({ selectedId, onSelect }) => {
  const { data: addresses = [], isLoading, isError } = useQuery({ queryKey: ["addresses"], queryFn: fetchAddresses });

  useEffect(() => {
    if (selectedId === undefined && addresses.length > 0) onSelect(addresses.find((item) => item.is_default) || addresses[0]);
  }, [addresses, selectedId, onSelect]);

  if (isLoading) return <p className="mb-5">Loading saved addresses...</p>;
  if (isError) return <p className="mb-5 text-red-700">Could not load saved addresses. You can enter delivery details below.</p>;
  if (addresses.length === 0) return null;

  return <fieldset className="mb-6 border-b pb-6">
    <legend className="font-semibold mb-3">Delivery address</legend>
    <div className="grid gap-2">{addresses.map((item) => <label key={item.id} className="flex items-start gap-3 border rounded p-3 cursor-pointer">
      <input type="radio" name="saved_address" className="mt-1" checked={selectedId === item.id} onChange={() => onSelect(item)} />
      <span><strong>{item.label}</strong>{item.is_default ? " (default)" : ""}<br />{item.full_name}, {item.city}, {item.address}</span>
    </label>)}
    <label className="flex items-center gap-3 border rounded p-3 cursor-pointer"><input type="radio" name="saved_address" checked={selectedId === "manual"} onChange={() => onSelect(null)} />Enter another address for this order</label></div>
  </fieldset>;
};

export default AddressSelector;
