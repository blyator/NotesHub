import Note from "./Note.jsx";

export default function NoteList({ notes, onDelete, setSelectedNoteId, handleUpdate }) {
  return (
    <div className="mt-4">
      {notes.length === 0 ? (
        <p className="text-base-content/80">🗃️ No notes yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="flex-grow">
              <Note
                note={note}
                onDelete={onDelete}
                setSelectedNoteId={setSelectedNoteId}
                handleUpdate={handleUpdate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}