import { useState, useEffect, useContext } from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import DeletePopUp from "../components/DeletePopUp";
import { NotesContext } from "../context/NotesContext";

const badgeColors = ["badge-primary", "badge-accent", "badge-error"];

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

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const getFormattedDate = () => {
    const date = note.updated_at || note.created_at;
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "Unknown Date";
      return parsedDate.toLocaleDateString("en-UK", {
        month: "short",
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
        className="card bg-base-100 shadow-md w-full hover:bg-base-200 group cursor-pointer transition-all duration-200"
        onClick={handleCardClick}
        onTouchStart={handleTouchStart}
        role="button"
        aria-label={`Edit note: ${note.title}`}
      >
        <div className="card-body p-4">
          <h2 className="card-title text-lg text-base-content line-clamp-1">
            {note.title}
          </h2>
          <ul className="list-disc list-inside mt-1 space-y-1">
            {Array.isArray(note.notes)
              ? note.notes.slice(0, 3).map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-base-content/80 line-clamp-1"
                  >
                    {item}
                  </li>
                ))
              : null}
            {note.notes?.length > 3 && (
              <li className="text-xs text-base-content/60">
                +{note.notes.length - 3} more
              </li>
            )}
          </ul>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <span
                key={tag.id || tag.name}
                className={`badge badge-sm ${
                  badgeColors[index % badgeColors.length]
                } text-white font-medium`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div
          className={`card-footer bg-primary/5 flex items-center justify-between p-2 rounded-b-lg transition-opacity duration-200 ${
            isMobile
              ? isActive
                ? "opacity-100"
                : "opacity-0"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span className="text-xs text-base-content/70">
            {dateLabel} {displayDate}
          </span>
          <div className="flex gap-1">
            <button
              className="btn btn-ghost btn-xs px-2"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNoteId(note.id);
              }}
              aria-label="Edit note"
            >
              <PencilSquareIcon className="w-3.5 h-3.5" />
            </button>
            <button
              className="btn btn-ghost btn-xs px-2 text-error/80 hover:text-error"
              type="button"
              onClick={handleDeleteClick}
              aria-label="Delete note"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
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
