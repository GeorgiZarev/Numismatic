import React, { useContext } from 'react';
import { createShopContext } from '../../Contexts/createContext';
import { Link } from 'react-router-dom';

const SmallCoinCard2 = ({ id, image, name, price, description, flagImage }) => {
  const { currency } = useContext(createShopContext);

  // Fallback values if images or flag are not provided
  const defaultImage = "https://placehold.co/135x140";
  const coinImage1 = image && image.length > 0 ? image[0] : defaultImage;
  const coinImage2 = image && image.length > 1 ? image[1] : defaultImage;
  const flagImg = "https://rene-crevel.com/images/country-flag-16X16/Bulgaria.png";
  const coinFlag = flagImage || flagImg;

  return (
    <Link
      to={`/product/${id}`}
      className="block text-gray-600 cursor-pointer p-4 border rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex gap-4">
        <div className="w-[135px] h-[140px] bg-[hsl(0,0%,94%)] rounded-lg overflow-hidden">
          <img
            src={coinImage1}
            alt={name}
            className="w-full h-full object-cover hover:scale-110 transition ease-in-out"/>
        </div>
        <div className="w-[135px] h-[140px] bg-[hsl(0,0%,94%)] rounded-lg overflow-hidden">
          <img src={coinImage2} alt={name}
            className="w-full h-full object-cover hover:scale-110 transition ease-in-out"/>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center mb-2">
          <img src={coinFlag} alt="Flag" width="20" className="mr-2"/>

          <span className="font-bold text-base">{name}</span>
        </div>

        {description && (
          <p className="text-gray-600 text-sm mb-2">
            {description}
          </p>
        )}

        <p className="text-sm font-medium">
          {price} {currency}
        </p>
      </div>
    </Link>
  );
};

export default SmallCoinCard2;
