import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import CreateShopContextProvider from "./Contexts/createContext";
import "./main.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <CreateShopContextProvider>
      <App />
    </CreateShopContextProvider>
  </BrowserRouter>
);
