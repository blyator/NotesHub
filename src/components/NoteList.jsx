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
        <div className="flex items-center justify-center h-[60vh] text-base-content/80 text-center">
          🗃️ No notes yet..
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
    bottom-8 right-8 
    md:bottom-10 md:right-10 
    lg:bottom-[138.5px] lg:right-[37px] 
    btn btn-xl lg:btn-lg 
    btn-circle bg-primary text-primary-content border-2 border-primary shadow-lg 
    hover:bg-primary-focus z-50 transition-transform hover:scale-110 hover:rotate-90 animate-fadeInUp"
        aria-label="Add new note"
        onClick={handleAddNote}
      >
        <svg
          className="w-7 h-7 md:w-8 md:h-8 lg:w-6 lg:h-6"
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
