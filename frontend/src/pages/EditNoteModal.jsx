import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { NotesContext } from "../context/NotesContext";
import { TagsContext } from "../context/TagsContext";

const badgeColors = [
  "badge-primary",
  "badge-secondary",
  "badge-accent",
  "badge-info",
  "badge-success",
  "badge-warning",
  "badge-error",
];

function getRandomBadgeClass(name) {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return badgeColors[hash % badgeColors.length];
}

export default function EditNoteModal({ selectedNoteId, setSelectedNoteId }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [initialTagIds, setInitialTagIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const { handleUpdate, fetchNotes } = useContext(NotesContext);
  const { tags, fetchTags, createTag, addTagToNote, removeTagFromNote } =
    useContext(TagsContext);

  const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchTags();
  }, []);

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
          setTagInput(data.tags?.map((t) => t.name).join(", ") || "");
          setInitialTagIds(data.tags?.map((t) => t.id) || []);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(`Failed to load note: ${err.message}`);
          setLoading(false);
          setSelectedNoteId(null);
        });
    }
  }, [selectedNoteId]);

  const handleClose = () => {
    setSelectedNoteId(null);
    setTitle("");
    setNotes("");
    setTagInput("");
    setInitialTagIds([]);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);

      // Update note content
      const notesArray = notes.split("\n");
      await handleUpdate(selectedNoteId, {
        title: title.trim(),
        notes: notesArray,
      });

      // Process tags
      const trimmedTags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const currentTagObjs = tags.filter((tag) =>
        trimmedTags.includes(tag.name)
      );

      // Add new tags not in global list
      const newTagPromises = trimmedTags
        .filter((name) => !tags.find((t) => t.name === name))
        .map((name) => createTag(name));
      const newTags = await Promise.all(newTagPromises);

      const finalTagObjs = [...currentTagObjs, ...newTags];
      const finalTagIds = finalTagObjs.map((tag) => tag.id);

      // Sync tags (add missing, remove removed)
      const toAdd = finalTagIds.filter((id) => !initialTagIds.includes(id));
      const toRemove = initialTagIds.filter((id) => !finalTagIds.includes(id));

      await Promise.all([
        ...toAdd.map((id) => addTagToNote(selectedNoteId, id)),
        ...toRemove.map((id) => removeTagFromNote(selectedNoteId, id)),
      ]);

      fetchNotes(); // Refresh notes list
      toast.success("Note updated");
      handleClose();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(`Failed to save note`);
    } finally {
      setLoading(false);
    }
  };

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
                className="input input-ghost w-full"
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
                className="textarea textarea-ghost w-full h-32"
                rows="4"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Tags</span>
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="input input-ghost w-full"
                placeholder="e.g. react, python"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {tagInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t)
                  .map((name) => (
                    <span
                      key={name}
                      className={`badge badge-sm ${getRandomBadgeClass(
                        name
                      )} text-white`}
                    >
                      {name}
                    </span>
                  ))}
              </div>
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
