import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NotesContext } from "./NotesContext";

export const UserContext = createContext();

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const { setNotes } = useContext(NotesContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auth_token, setAuthToken] = useState(() =>
    localStorage.getItem("access_token")
  );

  //*********************register a user *********************

  async function register_user(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  }

  //*****************login a user ********************

  const login_user = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Login failed");
      }

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        setAuthToken(data.access_token);

        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  //**************fetch current user *****************

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/current_user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    }
  };

  //***************logout a user *****************

  function logout_user() {
    fetch(`${API_BASE_URL}/logout`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("showWelcomeMsg");
          setAuthToken(null);
          setCurrentUser(null);
          setNotes([]);
          navigate("/login");
        }
      });
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auth_token) {
      fetch(`${API_BASE_URL}/current_user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.msg) {
            setLoading(false);
          } else {
            setCurrentUser(res);
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    }
  }, [auth_token]);

  const context_data = {
    register_user,
    login_user,
    logout_user,
    auth_token,
    currentUser,
    loading,
    fetchCurrentUser,
  };

  return (
    <UserContext.Provider value={context_data}>{children}</UserContext.Provider>
  );
};
