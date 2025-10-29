import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/TextAnimation";
import { Link } from "react-router-dom";
import FooterCard from "../Footer";
import { Button } from "../components/ui/TrackButton";

export default function Home() {
  // Animation variants
  const leftCard = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };
  const centerCard = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  const rightCard = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-[#d1cfc0] text-white pt-9 px-4 sm:px-8 flex flex-col items-center">
      {/* Title */}
      <h1 className="instrument-serif-regular-italic text-4xl sm:text-7xl font-bold mb-6 -mt-6 sm:-mt-10 text-black text-center leading-snug">
        <TextGenerateEffect
          words="Find peace in tracking daily expenses"
          duration={0.3}
          staggerDelay={0.1}
          filter={true}
        />
      </h1>

      {/* Subtitle */}
      <div className="instrument-serif-regular-italic text-2xl sm:text-4xl text-black text-center px-2">
        <TextGenerateEffect
          words="Track, Visualize and much more..."
          duration={0.3}
          staggerDelay={0.1}
          filter={true}
        />
      </div>

      {/* Button */}
      <Link to="/Track">
        <Button className="w-36 sm:w-40 text-black instrument-serif-regular text-lg sm:text-xl mt-8 sm:mt-9 cursor-default hover:cursor-pointer">
          Start Tracking
        </Button>
      </Link>

      {/* Cards animation */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-12 sm:mt-16 max-w-6xl px-2">
        <motion.div
          className="bg-transparent text-black rounded-lg shadow-md border border-black p-5 sm:p-6 text-center w-72 sm:w-80 h-60 sm:h-64 flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={leftCard}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            Easy Expense Logging
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Quickly record your daily expenses with just a few taps.
          </p>
        </motion.div>

        <motion.div
          className="bg-transparent text-black rounded-lg border border-black shadow-md p-5 sm:p-6 text-center w-72 sm:w-80 h-60 sm:h-64 flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={centerCard}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Visual Insights</h3>
          <p className="text-gray-700 text-sm sm:text-base">
            View charts and graphs to understand your spending habits.
          </p>
        </motion.div>

        <motion.div
          className="bg-transparent border border-black text-black rounded-lg shadow-md p-5 sm:p-6 text-center w-72 sm:w-80 h-60 sm:h-64 flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={rightCard}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Smart Tracking</h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Categorize and analyze expenses to manage your budget better.
          </p>
        </motion.div>
      </div>

      <FooterCard />
    </div>
  );
}
