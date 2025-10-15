import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="left-10 w-full bg-[#d1cfc0] text-white">
      <div className="relative flex items-center justify-between px-15 py-4">
        {/* Title */}
        <h1 className="instrument-serif-regular text-4xl font-bold text-[black]">Pennywise</h1>

        {/* Nav links centered */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 space-x-25 text-2xl text-[black] font-bold instrument-serif-regular">
          <Link to="/" className="hover:text-black-400 hover:font-bold">Home</Link>
          <Link to="/Track" className="hover:text-black-400 hover:font-bold">Track</Link>
          <Link to="/History" className="hover:text-black-400 hover:font-bold">History</Link>
          <Link to="/Insights" className="hover:text-black-400 hover:font-bold">Insights</Link>
          <Link to="/Calendar" className="hover:text-black-400 hover:font-bold ">Calendar</Link>
        </nav>
      </div>
    </header>
  );
}
