import React from "react";
import { Menu, Avatar, Dropdown } from "antd";
import { UserOutlined, CodeOutlined, LogoutOutlined } from "@ant-design/icons";


const NavbarMenu2 = ({ mode }) => {
  const userMenu = (
    <Menu>
      <Menu.Item key="project" icon={<CodeOutlined />}>
        Projects
      </Menu.Item>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Menu mode={mode}>

      <Menu.Item key="user">
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <span className="user-dropdown">
            <Avatar icon={<UserOutlined />} /> <span className="username">Dilyan Yanev</span>
          </span>
        </Dropdown>
      </Menu.Item>
    </Menu>
  );
};

export default NavbarMenu2;
