import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function EditNoteModal({
  selectedNoteId,
  setSelectedNoteId,
  handleUpdate,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedNoteId) {
      setLoading(true);
      fetch(`https://noteshub-ki3s.onrender.com/notes/${selectedNoteId}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title || "");
          setContent(
            data.items && data.items.length > 0 ? data.items.join("\n") : ""
          );
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed:", err);
          toast.error("Failed to load note", {
            className: "alert alert-error",
          });
          setLoading(false);
          setSelectedNoteId(null);
        });
    }
  }, [selectedNoteId]);

  const handleClose = () => {
    setSelectedNoteId(null);
    setTitle("");
    setContent("");
  };

  const handleSave = () => {
    const items = content
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const updatedNote = {
      title: title.trim(),
      items,
    };
    handleUpdate(selectedNoteId, updatedNote);
    handleClose();
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
    <dialog
      id="edit_modal"
      className={`modal ${selectedNoteId ? "modal-open" : ""}`}
    >
      <div className="modal-box bg-base-100 rounded-box shadow-2xl p-6 max-w-md">
        <h3 className="font-bold text-lg mb-4">Edit Note</h3>
        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-ring text-primary"></span>
          </div>
        ) : (
          <form>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text"></span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-ghost w-full"
                aria-label="Note title"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text"></span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea w-full h-32 border-none"
                placeholder="Enter notes"
                aria-label="Note content"
                rows="4"
              />
            </div>
            <div className="modal-action flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost text-base-content"
                onClick={handleClose}
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary text-primary-content"
                onClick={handleSave}
                aria-label="Save note"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
