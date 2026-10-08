import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAddress, deleteAddress, fetchAddresses, updateAddress } from "../../api/addresses";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { secondaryButtonClass } from "./profileStyles";

const blankAddress = {
  label: "", full_name: "", phone: "", city: "", address: "", postal_code: "",
  address_line_2: "", country: "", notes: "", is_default: false,
};

const AddressManager = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: addresses = [], isLoading, isError } = useQuery({ queryKey: ["addresses"], queryFn: fetchAddresses });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  const refreshAddresses = () => queryClient.invalidateQueries({ queryKey: ["addresses"] });
  const save = useMutation({
    mutationFn: () => editingId ? updateAddress(editingId, form) : createAddress(form),
    onSuccess: () => { refreshAddresses(); setForm(null); setEditingId(null); setError(""); },
    onError: (err) => setError(err.response?.data?.error?.message || t("profile.saveAddressError")),
  });
  const remove = useMutation({
    mutationFn: deleteAddress,
    onSuccess: refreshAddresses,
    onError: () => setError(t("profile.deleteAddressError")),
  });
  const setDefault = useMutation({
    mutationFn: (address) => updateAddress(address.id, {
      label: address.label, full_name: address.full_name, phone: address.phone,
      city: address.city, address: address.address, postal_code: address.postal_code || "",
      address_line_2: address.address_line_2 || "", country: address.country || "",
      notes: address.notes || "", is_default: true,
    }),
    onSuccess: refreshAddresses,
    onError: () => setError(t("profile.defaultAddressError")),
  });

  const editAddress = (address) => {
    const { label, full_name, phone, city, notes, is_default } = address;
    setEditingId(address.id);
    setForm({
      label, full_name, phone, city, address: address.address,
      postal_code: address.postal_code || "", address_line_2: address.address_line_2 || "",
      country: address.country || "", notes: notes || "", is_default,
    });
    setError("");
  };

  return (
    <section aria-labelledby="saved-addresses-title" className="border-t border-[#dce3df] py-10 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="saved-addresses-title" className="font-serif text-2xl font-semibold text-[#142e28] sm:text-[28px]">{t("profile.savedAddresses")}</h2>
          <p className="mt-1 text-sm text-[#62736a]">{t("profile.addressesIntro")}</p>
        </div>
        <button type="button" className={secondaryButtonClass} onClick={() => { setEditingId(null); setForm({ ...blankAddress }); setError(""); }}>
          {t("profile.addAddress")}
        </button>
      </div>

      {isLoading && <p className="text-sm text-[#62736a]">{t("profile.loadingAddresses")}</p>}
      {isError && <p role="alert" className="text-sm text-[#963b33]">{t("profile.loadAddressesError")}</p>}
      {!isLoading && !isError && addresses.length === 0 && (
        <div className="border border-dashed border-[#b9c9c0] bg-[#f8faf8] px-5 py-8 text-sm text-[#53675c]">
          {t("profile.noAddresses")}
        </div>
      )}
      {addresses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={editAddress}
              onSetDefault={(item) => { setError(""); setDefault.mutate(item); }}
              onDelete={(id) => { setError(""); remove.mutate(id); }}
              busy={remove.isPending || setDefault.isPending}
            />
          ))}
        </div>
      )}
      {form && (
        <AddressForm
          form={form}
          editing={Boolean(editingId)}
          saving={save.isPending}
          onChange={(event) => {
            const { name, value, type, checked } = event.target;
            setForm((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
          }}
          onSubmit={(event) => { event.preventDefault(); save.mutate(); }}
          onCancel={() => { setForm(null); setEditingId(null); setError(""); }}
        />
      )}
      {error && <p role="alert" className="mt-4 text-sm text-[#963b33]">{error}</p>}
    </section>
  );
};

export default AddressManager;
