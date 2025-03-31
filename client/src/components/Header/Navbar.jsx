import React from 'react';
import { IoSearch } from "react-icons/io5";
import { assets } from '../../Assets/ObjFile';
import { Link, NavLink } from 'react-router-dom';
//import { FaShoppingCart } from 'react-icons/fa';
//import '../../styles/Navbar.css';

const Navbar = () => {

  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <img src={assets} className='w-36' alt="Logo here" />
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/all-products' className='flex flex-col items-center gap-1'>
          <p>PRODUCTS</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
      </ul>

      <div className='flex item-center gap-2'>
        <IoSearch  className='w-5 h-6 cursor-pointer 
          transition-transform 
          duration-200
          ease-in-out
          hover:scale-110'/>
        {/* <img src={assets} className='w-5 cursor-pointer' alt="search icon" /> */}
        <div className='group relative'>
         {/* <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              <p className='cursor-pointer hover:text-black'>My profile</p>
              <p className='cursor-pointer hover:text-black'>Orders</p>
              <p className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div> */}
        </div>
        <Link to='/cart' className='relative'> 
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="cart icon"/>
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'></p>
        </Link>
        <img onClick={()=>setShowMenu(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
      </div>
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${showMenu ? "w-full" : "w-0"}`}>
          <div className={`flex flex-col text-gray-600`}>
            <div onClick={()=>setShowMenu(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
              <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="dropdown icon" />
              <p>Back</p>
            </div>
            <NavLink onClick={()=>setShowMenu(false)} className='py-2 pl-6 border' to='/' >HOME</ NavLink>
            <NavLink onClick={()=>setShowMenu(false)} className='py-2 pl-6 border' to='/product' >PRODUCTS</ NavLink>
            <NavLink onClick={()=>setShowMenu(false)} className='py-2 pl-6 border' to='/about' >ABOUT</ NavLink>
            <NavLink onClick={()=>setShowMenu(false)} className='py-2 pl-6 border' to='/contact'> CONTACT</ NavLink>
          </div>
        </div>
    </div>
  );
};  

export default Navbar;
