import AuthForm from "../components/AuthForm";
import { TextGenerateEffect } from "../components/ui/TextAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SignupPage() {
  const texts = [
    "Track your daily expenses effortlessly.",
    "Gain powerful Insights into your spending habits.",
    "Stay organized with your personal Finance Calendar.",
    "Manage your Debts and Lends with ease.",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d1cfc0] to-[#b8b7aa] flex flex-col items-center justify-center px-4 py-8 sm:py-10 md:py-12 text-center">
      {/* Title */}
      <h1 className="instrument-serif-regular-italic text-5xl sm:text-6xl md:text-7xl font-bold text-black mb-6 sm:mb-8">
        Pennywise
      </h1>

      {/* Animated Text */}
      <div className="min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[4rem] text-lg sm:text-2xl md:text-3xl text-black font-medium mb-8 sm:mb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={texts[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            <TextGenerateEffect
              words={texts[index]}
              className="instrument-serif-regular-italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black"
              duration={0.5}
              staggerDelay={0.15}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Auth Form (Centered) */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <AuthForm />
      </div>
    </div>
  );
}
