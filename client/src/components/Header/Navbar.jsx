import React from "react";
import "../../styles/Navbar.css";
//import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'; /*Not needed*/
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: "auto",  /*Pushes search bar to the right so it does not overlap with the logo */
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  }));
  
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));
  
  const Navbar = () => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" className="header" sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
          <Toolbar>
            {/* Logo */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <a href="/" className="logo">
                Logo Here {/* TODO: Put Logo*/}
              </a>
            </Typography>
  
            {/* Navigation Links */} 
            {/* TODO: Write the routs/links for these pages*/}
            <nav className="navbar">
              <a href="/">Home</a>
              <a href="/">About</a>
              <a href="/">Product</a>
              <a href="/">Contact</a>
            </nav>
  
            {/* MUI Search Bar; do not put variables here*/} 
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
    );
  };

export default Navbar;