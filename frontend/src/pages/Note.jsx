import { useState, useEffect, useContext } from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import DeletePopUp from "../components/DeletePopUp";
import { NotesContext } from "../context/NotesContext";

const badgeColors = ["badge-primary", "badge-accent", "badge-error"];

const cardStyles = [
  { bg: "bg-primary/10", border: "border-primary" },
  { bg: "bg-secondary/10", border: "border-secondary" },
  { bg: "bg-accent/10", border: "border-accent" },
  { bg: "bg-warning/10", border: "border-warning" },
  { bg: "bg-info/10", border: "border-info" },
  { bg: "bg-success/10", border: "border-success" },
  { bg: "bg-error/10", border: "border-error" },
];

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

  const getCardStyle = () => {
    const hash = note.id
      .toString()
      .split("")
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    const index = Math.abs(hash) % cardStyles.length;
    return cardStyles[index];
  };

  const cardStyle = getCardStyle();

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
        className={`${cardStyle.bg} p-4 rounded-lg border-l-4 ${cardStyle.border} hover:bg-opacity-80 group cursor-pointer transition-all duration-200 shadow-md`}
        onClick={handleCardClick}
        onTouchStart={handleTouchStart}
        role="button"
        aria-label={`Edit note: ${note.title}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-base-content line-clamp-1 mb-1">
              {note.title}
            </h4>
            <div className="mt-1">
              {Array.isArray(note.notes) && note.notes.length > 0 ? (
                <div className="space-y-1">
                  {note.notes.slice(0, 2).map((item, noteIndex) => (
                    <p
                      key={noteIndex}
                      className="text-sm text-base-content/60 line-clamp-1"
                    >
                      {item}
                    </p>
                  ))}
                  {note.notes.length > 2 && (
                    <p className="text-xs text-base-content/50">
                      +{note.notes.length - 2} more items...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-base-content/60">No notes yet...</p>
              )}
            </div>
          </div>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
            {note.tags.map((tag, tagIndex) => (
              <span
                key={tag.id || tag.name}
                className={`badge badge-sm ${
                  badgeColors[tagIndex % badgeColors.length]
                }`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div
          className={`flex items-center justify-between mt-3 pt-2 border-t border-base-content/10 transition-opacity duration-200 ${
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
