import React from "react";

export default function SearchStuff({ search, setSearch }) {
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="relative w-full sm:w-40">
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
        <svg
          className="w-3.5 h-3.5 text-base-content/50"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={search}
        onChange={handleInputChange}
        className="input input-bordered input-sm w-full pl-8"
        placeholder="Search..."
        aria-label="Search notes"
      />
    </div>
  );
}