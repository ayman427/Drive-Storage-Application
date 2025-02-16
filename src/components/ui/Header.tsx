import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="bg-gray-800 text-white">
      <div className="flex justify-between items-center p-4 shadow-md">
        <Button onClick={toggleDrawer} className="text-white">
          <Menu className="w-6 h-6" />
        </Button>
        <UserButton />
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
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 z-20 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <Button onClick={closeDrawer} className="text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>
        <nav className="flex flex-col space-y-4 p-4">
          <Link
            to="/"
            onClick={closeDrawer}
            className="text-gray-300 hover:text-white text-center"
          >
            Home
          </Link>
          <Link
            to="/drive"
            onClick={closeDrawer}
            className="text-gray-300 hover:text-white text-center"
          >
            Drive
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
