import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#1C1C1C] backdrop-blur-lg border-b border-[#333333] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <Brain className="w-8 h-8 text-[#C08457] group-hover:scale-110 transition-transform duration-300" />

            <span className="text-xl font-bold text-[#EAEAEA]">
              OpsMind AI
            </span>
          </Link>

          {/* Menu */}
          <div className="flex items-center space-x-6">

            <Link
              to="/query"
              className="text-gray-300 hover:text-[#C08457] transition duration-300 text-sm font-medium"
            >
              Ask Question
            </Link>

            <Link
              to="/admin"
              className="bg-[#C08457] text-black px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:opacity-90 hover:scale-105 transition transform"
            >
              Admin
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
}