import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { themeChange } from "theme-change";
import { UserContext } from "../context/UserContext";
import { NotesContext } from "../context/NotesContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout_user, currentUser } = useContext(UserContext);
  const { search, setSearch } = useContext(NotesContext);

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
    { name: "Autumn", value: "autumn" },
    { name: "Retro", value: "retro" },
    { name: "Forest", value: "forest" },
    { name: "Sunset", value: "sunset" },
    { name: "Olive", value: "dim" },
    { name: "Coffee", value: "coffee" },
    { name: "Night", value: "night" },
    { name: "Dracula", value: "dracula" },
  ];

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 p-0">
      <div className="navbar-start ml-6">
        <a
          className="text-base sm:text-xl text-primary-content bg-primary px-2 sm:px-4 py-1 sm:py-2 rounded-2xl sm:rounded-3xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          Hello, {currentUser?.name?.split(" ")[0]}
        </a>
      </div>
      {location.pathname !== "/profile" && (
        <div className="navbar-center px-2 ml-0 md:ml-8 max-w-32 md:max-w-80 lg:max-w-96">
          <div className="relative w-full">
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
              placeholder="Search ..."
              value={search}
              onChange={handleSearchChange}
              className="input input-ghost input-sm w-full pl-8"
              aria-label="Search notes"
            />
          </div>
        </div>
      )}
      <div className="navbar-end mr-4">
        <div className="flex gap-2 items-center">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-xs bg-primary rounded-2xl text-primary-content"
              aria-label="Select theme"
            >
              Theme
              <svg
                width="10px"
                height="10px"
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
              <div className="w-10 rounded-full border-2 border-primary">
                <img
                  alt="User avatar"
                  src="https://i.pinimg.com/736x/f1/54/da/f154da6a5577947ab19cf2766830ba9e.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-42 p-2 shadow"
            >
              <li>
                <a
                  onClick={() => navigate("/profile")}
                  className="justify-between"
                >
                  Profile
                </a>
              </li>
              <li>
                <a>Trash</a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    logout_user();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
