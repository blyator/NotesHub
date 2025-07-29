import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Edit3,
  Palette,
  User,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    themes: false,
    login: false,
    start: false,
  });

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

  const handleThemeChange = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setDropdowns({ ...dropdowns, themes: false });
    setIsMenuOpen(false);
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => ({
      themes: false,
      login: false,
      start: false,
      [dropdown]: !prev[dropdown],
    }));
  };

  return (
    <nav className="navbar fixed top-0 w-full bg-base-100/80 backdrop-blur-md border-b border-base-200/50 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-4xl font-bold text-primary">NotesHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-3 dropdown-container">
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("themes")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-base-200 btn btn-soft btn-error hover:border-base-300 hover:bg-base-200 transition-all duration-200"
                >
                  <Palette className="w-4 h-4 text-base-content" />
                  <span className="text-base-content font-medium">Themes</span>
                  <ChevronDown
                    className={`w-4 h-4 text-base-content transition-transform duration-200 ${
                      dropdowns.themes ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdowns.themes && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-200 py-2 z-50">
                    {themes.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => handleThemeChange(theme.value)}
                        className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-base-200 transition-colors"
                      >
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <span className="text-base-content">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/login"
                className="btn btn-primary flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Login
              </Link>

              <Link
                to="/signup"
                className="btn btn-secondary flex items-center"
              >
                Start
                <ArrowRight className="w-4 h-4 mr-1" />
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Theme Button */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("themes")}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-base-200 transition-colors"
              >
                <Palette className="w-5 h-5 text-base-content" />
              </button>

              {dropdowns.themes && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-200 py-2 z-50">
                  {themes.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => handleThemeChange(theme.value)}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-base-200 transition-colors"
                    >
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                      <span className="text-base-content">{theme.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-base-200 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full right-4 mt-2 w-64 bg-base-100 rounded-xl shadow-lg border border-base-200 z-40">
          <div className="flex flex-col space-y-4 p-4">
            <Link
              to="/login"
              className="block text-xl font-medium text-base-content hover:text-primary py-3 px-4 rounded-lg hover:bg-base-200 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block text-xl font-medium text-base-content hover:text-primary py-3 px-4 rounded-lg hover:bg-base-200 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
