import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full bg-[#d1cfc0] text-white">
      <div className="relative flex items-center justify-between px-4 sm:px-6 md:px-8 py-6 md:py-10">
        {/* Title */}
        <h1 className="instrument-serif-regular text-3xl sm:text-4xl px-2 font-bold text-black">
          Pennywise
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8 lg:space-x-12 text-xl lg:text-3xl text-black font-bold instrument-serif-regular">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/track"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black"
            }
          >
            Track
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black"
            }
          >
            History
          </NavLink>

          <NavLink
            to="/insights"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black"
            }
          >
            Insights
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black"
            }
          >
            Calendar
          </NavLink>

          <NavLink
            to="/debt-lend"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black"
            }
          >
            Debt/Lend
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="hidden md:block bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 pb-6 text-lg font-semibold text-black bg-[#d1cfc0] border-t border-gray-300">
          <NavLink to="/home" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/track" onClick={() => setMenuOpen(false)}>
            Track
          </NavLink>
          <NavLink to="/history" onClick={() => setMenuOpen(false)}>
            History
          </NavLink>
          <NavLink to="/insights" onClick={() => setMenuOpen(false)}>
            Insights
          </NavLink>
          <NavLink to="/calendar" onClick={() => setMenuOpen(false)}>
            Calendar
          </NavLink>
          <NavLink to="/debt-lend" onClick={() => setMenuOpen(false)}>
            Debt/Lend
          </NavLink>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
