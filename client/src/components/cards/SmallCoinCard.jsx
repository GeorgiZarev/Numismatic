import React from "react";
import { Link } from "react-router-dom";

const SmallCoinCard = ({
  id,
  image,
  name,
  description,
  flagImage,
  actionLabel,
  onAction,
}) => {
  const defaultImage = "https://placehold.co/135x140";
  const coinImage1 = image || defaultImage;
  const coinImage2 = image || defaultImage;
  const defaultFlag =
    "https://rene-crevel.com/images/country-flag-16X16/Bulgaria.png";
  const coinFlag = flagImage || defaultFlag;

  return (
    <Link
      to={`/product/${id}`}
      className="flex items-center p-4 shadow-md max-w-[700px] rounded-lg bg-white"
    >
      <div>
        <div className="hidden md:flex items-center">
          <div className="flex gap-4 mr-4">
            <div className="w-[135px] h-[140px] bg-[hsl(0,0%,94%)] rounded-lg overflow-hidden">
              <img
                src={coinImage1}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[135px] h-[140px] bg-[hsl(0,0%,94%)] rounded-lg overflow-hidden">
              <img
                src={coinImage2}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <img src={defaultFlag} alt="Flag" width="20" className="mr-2" />
              <span className="font-bold text-base">{name}</span>
            </div>
            <p className="text-gray-600 mt-2 mb-6 leading-relaxed">
              {description}
            </p>
            <button
              className="py-2 px-6 bg-[#ff9800] text-white rounded cursor-pointer"
              onClick={(e) => {
                e.preventDefault(); //& prevents link click
                onAction?.();
              }}
            >
              {actionLabel || "Action Button"}
            </button>
          </div>
        </div>

        <div className="hidden sm:flex md:hidden flex-col items-center">
          <div className="flex gap-4 mb-4">
            <div className="w-[135px] h-[140px] bg-[hsl(0,0%,94%)] rounded-lg overflow-hidden">
              <img
                src={coinImage1}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[135px] h-[140px] bg-[hsl(0,0%,94%)] rounded-lg overflow-hidden">
              <img
                src={coinImage2}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <img src={defaultFlag} alt="Flag" width="20" className="mr-2" />
              <span className="font-bold text-base">{name}</span>
            </div>
            <p className="text-gray-600 mt-2 mb-6 leading-relaxed">
              {description}
            </p>
            <button
              className="py-2 px-6 bg-[#ff9800] text-white rounded cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                onAction?.();
              }}
            >
              {actionLabel || "Action Button"}
            </button>
          </div>
        </div>

        <div className="flex sm:hidden flex-col items-center">
          <div className="w-[135px] h-[140px] mb-4 bg-[hsl(0,0%,94%)] rounded-lg overflow-hidden">
            <img
              src={coinImage1}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <img src={defaultFlag} alt="Flag" width="20" className="mr-2" />
              <span className="font-bold text-base">{name}</span>
            </div>
            <p className="text-gray-600 mt-2 mb-6 leading-relaxed">
              {description}
            </p>
            <button
              className="py-2 px-6 bg-[#ff9800] text-white rounded cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                onAction?.();
              }}
            >
              {actionLabel || "Action Button"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SmallCoinCard;
