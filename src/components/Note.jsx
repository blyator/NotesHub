import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import DeletePopUp from "./DeletePopUp.jsx";

export default function Note({
  note,
  onDelete,
  setSelectedNoteId,
  handleUpdate,
}) {
  const [open, setOpen] = useState(false);

  const handleCardClick = (e) => {
    const selection = window.getSelection();
    if (selection.toString().trim() !== "") {
      return;
    }
    setSelectedNoteId(note.id);
  };

  const handleDeleteClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div
        className="card bg-base-100 shadow-md p-4 w-full hover:bg-base-200 group cursor-pointer"
        onClick={handleCardClick}
        role="button"
        aria-label={`Edit note: ${note.title}`}
      >
        <div className="card-body">
          <h2 className="card-title text-xl text-base-content">{note.title}</h2>
          <ul className="list-disc list-inside mt-2">
            {note.items.map((item, index) => (
              <li key={index} className="text-base-content/80">
                {item}
              </li>
            ))}
          </ul>
          <div className="card-actions justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNoteId(note.id);
              }}
              aria-label="Edit note"
            >
              <PencilIcon className="w-5 h-5 fill-primary" />
            </button>
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              aria-label="Delete note"
            >
              <TrashIcon className="w-5 h-5 fill-secondary" />
            </button>
          </div>
        </div>
      </div>
      <DeletePopUp
        open={open}
        setOpen={setOpen}
        noteId={note.id}
        onDelete={onDelete}
      />
    </>
  );
}
