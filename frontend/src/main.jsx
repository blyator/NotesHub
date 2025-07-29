import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { NotesProvider } from "./context/NotesContext";
import { TagsProvider } from "./context/TagsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="16937577428-i1pdm0lldhh287oip0qnnk3q2a7cj4ah.apps.googleusercontent.com">
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
  </GoogleOAuthProvider>
);
