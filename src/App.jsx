import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NoteList from "./components/NoteList.jsx";
import SaveNotes from "./components/SaveNotes.jsx";
import EditNote from "./components/EditNote.jsx";
import Navbar from "./components/Navbar.jsx";
import toast, { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://noteshub-ki3s.onrender.com/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Failed:", err));
  }, []);

  const handleCreate = (newNote) => {
    fetch("https://noteshub-ki3s.onrender.com/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((createdNote) => {
        setNotes((prevNotes) => [...prevNotes, createdNote]);
        toast.success("Your masterpiece is saved", {
          className: "alert alert-success",
        });
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const handleUpdate = (id, updatedNote) => {
    fetch(`https://noteshub-ki3s.onrender.com/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    })
      .then((res) => res.json())
      .then((updatedNote) => {
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === id ? updatedNote : note))
        );
        toast.success("Edit complete — you're on fire ⚡", {
          className: "alert alert-success",
        });
      })
      .catch((err) => console.error("error:", err));
  };

  const handleDelete = (id) => {
    fetch(`https://noteshub-ki3s.onrender.com/notes/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      })
      .catch((err) => console.error("error:", err));
  };

  const filteredNotes = notes.filter((note) => {
    const searchLower = search.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.items.some((item) => item.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="max-w-7xl mx-auto min-h-screen flex flex-col bg-base-100">
      <Toaster position="top-right" />
      <Navbar search={search} setSearch={setSearch} />
      <main className="p-4 flex-grow">
        <Routes>
          <Route
            path="/"
            element={<NoteList notes={filteredNotes} onDelete={handleDelete} />}
          />
          <Route path="/save" element={<SaveNotes onCreate={handleCreate} />} />
          <Route
            path="/edit/:id"
            element={<EditNote onUpdate={handleUpdate} />}
          />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}