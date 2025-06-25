import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { NotesContext } from "./NotesContext";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const TagsContext = createContext();

export function TagsProvider({ children }) {
  const [tags, setTags] = useState([]);
  const { fetchNotes } = useContext(NotesContext);
  const navigate = useNavigate();

  const fetchTags = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setTags([]);
      return;
    }

    fetch(`${API_BASE_URL}/tags`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          setTags([]);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setTags(data);
        else setTags([]);
      })
      .catch(() => setTags([]));
  };

  const createTag = (name) => {
    const token = localStorage.getItem("access_token");

    return fetch(`${API_BASE_URL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((createdTag) => {
        setTags((prevTags) => [...prevTags, createdTag]);
        return createdTag;
      });
  };

  const deleteTag = (tagId) => {
    const token = localStorage.getItem("access_token");

    return fetch(`${API_BASE_URL}/tags/${tagId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(() => {
        setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
      });
  };

  const addTagToNote = (noteId, tagId) => {
    const token = localStorage.getItem("access_token");

    return fetch(`${API_BASE_URL}/notes/${noteId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tag_id: tagId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(() => {
        fetchNotes(); // Refresh notes to get updated tags
      });
  };

  const removeTagFromNote = (noteId, tagId) => {
    const token = localStorage.getItem("access_token");

    return fetch(`${API_BASE_URL}/notes/${noteId}/tags/${tagId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(() => {
        fetchNotes(); // Refresh notes to get updated tags
      });
  };

  const context_data = {
    tags,
    fetchTags,
    createTag,
    deleteTag,
    addTagToNote,
    removeTagFromNote,
  };

  return (
    <TagsContext.Provider value={context_data}>{children}</TagsContext.Provider>
  );
}
