import React, { useState } from 'react'
import { TruckOutlined, UndoOutlined, FacebookOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons'
import { assets } from '../../Assets/ObjFile.js'

const LargeCoinCard = () => {
  const [isHovering, setIsHovering] = useState(false)
  const handleAddToCart = () => { console.log('Product added to cart') }

  return (
    <div className="max-w-[1200px] mx-auto p-6 sm:p-6 bg-gray-100 rounded-xl shadow-lg">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 text-center relative">
        Product Details
        <div className="mt-4 mx-auto w-20 h-1 bg-orange-500 rounded"></div>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="w-[135px] h-[240px] bg-gray-100 rounded-lg overflow-hidden">
              <img src={assets} alt="Bomba 1" className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105" />
            </div>
            <div className="w-[135px] h-[240px] bg-gray-100 rounded-lg overflow-hidden">
              <img src={assets} alt="Bomba 2" className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105" />
            </div>
          </div>
          <div className="p-7 border border-gray-200 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2"><span className="text-orange-500">•</span> Front Features</h2>
            <p className="mb-6 leading-relaxed text-gray-600">Detailed description of front features with premium craftsmanship and attention to detail.</p>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2"><span className="text-orange-500">•</span> Back Features</h2>
            <p className="mb-6 leading-relaxed text-gray-600">Detailed description of back features showcasing the intricate design elements.</p>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2"><span className="text-orange-500">•</span> Mint Condition</h2>
            <p className="leading-relaxed text-gray-600">Pristine condition with certification of authenticity and protective casing included.</p>
          </div>
          <div className="p-4 text-center rounded-lg shadow border border-gray-200">
            <h3 className="mb-4 text-gray-600 font-medium">Share this product</h3>
            <div className="flex justify-center gap-3">
              <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center"><FacebookOutlined /></button>
              <button className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center"><TwitterOutlined /></button>
              <button className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center"><InstagramOutlined /></button>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div>
          <div className="text-left pb-6 border-b-2 border-orange-500 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">Coin Info</h1>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-bold text-orange-600">$129.99</span>
              <span className="text-sm text-gray-500 line-through">$159.99</span>
              <span className="text-xs text-white bg-green-600 px-2 py-1 rounded-full">20% OFF</span>
            </div>
          </div>
          <div className="p-6 border rounded-lg shadow-sm mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-orange-500 font-semibold">Country</div>
              <div className="font-medium">Bulgaria</div>
              <div className="text-orange-500 font-semibold">Year</div>
              <div className="font-medium">1985</div>
              <div className="text-orange-500 font-semibold">Material</div>
              <div className="font-medium">.925 Silver</div>
            </div>
          </div>
          <div className="p-6 border rounded-lg shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-3">
              <TruckOutlined className="text-blue-500 text-xl" />
              <span className="text-lg text-gray-700">Free shipping on all orders over $100</span>
            </div>
            <div className="flex items-center gap-3">
              <UndoOutlined className="text-blue-500 text-xl" />
              <span className="text-lg text-gray-700">30-day hassle-free return policy</span>
            </div>
          </div>
          <div className="p-6 border rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-medium text-gray-900">Quantity:</span>
              <input type="number" min="1" max="10" defaultValue="1" className="w-28 border border-gray-300 rounded p-2" />
            </div>
            <button
              className={`w-full py-2 px-6 text-white rounded font-semibold transition transform duration-300 ${isHovering ? 'bg-blue-600 hover:scale-105' : 'bg-orange-500 hover:scale-105'}`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleAddToCart}
            >
              {isHovering ? 'Coming Soon!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LargeCoinCard
