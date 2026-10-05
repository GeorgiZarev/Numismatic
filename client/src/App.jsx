import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./i18n";

import Navbar from "./components/Header/Navbar.jsx";
//import NavbarMain from './components/Header/NavbarMain';
import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import AllProducts from "./pages/allProducts.jsx";
// import Product from "./pages/product.jsx";
import Cart from "./pages/cart.jsx";
import PlaceOrder from "./pages/placeOrder.jsx";
import Orders from "./pages/orders.jsx";
// import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

//import SmallCoinCard from './components/cards/SmallCoinCard';
import LargeCoinCard from "./components/cards/LargeCoinCard";
import ScrollToTop from "./components/ScrollToTop";

//import ReactDOM from 'react-dom';
//import { BrowserRouter } from 'react-router-dom';
import "./Assets/ObjFile.js";
import "./App.css";
import Login from "./pages/login.jsx";
import CoinCreate from "./pages/CoinCreate.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminOrders from "./pages/adminOrders.jsx";
import Profile from "./pages/profile.jsx";
import AdminProducts from "./pages/adminProducts.jsx";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ScrollToTop />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/consumables" element={<Navigate to="/all-products?product_type=consumable" replace />} />
        {/* /:productId" */}
        <Route path="/product/:id" element={<LargeCoinCard />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<CoinCreate />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/create-coin" element={<Navigate to="/admin/products/new" replace />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
