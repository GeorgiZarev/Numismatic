import React from "react";
import { Menu } from "antd";
//import "../../styles/Navbar2.css";

const NavbarMenu1 = ({ mode }) => {
  return (
    <Menu mode={mode}>
      <Menu.Item key="home">Home</Menu.Item>
      <Menu.Item key="products">Products</Menu.Item>
      <Menu.Item key="about">About</Menu.Item>
      <Menu.Item key="contact">Contact</Menu.Item>
      
    </Menu>
  );
  
};



export default NavbarMenu1;