import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

export default function SaveNotes() {
  const { handleCreate } = useContext(NotesContext);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.custom(
        <div role="alert" className="alert alert-warning alert-soft">
          <span>Please add a Title</span>
        </div>
      );
      return;
    }

    const notes = content
      .split("\n")
      .map((note) => note.trim())
      .filter((note) => note !== "");

    const newNote = { title, notes };

    toast
      .promise(
        handleCreate(newNote),
        {
          loading: "saving...",
          success: <b>Note saved!</b>,
          error: <b>Failed to create note.</b>,
        },
        {
          style: {
            borderRadius: "10px",
            background: "#5C3A21",
            color: "#fff",
          },
          duration: 2000,
        }
      )
      .then(() => {
        setTitle("");
        setContent("");
        navigate("/notes", { replace: true });
      });
  };

  const handleDiscard = () => {
    setTitle("");
    setContent("");
    navigate("/notes", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="card bg-base-100 shadow-md w-full max-w-md">
        <div className="card-body">
          <h3 className="card-title text-lg text-center">Save New</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-control mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-ghost w-full"
                required
                placeholder="Title"
              />
            </div>
            <div className="form-control mb-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea w-full border-none"
                placeholder="Enter notes"
                rows="4"
              />
            </div>
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary text-primary-content"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary text-secondary-content"
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
