import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCoins } from "../../hooks/useCoins";
import { useAuth } from "../../Contexts/authContext";

const LargeCoinCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCoin, deleteCoin, updateCoin, loading, error } = useCoins();

  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [coin, setCoin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const data = await getCoin(id);
        setCoin(data);
        setFormData(data);
      } catch (err) {
        console.error("Failed to fetch coin:", err);
      }
    };

    fetchCoin();
  }, [id, getCoin]);

  const handleDelete = async () => {
    try {
      await deleteCoin(id);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete coin:", err);
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const handleSave = async () => {
    setErrorMessage("");
    setSaving(true); // 🔥 start spinner

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key !== "photo_url") {
          if (["year", "price", "mintage"].includes(key)) {
            data.append(key, Number(value));
          } else {
            data.append(key, value);
          }
        }
      }
    });

    if (file) {
      data.append("photo", file);
    }

    try {
      const updated = await updateCoin(id, data); // 🔥 Lazy update
      setCoin(updated.coin); // 🔥 Use returned updated coin
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update coin:", err);
      setErrorMessage(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to update coin"
      );
    } finally {
      setSaving(false); // 🔥 stop spinner
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  if (!coin) return null;

  return (
    <div className="max-w-[1200px] mx-auto p-6 bg-gray-100 rounded-xl shadow-lg">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 text-center">
        Product Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={coin.photo_url || "https://placehold.co/200x200"}
                alt="Front View"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={coin.photo_url || "https://placehold.co/200x200"}
                alt="Back View"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="p-7 border border-gray-200 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-orange-500">•</span> Front Features
            </h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              Detailed description of front features with premium craftsmanship
              and attention to detail.
            </p>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-orange-500">•</span> Back Features
            </h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              Detailed description of back features showcasing the intricate
              design elements.
            </p>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-orange-500">•</span> Mint Condition
            </h2>
            <p className="leading-relaxed text-gray-600">
              Pristine condition with certification of authenticity and
              protective casing included.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="text-left pb-6 border-b-2 border-orange-500 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              Coin Info
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-bold text-orange-600">
                {coin.price} {coin.currency}
              </span>
            </div>
          </div>

          <div className="p-6 border rounded-lg shadow-sm mb-8">
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: "Name", key: "name" },
                { label: "Country", key: "country" },
                { label: "Year", key: "year" },
                { label: "Material", key: "composition_metal" },
                { label: "Monarch", key: "monarch" },
                { label: "Weight", key: "weight" },
                { label: "Shape", key: "shape" },
                { label: "Denomination", key: "denomination" },
                { label: "Script", key: "script" },
                { label: "Lettering", key: "lettering" },
                { label: "Mintage", key: "mintage" },
                { label: "Mint Place", key: "mint_place" },
                { label: "Coin Grading", key: "coin_grading" },
              ].map(({ label, key }) => (
                <React.Fragment key={key}>
                  <div className="text-orange-500 font-semibold">{label}</div>
                  <div className="font-medium">
                    {editMode ? (
                      <input
                        type="text"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      coin[key]
                    )}
                  </div>
                </React.Fragment>
              ))}

              {/* File input */}
              {editMode && (
                <>
                  <div className="text-orange-500 font-semibold">Photo</div>
                  <div className="font-medium">
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border rounded p-1 w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Buttons */}
          {user && (
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-4">
                {editMode ? (
                  <button
                    onClick={handleSave}
                    disabled={saving} // disable button while saving
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
                >
                  Delete
                </button>
              </div>

              {errorMessage && (
                <div className="bg-red-100 text-red-700 p-2 mt-2 rounded text-center border border-red-400">
                  {errorMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LargeCoinCard;
