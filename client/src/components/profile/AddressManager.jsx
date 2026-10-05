import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAddress, deleteAddress, fetchAddresses, updateAddress } from "../../api/addresses";

const blankAddress = { label: "", full_name: "", phone: "", city: "", address: "", notes: "", is_default: false };
const fields = [["label", "Label (Home, Work...)"], ["full_name", "Full name"], ["phone", "Phone"], ["city", "City"], ["address", "Street address or courier office"], ["notes", "Delivery notes"]];

const AddressManager = () => {
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading, isError } = useQuery({ queryKey: ["addresses"], queryFn: fetchAddresses });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const save = useMutation({
    mutationFn: () => editingId ? updateAddress(editingId, form) : createAddress(form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["addresses"] }); setForm(null); setEditingId(null); setError(""); },
    onError: (err) => setError(err.response?.data?.error?.message || "Could not save address."),
  });
  const remove = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
    onError: () => setError("Could not delete address."),
  });

  return <section className="border-t mt-8 pt-7">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <h2 className="text-xl font-semibold">Saved addresses</h2>
      <button type="button" onClick={() => { setEditingId(null); setForm({ ...blankAddress }); setError(""); }} className="bg-gray-900 text-white px-4 py-3 rounded">Add address</button>
    </div>
    {isLoading && <p>Loading addresses...</p>}
    {isError && <p className="text-red-700">Could not load addresses.</p>}
    <div className="grid sm:grid-cols-2 gap-4">
      {addresses.map((item) => <div key={item.id} className="border rounded p-4">
        <div className="flex items-center justify-between gap-2"><h3 className="font-semibold">{item.label}</h3>{item.is_default && <span className="text-sm text-green-700">Default</span>}</div>
        <p className="mt-2">{item.full_name}, {item.phone}</p><p>{item.city}, {item.address}</p>{item.notes && <p className="text-gray-600">{item.notes}</p>}
        <div className="flex flex-wrap gap-2 mt-4"><button type="button" className="border px-3 py-2 rounded" onClick={() => { setEditingId(item.id); setForm({ label: item.label, full_name: item.full_name, phone: item.phone, city: item.city, address: item.address, notes: item.notes || "", is_default: item.is_default }); }}>Edit</button>
          {!item.is_default && <button type="button" className="border px-3 py-2 rounded" onClick={() => updateAddress(item.id, { label: item.label, full_name: item.full_name, phone: item.phone, city: item.city, address: item.address, notes: item.notes || "", is_default: true }).then(() => queryClient.invalidateQueries({ queryKey: ["addresses"] })).catch(() => setError("Could not set default address."))}>Set default</button>}
          <button type="button" className="text-red-700 border px-3 py-2 rounded" onClick={() => remove.mutate(item.id)}>Delete</button></div>
      </div>)}
    </div>
    {form && <form className="border rounded p-5 mt-5" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}>
      <h3 className="font-semibold mb-4">{editingId ? "Edit address" : "New address"}</h3>
      <div className="grid sm:grid-cols-2 gap-4">{fields.map(([name, label]) => <label key={name} className={name === "address" || name === "notes" ? "sm:col-span-2" : ""}><span className="block text-sm mb-1">{label}</span><input className="border p-3 rounded w-full" value={form[name]} required={name !== "notes"} onChange={(event) => setForm({ ...form, [name]: event.target.value })} /></label>)}</div>
      <label className="flex items-center gap-2 mt-4"><input type="checkbox" checked={form.is_default} onChange={(event) => setForm({ ...form, is_default: event.target.checked })} />Use as default address</label>
      <div className="flex gap-3 mt-5"><button disabled={save.isPending} className="bg-orange-600 text-white px-5 py-3 rounded">{save.isPending ? "Saving..." : "Save address"}</button><button type="button" className="border px-5 py-3 rounded" onClick={() => setForm(null)}>Cancel</button></div>
    </form>}
    {error && <p role="alert" className="text-red-700 mt-3">{error}</p>}
  </section>;
};

export default AddressManager;
