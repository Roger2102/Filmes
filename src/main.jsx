import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 👇 basename aponta para o repositório do GitHub Pages */}
    <BrowserRouter basename="/Filmes">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
