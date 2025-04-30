import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SaveNotes({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Oops! Please add a Title 😅", {
        className: "alert alert-error",
      });
      return;
    }

    const items = content
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const newNote = { title, items };
    onCreate(newNote);
    setTitle("");
    setContent("");
    navigate("/", { replace: true });
  };

  const handleDiscard = () => {
    setTitle("");
    setContent("");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="card bg-base-100 shadow-md w-full max-w-md">
        <div className="card-body">
          <h3 className="card-title text-lg text-center">Save New</h3>
          <form onSubmit={handleSubmit} noValidate>
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="Enter notes"
                rows="4"
              />
            </div>
            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary text-primary-content">
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