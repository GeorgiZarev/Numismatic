import { useEffect, useState } from "react";

const emptyProfile = {
  full_name: "",
  phone: "",
  city: "",
  address: "",
};

const ProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState(emptyProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      full_name: user?.full_name || "",
      phone: user?.phone || "",
      city: user?.city || "",
      address: user?.address || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await onSave(formData);
      setMessage("Profile saved.");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Could not save profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Delivery details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Full name"
          className="border p-3 rounded"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone number"
          className="border p-3 rounded"
        />
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="border p-3 rounded"
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address or courier office"
          className="border p-3 rounded"
        />
      </div>

      {message && <p className="text-green-700 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded disabled:opacity-70"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
};

export default ProfileForm;
