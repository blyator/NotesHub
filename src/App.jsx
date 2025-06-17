import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // Layout includes Navbar + Footer
import NoteList from "./pages/NoteList.jsx";
import SaveNotes from "./pages/SaveNotes.jsx";
import EditNoteModal from "./pages/EditNoteModal.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);

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
        setNotes((prevNotes) => [createdNote, ...prevNotes]);
        toast.custom(
          <div role="alert" class="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Done! Note saved </span>
          </div>
        );
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
        setNotes((prevNotes) => {
          const filteredNotes = prevNotes.filter((note) => note.id !== id);
          return [updatedNote, ...filteredNotes];
        });

        toast.custom(
          <div role="alert" className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Update successful</span>
          </div>
        );
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
    <div className="w-full mx-0 lg:max-w-none min-h-screen flex flex-col bg-base-100">
      <Toaster
        position="top-center"
        reverseOrder={true}
        gutter={8}
        toastOptions={{
          duration: 1000,
          removeDelay: 1000,
        }}
      />
      <Routes>
        {/* Landing has no layout (no navbar/footer) */}
        <Route path="/" element={<Landing />} />

        {/* Other pages wrapped in Layout */}
        <Route element={<Layout search={search} setSearch={setSearch} />}>
          <Route
            path="/notes"
            element={
              <NoteList
                notes={filteredNotes}
                onDelete={handleDelete}
                setSelectedNoteId={setSelectedNoteId}
                handleUpdate={handleUpdate}
              />
            }
          />
          <Route path="/save" element={<SaveNotes onCreate={handleCreate} />} />
        </Route>
      </Routes>

      {/* Always rendered */}
      <EditNoteModal
        selectedNoteId={selectedNoteId}
        setSelectedNoteId={setSelectedNoteId}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}
