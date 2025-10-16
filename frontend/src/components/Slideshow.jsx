import { useState, useEffect } from "react";

const slides = [
  { title: "Track your tasks", desc: "Organize daily work efficiently." },
  { title: "Collaborate seamlessly", desc: "Work with your team in real-time." },
  { title: "Get insights", desc: "Analyze productivity with reports." },
];

export default function Slideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full flex items-center justify-center text-center px-8">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
          <p className="text-lg">{slide.desc}</p>
        </div>
      ))}
    </div>
  );
}
