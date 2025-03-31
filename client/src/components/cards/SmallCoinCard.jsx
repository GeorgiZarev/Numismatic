import React from 'react';

const SmallCoinCard = () => {
  return (
    <div className="flex items-center p-4 shadow-md max-w-[700px] rounded-lg bg-white">
      <div className="w-[135px] h-[140px] mr-4 bg-[hsl(0,0%,94%)] rounded-lg overflow-hidden">
        <img src="https://placehold.co/135x140" alt="Coin" className="w-full h-full" />
      </div>
      <div className="w-[135px] h-[140px] mr-4 bg-[hsl(0,0%,94%)] rounded-lg overflow-hidden">
        <img src="https://placehold.co/135x140" alt="Coin" className="w-full h-full" />
      </div>

      {/* Coin Details */}
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <img src="https://rene-crevel.com/images/country-flag-16X16/Bulgaria.png" alt="Bulgarian Flag" width="20" className="mr-2" />
          <span className="font-bold text-base">5 Stotinki - Ferdinand I (1917)</span>
        </div>

        {/* Coin Description */}
        <p className="text-gray-600 mt-2 mb-4">
          in circulation or not <br />
          composition (metal) . Weight (in g) . diameter <br />
          product number (e.g. N#1021)
        </p>

        <button className="py-2 px-4 bg-[#ff9800] text-white rounded cursor-pointer">
          Action Button
        </button>
      </div>
    </div>
  );
};

export default SmallCoinCard;
