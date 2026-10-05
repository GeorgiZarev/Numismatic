import React from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/money";
import { getConsumableCategoryLabel } from "../../utils/consumableCategories";

const ProductItem = ({ id, image, name, price, type, category }) => (
  <Link to={`/product/${id}`} className="group min-w-0 border border-gray-200 bg-white rounded-md overflow-hidden hover:shadow-md transition-shadow">
    <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-5 overflow-hidden">
      {image ? <img src={image} alt={name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" /> : <span className="text-sm text-gray-500">Photo coming soon</span>}
    </div>
    <div className="p-4 min-h-24 flex flex-col justify-between gap-2">
      <div><p className="text-xs uppercase text-gray-500">{type === "consumable" ? getConsumableCategoryLabel(category) : "Coin"}</p><h3 className="text-base font-semibold text-gray-900 line-clamp-2">{name}</h3></div>
      <p className="font-semibold text-gray-900">{formatMoney(price)}</p>
    </div>
  </Link>
);

export default ProductItem;
