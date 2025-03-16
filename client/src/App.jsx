
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Header/Navbar';
import NavbarMain from './components/Header/NavbarMain';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Product from './pages/product';
import Cart from './pages/cart';
import PlaceOrder from './pages/placeOrder';
import Orders from './pages/orders';
//import SmallCoinCard from './components/cards/SmallCoinCard';
//import LargeCoinCard from './components/cards/LargeCoinCard';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './Assets/ObjFile.js';
import './App.css';

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

      <Navbar />
      <br />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
     </Routes>
    
    </div>
  );
};


// function App() {
//   return (
//     /*NAVBAR TESTS*/
//     <>
//       <NavbarMain />
//         </>
//       );
//     }

 

export default App;
