import { useState, useContext, useEffect } from "react";
import { NotesContext } from "../context/NotesContext";
import WelcomeMsg from "../components/WelcomeMsg.jsx";
import { CircleX } from "lucide-react";
import SaveNotes from "../pages/SaveNotes.jsx";
import Note from "../pages/Note.jsx";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";

export default function NoteList({ setSelectedNoteId }) {
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const { filteredNotes, handleDelete, handleUpdate, search } =
    useContext(NotesContext);

  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.is_admin) {
      navigate("/admin", { replace: true });
    }
  }, [currentUser, navigate]);

  if (currentUser?.is_admin) {
    return null;
  }

  const handleAddNote = () => {
    setShowSaveModal(true);
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
      <WelcomeMsg />

      {filteredNotes && filteredNotes.length === 0 ? (
        search.trim() !== "" ? (
          <div className="flex items-center justify-center h-[60vh] text-warning text-center">
            <CircleX
              size={20}
              color="#535027"
              strokeWidth={2.25}
              className="mr-2"
            />
            Nope, we couldn't find a match.
          </div>
        ) : (
          <div className="flex items-center justify-center h-[60vh] text-base-content/80 text-center">
            🗃️ Add notes..
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredNotes &&
            filteredNotes.map((note) => (
              <div key={note.id} className="flex-grow">
                <Note
                  note={note}
                  onDelete={handleDelete}
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

      {showSaveModal && <SaveNotes setShowSaveModal={setShowSaveModal} />}
    </div>
  );
}
