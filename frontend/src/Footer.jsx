import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function FooterCard() {
  return (
    <footer className="w-full bg-[#d1cfc0] text-white py-1 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-3 px-6">

        {/* Center Section - Name & Links */}
        <div className="flex flex-col items-center space-y-1">
          <p className="text-lg text-black font-bold">
            Made with <span className="text-red-500">♥</span> {" "}
            <span className="font-bold text-black
            ">| Badmosh Billa</span>
          </p>
          {/* <p className="text-sm text-black font-bold">Final Year CSE</p> */}

          {/* Social Links */}
          <div className="flex space-x-6 text-2xl mt-2 mb-2">
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
        </div>

      </div>
    </footer>
  );
}
