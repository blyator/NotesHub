import toast from "react-hot-toast";

export default function DeletePopUp({ open, setOpen, noteId, onDelete }) {
  const handleDelete = () => {
    onDelete(noteId);
    setOpen(false);
    toast.success("It’s gone with the wind!🗑️", {
      className: "alert alert-success",
    });
  };

  return (
    <dialog id="delete_modal" className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box bg-base-100">
        <div className="flex items-start">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-error translate-x-1.5 translate-y-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M12 17h.01M12 3a9 9 0 110 18 9 9 0 010-18z"
                />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-base-content">
              Delete Note
            </h3>
            <p className="text-sm text-base-content/80">
              Are you sure you want to delete this note?
            </p>
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn btn-secondary text-secondary-content mr-4"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="btn btn-ghost text-base-content mr-2"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setOpen(false)}>close</button>
      </form>
    </dialog>
  );
}
