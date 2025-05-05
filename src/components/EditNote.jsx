import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditNote({ onUpdate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`https://noteshub-ki3s.onrender.com/notes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "");
        setContent(
          data.items && data.items.length > 0 ? data.items.join("\n") : ""
        );
      })
      .catch((err) => console.error("Failed:", err));
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const items = content
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const updatedNote = { title, items };
    onUpdate(id, updatedNote);
    navigate("/", { replace: true });
  };

  const handleDiscard = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="card bg-base-100 shadow-md w-full max-w-md">
        <div className="card-body">
          <h3 className="card-title text-lg text-center">Edit Note</h3>
          <form noValidate onSubmit={handleSubmit}>
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea w-full border-none"
                placeholder="Enter note content"
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
