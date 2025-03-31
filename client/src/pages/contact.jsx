import React from 'react'
import Title from '../components/Partial/Title'
import { assets } from '../Assets/ObjFile'
import { FaSquarePhone } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

const Contact = () => {
  return (
    <div className=" min-h-screen py-16">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-50 to-white p-10 rounded shadow-lg">

        <div className="flex flex-col justify-center md:flex-row gap-10">
           <img
            className="w-full md:max-w-[480px] rounded-lg object-cover shadow-sm"
            src={assets}
            alt="contact img"/>

          <div className="flex flex-col justify-center items-start gap-6">
            <div className="text-center text-2xl mb-8">
              <Title text1={'CONTACT'} text2={'US'} />
              <p className="text-gray-500 mt-2">We’d love to hear from you!</p>
            </div>

            <p className='font-semibold text-xl text-gray-700'> Write Us an Email at:</p>

            <p className="text-gray-500 hover:text-gray-700 cursor-pointer break-normal"> 
              {/* Write us an email at: <br /> */}
              <a href="mailto:mail@mail.com"
               className="inline-flex items-center gap-2 hover:text-gray-700 no-underline"> 
                <IoMail /> mail@mail.com
              </a>
            </p>

            <p className='font-semibold text-xl text-gray-700'> Give Us a Phone Call:</p>
            
            <p className='text-gray-500 hover:text-gray-700 cursor-pointer'> 
            <a href="tel:+123456789"
              className="inline-flex items-center gap-2 hover:text-gray-800 no-underline">
              <FaSquarePhone /> +123456789
            </a>
            </p>
            <p className='text-gray-500 hover:text-gray-700 cursor-pointer'> 
            <a href="tel:+123456789"
              className="inline-flex items-center gap-2 hover:text-gray-800 no-underline">
              <FaSquarePhone /> +359 88888
            </a>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
