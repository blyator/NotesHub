import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { NotesContext } from "../context/NotesContext";
import { TagsContext } from "../context/TagsContext";
import { UserContext } from "../context/UserContext.jsx";

const badgeColors = ["badge-success", "badge-warning", "badge-error"];

export default function SaveNotes({ setShowSaveModal }) {
  const { handleCreate } = useContext(NotesContext);
  const { tags, fetchTags, createTag } = useContext(TagsContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [inputTagNames, setInputTagNames] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (currentUser?.is_admin) {
      navigate("/admin", { replace: true });
    }
  }, [currentUser, navigate]);

  if (currentUser?.is_admin) {
    return null;
  }

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Please add a Title");
      return;
    }

    const notes = content
      .split("\n")
      .map((note) => note.trim())
      .filter((note) => note !== "");

    const inputTags = newTagName
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const matchingTags = tags.filter((tag) => inputTags.includes(tag.name));
    let finalTagIds = matchingTags.map((tag) => tag.id);

    const newTagsToCreate = inputTags.filter(
      (tag) => !tags.some((existing) => existing.name === tag)
    );

    if (newTagsToCreate.length > 0) {
      for (const tagName of newTagsToCreate) {
        try {
          const createdTag = await createTag(tagName);
          finalTagIds.push(createdTag.id);
        } catch (error) {
          console.error(`Failed to create tag "${tagName}":`, error);
        }
      }
    }

    const newNote = { title, notes, tag_ids: finalTagIds };

    toast
      .promise(handleCreate(newNote), {
        loading: "Saving..",
        success: <b>saved!</b>,
        error: <b>Failed to create note.</b>,
      })
      .then(() => {
        setTitle("");
        setContent("");
        setSelectedTags([]);
        setNewTagName("");
        setInputTagNames([]);
        setShowSaveModal(false);
        navigate("/notes", { replace: true });
      });
  };

  const handleTagInputChange = (e) => {
    const rawInput = e.target.value;
    setNewTagName(rawInput);

    const inputTags = rawInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    setInputTagNames(inputTags);
  };

  const handleDiscard = () => {
    setTitle("");
    setContent("");
    setSelectedTags([]);
    setNewTagName("");
    setInputTagNames([]);
    setShowSaveModal(false);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100 rounded-box shadow-2xl p-6 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">New Note</h3>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-control mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-ghost w-full"
              required
              placeholder="Title*"
            />
          </div>
          <div className="form-control mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea textarea-ghost w-full h-32"
              placeholder="Enter notes"
            />
          </div>

          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text">You can add Tags</span>
            </label>
            <input
              type="text"
              value={newTagName}
              onChange={handleTagInputChange}
              className="input input-ghost w-full"
              placeholder="Just separate with commas"
            />
          </div>

          {inputTagNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {inputTagNames.map((tag, index) => (
                <span
                  key={tag}
                  className={`badge badge-sm ${
                    badgeColors[index % badgeColors.length]
                  } text-white`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="modal-action flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleDiscard}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={handleDiscard}></div>
    </div>
  );
}
