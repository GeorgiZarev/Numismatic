// Banner.jsx
import React from 'react'

const Banner = () => {
  return (
    <div className="relative h-64 sm:h-80 text-white flex justify-center items-center 
    pt-[70px] pb-[70px] bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: 'url("https://placehold.co/1600x400")'
      }}>
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      <div className="relative flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-3xl sm:text-5xl font-bold">Banner</h1>
        <p className="mt-2 text-lg sm:text-2xl">more text...</p> 
      </div>
    </div>
  )
}

export default Banner
