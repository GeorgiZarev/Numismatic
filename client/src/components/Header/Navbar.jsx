import React from 'react';
import '../../styles/Navbar.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="header">
            <a href="/" className="logo">Logo Here</a>

            <nav className="header">
                <a href="/">Home</a>
                <a href="/">About</a>
                <a href="/">Portfolio</a>
                <a href="/">Services</a>
                <a href="/">Contact</a>
            </nav>
        </header>
    );
}

export default Navbar;