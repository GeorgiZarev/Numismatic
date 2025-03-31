import React, { useContext, useEffect, useState } from 'react'
import { createShopContext } from '../Contexts/createContext'
import { assets } from '../Assets/ObjFile.js'
import Title from '../components/Partial/TitleGrid.jsx'
import ProductItem from '../components/Partial/ProductItem'
import BannerProducts from '../components/cards/BannerProducts.jsx'
import SmallCoinCard from '../components/cards/SmallCoinCard.jsx'
import SmallCoinCard2 from '../components/cards/SmallCoinCard2.jsx'

const AllProducts = () => {
  const { products } = useContext(createShopContext)
  const [filterActive, setFilterActive] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])

  useEffect(() => {
    setFilterProducts(products)
  }, [products]) 

  const handleAllItems = () => {
    console.log('Show all items')
    // TODO Reset or show entire collection if needed
  }

  return (
    <div> <BannerProducts /> 
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-10 border-t">
      {/* Left Filters */}
       
      <div className="min-w-[15rem]">
       
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2"
          onClick={() => setFilterActive(!filterActive)}>
          FILTER
          <img
            className={`h-3 sm:hidden transform ${filterActive ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon} alt="toggle"/>
        </p>

        <div
          className={`border border-gray-300 sm:border-2 pl-3 py-2 mt-4 sm:pl-5 sm:py-3 sm:mt-6 
            ${filterActive ? 'block' : 'hidden sm:block'}`}>
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-base font-light text-gray-700">
            <p className="cursor-pointer" onClick={handleAllItems}>
              All Items
            </p>
            <p className="cursor-pointer">Bulgarian</p>
            <p className="cursor-pointer">Country2</p>
            <p className="cursor-pointer">Country3</p>
            <p className="cursor-pointer">Other</p>
          </div>
        </div>

        <div
          className={`border border-gray-300 sm:border-2 pl-3 py-2 my-3 sm:pl-5 sm:py-3 sm:my-5 ${
            filterActive ? 'block' : 'hidden sm:block'}`}>
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-base font-light text-gray-700">
            <p className="cursor-pointer">something1</p>
            <p className="cursor-pointer">something2</p>
            <p className="cursor-pointer">something3</p>
          </div>
        </div>
        
      </div>

      {/* Right Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-xl mb-4">
          <Title text1="ALL" text2="ITEMS" />
          <select className="border-2 border-gray-300 text-sm px-2">
            <option value="low-high-price">Sort by: Price (Low to High)</option>
            <option value="high-low-price">Sort by: Price (High to Low)</option>
            <option value="low-high-year">Sort by: Year (Low to High)</option>
            <option value="high-low-year">Sort by: Year (High to Low)</option>
          </select>
        </div>

        <div >
        {filterProducts.map((item, index) => (
          <>
          <SmallCoinCard
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
            description={item.description} 
            flagImage={item.flagImage} 
          /> <br /> </>
        ))} 
        
        {/*
        {filterProducts.map((item, index) => (
          <ProductItem
            key={index}
            name={item.name}
            id={item._id}
            price={item.price}
            image={item.image}
          />
        ))}  
          */}

        <br /> <br />
        </div>
      </div>
    </div>
    </div>
  )
}

export default AllProducts
