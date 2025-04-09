import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../Assets/ObjFile.js";

function Footer() {
  return (
    <div>
      <hr />
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm">
        <div>
          <img src={assets.company_logo} className="mb-5 w-32" alt="Logo" />
          <p className="w-full md:w-2/3 text-gray-600">
            Numisora is your trusted shop for rare and collectible coins. We are
            passionate about history, craftsmanship, and connecting collectors
            with timeless treasures from around the world.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">Numisora</p>
          <ul className="flex flex-col cursor-pointer gap-1 text-gray-600">
            <Link to="/">Home</Link>
            <Link to="/about">About us</Link>
            {/* TODO add delivery and policy pages */}
            <Link to="/all-products">Products</Link>
            <Link to="/contact">Contact</Link>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+123456789</li>
            <li>+359 888888</li>
            <li>mail@mail.com</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 py-5 text-center">
        <hr />
        <br />
        <p className="text-xs sm:text-sm text-gray-500">
          © 2025 Numisora - All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
