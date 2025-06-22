import { useState, useEffect, useContext } from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import DeletePopUp from "../components/DeletePopUp";
import { NotesContext } from "../context/NotesContext";

export default function Note({
  note,
  activeNoteId,
  setActiveNoteId,
  setSelectedNoteId,
}) {
  const { handleDelete } = useContext(NotesContext);
  const [open, setOpen] = useState(false);
  const isMobile = window.innerWidth < 768;
  const isActive = activeNoteId === note.id;

  const handleTouchStart = (e) => {
    if (isMobile) {
      e.stopPropagation();
      setActiveNoteId(note.id);
    }
  };

  useEffect(() => {
    let timer;
    if (isMobile && isActive) {
      timer = setTimeout(() => {
        setActiveNoteId(null);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isMobile, isActive, setActiveNoteId, note.id]);

  const handleCardClick = (e) => {
    const selection = window.getSelection();
    if (selection.toString().trim() !== "") return;

    if (!isMobile || !isActive) {
      setSelectedNoteId(note.id);
    }
  };

  const handleDeleteClick = () => {
    setOpen(true);
  };

  const getFormattedDate = () => {
    const date = note.updated_at || note.created_at;
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "Unknown Date";
      return parsedDate.toLocaleDateString("en-UK", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown Date";
    }
  };

  const hasBeenEdited =
    note.updated_at &&
    note.created_at &&
    new Date(note.updated_at) > new Date(note.created_at);
  const dateLabel = hasBeenEdited ? "Edited" : "Created";
  const displayDate = getFormattedDate();

  return (
    <>
      <div
        className="card bg-base-100 shadow-md w-full hover:bg-base-200 group cursor-pointer"
        onClick={handleCardClick}
        onTouchStart={handleTouchStart}
        role="button"
        aria-label={`Edit note: ${note.title}`}
      >
        <div className="card-body p-4">
          <h2 className="card-title text-xl text-base-content">{note.title}</h2>
          <ul className="list-disc list-inside mt-2">
            {Array.isArray(note.notes) &&
              note.notes.map((item, index) => (
                <li key={index} className="text-base-content/80">
                  {item}
                </li>
              ))}
          </ul>
        </div>

        <div
          className={`card-footer bg-primary/50 flex items-center justify-end gap-2 p-2 rounded-b-lg transition-opacity duration-200 ${
            isMobile
              ? isActive
                ? "opacity-100"
                : "opacity-0"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span className="text-xs text-primary-content">
            {dateLabel}: {displayDate}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNoteId(note.id);
            }}
            aria-label="Edit note"
          >
            <PencilSquareIcon className="w-4 h-4 fill-primary-content" />
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
            <TrashIcon className="w-4 h-4 fill-secondary-content" />
          </button>
        </div>
      </div>

      <DeletePopUp
        open={open}
        setOpen={setOpen}
        noteId={note.id}
        onDelete={handleDelete}
      />
    </>
  );
}
