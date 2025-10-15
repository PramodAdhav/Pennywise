// components/FooterCard.jsx
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function FooterCard() {
  return (
    <div className="bg-[#1f1f1f] text-white rounded-lg p-6 max-w-xs mx-auto flex flex-col items-center space-y-4 shadow-lg mt-10">

      {/* Info */}
      <div className="flex flex-col items-center space-y-1">
        <h2 className="text-xl font-bold">Pramod Adhav</h2>
        <p className="text-gray-400 text-sm">Final Year CSE</p>
      </div>

      {/* Links */}
      <div className="flex space-x-6 text-xl">
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors"
        >
          <FaLinkedin />
        </a>
      </div>

      {/* Tech stack */}
      <p className="text-gray-500 text-sm mt-2 text-center">
        Built with React, TailwindCSS, Vite, and FullCalendar
      </p>
    </div>
  );
}
