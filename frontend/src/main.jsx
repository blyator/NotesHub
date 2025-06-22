import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { NotesProvider } from "./context/NotesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotesProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </NotesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
