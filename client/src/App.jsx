
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Header/Navbar.jsx';
//import NavbarMain from './components/Header/NavbarMain';
import Home from './pages/home.jsx';
import About from './pages/about.jsx';
import Contact from './pages/contact.jsx';
import Product from './pages/product.jsx';
import Cart from './pages/cart.jsx';
import PlaceOrder from './pages/placeOrder.jsx';
import Orders from './pages/orders.jsx';
import Header from './components/Header/Header.jsx'
//import SmallCoinCard from './components/cards/SmallCoinCard';
//import LargeCoinCard from './components/cards/LargeCoinCard';
//import ReactDOM from 'react-dom';
//import { BrowserRouter } from 'react-router-dom';
import './Assets/ObjFile.js';
import './App.css';

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

      <Navbar />
      
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
