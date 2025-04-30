import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { themeChange } from "theme-change";

export default function Navbar({ search, setSearch }) {
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  
  useEffect(() => {
    themeChange(false);
    
    const savedTheme = localStorage.getItem("theme");
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  
  const handleThemeChange = (e) => {
    const selectedTheme = e.target.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  
  const themes = [
           
    { name: "Emerald", value: "emerald" },
    { name: "Retro", value: "retro" },
    { name: "Valentine", value: "valentine" },
    { name: "Garden", value: "garden" },
    { name: "Forest", value: "forest" },
    { name: "Luxury", value: "luxury" },
    { name: "Dracula", value: "dracula" },
    { name: "Night", value: "night" },
    { name: "Coffee", value: "coffee" },
    { name: "Sunset", value: "sunset" },
    ];

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        <a
          className="btn btn-ghost text-xl text-base-content"
          onClick={() => navigate("/")}
        >
          My Notes
        </a>
      </div>
      <div className="navbar-center px-2 ml-2 md:ml-0 md:max-w-48">
        <div className="relative w-full max-w-40 md:max-w-48">
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
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="input input-bordered input-sm w-full pl-8"
            aria-label="Search notes"
          />
        </div>
      </div>
      <div className="navbar-end">
        <div className="flex gap-2 items-center">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-sm"
              aria-label="Select theme"
            >
              Looks
              <svg
                width="12px"
                height="12px"
                className="inline-block h-2 w-2 fill-current opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content bg-base-100 rounded-box z-[1] w-40 p-2 shadow-2xl"
            >
              {themes.map((theme) => (
                <li key={theme.value}>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                    aria-label={theme.name}
                    data-theme={theme.value}
                    onChange={handleThemeChange}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              aria-label="User menu"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
              <li>
                <a>Trash</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}