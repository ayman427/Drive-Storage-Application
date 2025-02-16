import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync dark mode state with localStorage on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white shadow-md">
      <div className="flex justify-between items-center p-4">
        <Button onClick={toggleDrawer} className="text-black dark:text-white">
          <Menu className="w-6 h-6" />
        </Button>
        <div className="flex items-center space-x-4">
          <Button onClick={toggleTheme} className="text-black dark:text-white">
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </Button>
          <UserButton />
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={closeDrawer}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg transform transition-transform duration-300 z-20 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <Button onClick={closeDrawer} className="text-black dark:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>
        <nav className="flex flex-col space-y-5">
          <Link
            to="/"
            onClick={closeDrawer}
            className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white text-center"
          >
            HOME
          </Link>
          <Link
            to="/drive"
            onClick={closeDrawer}
            className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white text-center"
          >
            DRIVE
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
