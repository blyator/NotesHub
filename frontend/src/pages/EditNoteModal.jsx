import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { NotesContext } from "../context/NotesContext";

export default function EditNoteModal({ selectedNoteId, setSelectedNoteId }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleUpdate } = useContext(NotesContext);

  const API_BASE_URL = "http://127.0.0.1:5000";

  useEffect(() => {
    if (selectedNoteId) {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      fetch(`${API_BASE_URL}/notes/${selectedNoteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load note");
          return res.json();
        })
        .then((data) => {
          setTitle(data.title || "");
          setNotes(
            Array.isArray(data.notes) ? data.notes.join("\n") : data.notes || ""
          );
          setLoading(false);
        })
        .catch((err) => {
          toast.error(`Failed to load note: ${err.message}`);
          setLoading(false);
          setSelectedNoteId(null);
        });
    }
  }, [selectedNoteId, setSelectedNoteId]);

  const handleClose = () => {
    setSelectedNoteId(null);
    setTitle("");
    setNotes("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const notesArray = notes.split("\n");
      await handleUpdate(selectedNoteId, {
        title: title.trim(),
        notes: notesArray,
      });
      toast.success("Note saved successfully");
      handleClose();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(`Failed to save note: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!selectedNoteId) return null;

  return (
    <div className={`modal ${selectedNoteId ? "modal-open" : ""}`}>
      <div className="modal-box bg-base-100 rounded-box shadow-2xl p-6 max-w-md">
        <h3 className="font-bold text-lg mb-4">Edit Note</h3>
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-ring text-primary"></span>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Notes</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="textarea textarea-bordered w-full h-32"
                rows="4"
              />
            </div>
            <div className="modal-action flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="modal-backdrop" onClick={handleClose} />
    </div>
  );
}
