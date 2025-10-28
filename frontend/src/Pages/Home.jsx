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
    <div className="min-h-screen bg-[#d1cfc0] text-white pt-09 px-8 flex flex-col items-center">
      <h1 className="instrument-serif-regular-italic text-7xl font-bold mb-6 text-black text-center">
        <TextGenerateEffect
          words="Find peace in tracking daily expenses"
          duration={0.3}
          staggerDelay={0.1}
          filter={true}
        />
      </h1>

      <p className="instrument-serif-regular-italic text-4xl text-black text-center">
        <TextGenerateEffect
          words="Track, Visualize and much more..."
          duration={0.3}
          staggerDelay={0.1}
          filter={true}
        />
      </p>

      <Link to="/Track">
        <Button className="w-40 text-black instrument-serif-regular text-xl mt-9">
          Start Tracking
        </Button>
      </Link>

      {/* Cards animation */}
      <div className="flex justify-center gap-8 mt-16 flex-wrap max-w-6xl">
        <motion.div
          className="bg-[] text-black rounded-lg shadow-md border border-black p-6 text-center w-80 h-64 flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={leftCard}
        >
          <h3 className="text-2xl font-bold mb-2">Easy Expense Logging</h3>
          <p className="text-gray-700 text-sm">
            Quickly record your daily expenses with just a few taps.
          </p>
        </motion.div>

        <motion.div
          className="bg-[] text-black rounded-lg border border-black shadow-md p-6 text-center w-80 h-64 flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={centerCard}
        >
          <h3 className="text-2xl font-bold mb-2">Visual Insights</h3>
          <p className="text-gray-700 text-sm">
            View charts and graphs to understand your spending habits.
          </p>
        </motion.div>

        <motion.div
          className="bg-[] border border-black text-black rounded-lg shadow-md p-6 text-center w-80 h-64 flex flex-col justify-center"
          initial="hidden"
          animate="visible"
          variants={rightCard}
        >
          <h3 className="text-2xl font-bold mb-2">Smart Tracking</h3>
          <p className="text-gray-700 text-sm">
            Categorize and analyze expenses to manage your budget better.
          </p>
        </motion.div>
      </div>

      <FooterCard />
    </div>
  );
}
