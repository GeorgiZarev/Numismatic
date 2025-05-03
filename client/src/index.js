import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CreateShopContextProvider from "./Contexts/createContext";
import { AuthProvider } from "./Contexts/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./main.css";
import App from "./App";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      {" "}
      {/* ✅ Wrap app */}
      <AuthProvider>
        <CreateShopContextProvider>
          <App />
        </CreateShopContextProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
