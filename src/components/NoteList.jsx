import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Note from "./Note.jsx";

export default function NoteList({
  notes,
  onDelete,
  setSelectedNoteId,
  handleUpdate,
}) {
  const navigate = useNavigate();
  const [activeNoteId, setActiveNoteId] = useState(null);

  const handleAddNote = () => {
    navigate("/save");
  };

  return (
    <div className="mt-4 relative">
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}
      </style>
      {notes.length === 0 ? (
        <p className="text-base-content/80">🗃️ No notes yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="flex-grow">
              <Note
                note={note}
                onDelete={onDelete}
                setSelectedNoteId={setSelectedNoteId}
                handleUpdate={handleUpdate}
                activeNoteId={activeNoteId}
                setActiveNoteId={setActiveNoteId}
              />
            </div>
          ))}
        </div>
      )}

      <button
        className="
    fixed 
    bottom-14 right-12 
    md:bottom-16 md:right-8 
    lg:bottom-[138.5px] lg:right-[37px] 
    btn btn-lg md:btn-lg lg:btn-lg 
    btn-circle bg-primary text-primary-content border-2 border-primary shadow-lg 
    hover:bg-primary-focus z-50 transition-transform hover:scale-110 hover:rotate-90 animate-fadeInUp"
        aria-label="Add new note"
        onClick={handleAddNote}
      >
        <svg
          className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
