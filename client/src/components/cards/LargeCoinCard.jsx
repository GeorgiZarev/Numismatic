import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCoins } from "../../hooks/useCoins";

const LargeCoinCard = () => {
  const { id } = useParams();
  const { getCoin, loading, error } = useCoins();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const data = await getCoin(id);
        setCoin(data);
      } catch (err) {
        console.error("Failed to fetch coin:", err);
      }
    };

    fetchCoin();
  }, [id, getCoin]);

  if (loading) return <p>Loading coin...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!coin) return null;

  return (
    <div className="max-w-[1200px] mx-auto p-6 sm:p-6 bg-gray-100 rounded-xl shadow-lg">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 text-center relative">
        Product Details
        <div className="mt-4 mx-auto w-20 h-1 bg-orange-500 rounded"></div>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={coin.photo_url}
                alt="Front View"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={coin.photo_url}
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
              <div className="text-orange-500 font-semibold">Name</div>
              <div className="font-medium">{coin.name}</div>
              <div className="text-orange-500 font-semibold">Country</div>
              <div className="font-medium">{coin.country}</div>
              <div className="text-orange-500 font-semibold">Year</div>
              <div className="font-medium">{coin.year}</div>
              <div className="text-orange-500 font-semibold">Material</div>
              <div className="font-medium">{coin.composition_metal}</div>
              <div className="text-orange-500 font-semibold">Monarch</div>
              <div className="font-medium">{coin.monarch}</div>
              <div className="text-orange-500 font-semibold">Weight</div>
              <div className="font-medium">{coin.weight}</div>
              <div className="text-orange-500 font-semibold">Shape</div>
              <div className="font-medium">{coin.shape}</div>
              <div className="text-orange-500 font-semibold">Denomination</div>
              <div className="font-medium">{coin.denomination}</div>
              <div className="text-orange-500 font-semibold">Script</div>
              <div className="font-medium">{coin.script}</div>
              <div className="text-orange-500 font-semibold">Lettering</div>
              <div className="font-medium">{coin.lettering}</div>
              <div className="text-orange-500 font-semibold">Mintage</div>
              <div className="font-medium">{coin.mintage}</div>
              <div className="text-orange-500 font-semibold">Mint Place</div>
              <div className="font-medium">{coin.mint_place}</div>
              <div className="text-orange-500 font-semibold">Coin Grading</div>
              <div className="font-medium">{coin.coin_grading}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LargeCoinCard;
