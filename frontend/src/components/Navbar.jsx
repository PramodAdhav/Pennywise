import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/"); // redirect to signup/login page
  };

  return (
    <header className="w-full bg-[#d1cfc0] text-white">
      <div className="relative flex items-center justify-between px-8 py-10">
        {/* Title */}
        <h1 className="instrument-serif-regular text-4xl px-2 font-bold text-[black]">
          Pennywise
        </h1>

        {/* Nav links centered */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-12 text-3xl text-[black] font-bold instrument-serif-regular">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black-400"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/track"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black-400"
            }
          >
            Track
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black-400"
            }
          >
            History
          </NavLink>
          <NavLink
            to="/insights"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black-400"
            }
          >
            Insights
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              isActive ? "font-bold text-black" : "hover:text-black-400"
            }
          >
            Calendar
          </NavLink>
        </nav>

        {/* Logout button on the right */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
