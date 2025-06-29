import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchNotes = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setNotes([]);
      return;
    }

    fetch(`${API_BASE_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          setNotes([]);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setNotes(data);
        else setNotes([]);
      })
      .catch(() => setNotes([]));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  //***************Searching notes**************

  const filteredNotes = notes.filter(
    (note) =>
      (typeof note.title === "string" &&
        note.title.toLowerCase().includes(search.toLowerCase())) ||
      (note.notes &&
        JSON.stringify(note.notes).toLowerCase().includes(search.toLowerCase()))
  );

  //***************Creating notes**************

  const handleCreate = (newNote) => {
    const token = localStorage.getItem("access_token");

    return fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((createdNote) => {
        if (newNote.tag_ids && newNote.tag_ids.length > 0) {
          const addTagPromises = newNote.tag_ids.map((tagId) =>
            fetch(`${API_BASE_URL}/notes/${createdNote.id}/tags`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ tag_id: tagId }),
            })
          );
          return Promise.all(addTagPromises).then(() => createdNote);
        }
        return createdNote;
      })
      .then((createdNote) => {
        fetchNotes();
        return createdNote;
      })
      .catch((err) => {
        toast.error("Failed to create note");
        throw err;
      });
  };

  //***************Updating notes**************

  const handleUpdate = async (id, updatedNote) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      const updatedNoteData = await response.json();

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updatedNoteData : note))
      );

      return updatedNoteData;
    } catch (error) {
      toast.error("Failed to update note.");
      throw error;
    }
  };

  //***************Deleting notes**************

  const handleDelete = (id) => {
    const token = localStorage.getItem("access_token");

    return fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        toast.success("Note deleted!");
      })
      .catch((err) => {
        toast.error("Failed to delete note");
        throw err;
      });
  };

  const context_data = {
    notes,
    setNotes,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchNotes,
    search,
    setSearch,
    filteredNotes,
  };

  return (
    <NotesContext.Provider value={context_data}>
      {children}
    </NotesContext.Provider>
  );
}
