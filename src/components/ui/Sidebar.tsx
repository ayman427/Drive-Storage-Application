// src/components/ui/Sidebar.tsx
import { Link } from "react-router-dom";
import { Home, Folder } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 h-screen p-5">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/drive"
              className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition"
            >
              <Folder size={20} />
              <span>Drive</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
