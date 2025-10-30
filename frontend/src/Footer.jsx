import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function FooterCard() {
  return (
    <footer className="w-full bg-[#d1cfc0] text-white py-3 sm:py-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-3 px-4 sm:px-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <p className="text-base sm:text-lg text-black font-bold">
            Made with <span className="text-red-500">♥</span>{" "}
            <span className="font-bold text-black">| Badmosh Billa</span>
          </p>

          {/* Social Links */}
          <div className="flex space-x-4 sm:space-x-6 text-xl sm:text-2xl mt-2 mb-2">
            <a
              href="https://github.com/PramodAdhav"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/justlikepramod"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
