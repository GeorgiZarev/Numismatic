import React from 'react';
import CatalogGrid from '../Partial/CatalogGrid.jsx';
import { assets } from '../../Assets/ObjFile';

const Header = () => {
    return (
        <>
        <div style={{  backgroundImage: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)' }} className='flex flex-col sm:flex-row border border-gray-300 '>
            {/* Left side */}
            
            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
                <div className='text-[#edce8a]'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 md:w-11 h-[2px] bg-[#edce8a]'></p>
                        <p className='font-medium text-sm md:text-base'>Coins with</p>
                    </div>
                    <h1 className='monoton-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>COINS</h1>
                    <div className='flex items-center gap-2'>
                         <p className='font-semibold text-sm md:text-base'>Numismatic value</p>
                         <p className='w-8 md:w-11 h-[1px] bg-[#edce8a]'></p>
                    </div>
                </div>
            </div>
            <img className='w-full sm:w-1/2' src={assets.hero_img} alt="coins img"/> 
        </div>
        <br />
        {/*w-full sm:w-1/2 flex text-2xl justify-center items-center py 10 sm:py-0*/}
        {/*
        <div className='flex item-center justify-center'>
            <h1 className='pt-serif-regular-italic text-2xl items-center py-5  sm:py-5'>...</h1>
            
        </div>
        */}
        
        </>
    );
};

export default Header;