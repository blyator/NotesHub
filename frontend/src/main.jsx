import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { NotesProvider } from "./context/NotesContext";
import { TagsProvider } from "./context/TagsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotesProvider>
        <UserProvider>
          <TagsProvider>
            <App />
          </TagsProvider>
        </UserProvider>
      </NotesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
