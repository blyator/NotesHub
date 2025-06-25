import { useState, useContext } from "react";
import { TagsContext } from "../context/TagsContext";

export default function NoteTags({ note }) {
  const { tags, addTagToNote, removeTagFromNote, createTag } =
    useContext(TagsContext);
  const [newTagName, setNewTagName] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const availableTags = tags.filter(
    (tag) => !note.tags.some((noteTag) => noteTag.id === tag.id)
  );

  const handleAddTag = (tagId) => {
    addTagToNote(note.id, tagId);
  };

  const handleRemoveTag = (tagId) => {
    removeTagFromNote(note.id, tagId);
  };

  const handleCreateAndAddTag = () => {
    if (!newTagName.trim()) return;

    createTag(newTagName).then((createdTag) => {
      addTagToNote(note.id, createdTag.id);
      setNewTagName("");
      setShowTagInput(false);
    });
  };

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1">
        {note.tags.map((tag) => (
          <span
            key={tag.id}
            className="badge badge-primary cursor-pointer"
            onClick={() => handleRemoveTag(tag.id)}
          >
            {tag.name} ×
          </span>
        ))}

        {availableTags.length > 0 && (
          <select
            className="select select-xs"
            onChange={(e) => {
              if (e.target.value) {
                handleAddTag(e.target.value);
                e.target.value = "";
              }
            }}
          >
            <option value="">Add tag...</option>
            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        )}

        <button
          className="btn btn-xs"
          onClick={() => setShowTagInput(!showTagInput)}
        >
          {showTagInput ? "Cancel" : "+ New"}
        </button>
      </div>

      {showTagInput && (
        <div className="flex gap-1 mt-1">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="input input-xs"
            placeholder="New tag name"
          />
          <button
            className="btn btn-xs btn-primary"
            onClick={handleCreateAndAddTag}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
