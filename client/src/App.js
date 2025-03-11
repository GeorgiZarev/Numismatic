//import React from 'react';
//import Routes from './Routes';
//import logo from './logo.svg';
//import Navbar from './components/Header/Navbar';
//import Home from './pages/home';
//import About from './pages/about';
//import Contact from './pages/contact';
//import Product from './pages/product';
import SmallCoinCard from './components/cards/SmallCoinCard';
//import LargeCoinCard from './components/cards/LargeCoinCard';
import './App.css';
import './index.css';
import './styles/Navbar.css';



function App() {
  return (
    /*DESIGN TESTS FOR LARGE CARD*/
    <>
      <SmallCoinCard />
    </> 

 
    /*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>

    /* <Routes /> */
  );
}

export default App;
