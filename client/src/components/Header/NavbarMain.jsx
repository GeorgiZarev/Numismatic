import React, { useState, useEffect } from "react";
import { Layout, Button, Drawer } from "antd";
import NavbarMenu1 from "./Navbar2.jsx";
import NavbarMenu2 from "./Navbar3.jsx";
import "../../styles/Navbar2.css";
import { MenuOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import "antd/dist/reset.css"; 

const NavbarMain = () => {
  const [open, setOpen] = useState(false); // ✅ Updated state

  const showDrawer = () => {
    setOpen(!open);
  };

  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="navbar">
      <Layout>
        <Layout.Header className="nav-header">
          <div className="logo">
            <h3 className="brand-font">Brand Here</h3>
          </div>
          <div className="navbar-menu">
            <div className="NavbarMenu2">
              <NavbarMenu2 mode="horizontal" />
            </div>
            <Button 
              className="menuButton" 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={showDrawer}
            />
            <div className="NavbarMenu1">
              <NavbarMenu1 mode="horizontal" />
            </div>

            {/* ✅ Drawer `visible` → `open` in AntD v5 */}
            <Drawer
              title="Brand Here"
              placement="right"
              closable
              onClose={showDrawer}
              open={open} // ✅ Updated prop
              style={{ zIndex: 9999 }}
            >
              <NavbarMenu2 mode="inline" />
              <NavbarMenu1 mode="inline" />
            </Drawer>
          </div>
        </Layout.Header>
      </Layout>
    </nav>
  );
};

export default NavbarMain;
