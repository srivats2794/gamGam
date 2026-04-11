import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import grandmaIndian from "@/assets/grandma-indian.png";
import grandmaMayan from "@/assets/grandma-mayan.png";
import grandmaAfrican from "@/assets/grandma-african.png";
import grandmaChinese from "@/assets/grandma-chinese.png";
import grandmaEuropean from "@/assets/grandma-european.png";

const grandmothers = [
  { id: "indian", name: "Daadi", wisdom: "Turmeric heals the body, love heals the soul.", image: grandmaIndian },
  { id: "mayan", name: "Ixchel", wisdom: "The earth provides everything we need to flourish.", image: grandmaMayan },
  { id: "african", name: "Mama Nia", wisdom: "A woman who takes care of herself, takes care of the world.", image: grandmaAfrican },
  { id: "chinese", name: "Nǎi Nai", wisdom: "Balance in all things brings harmony to the body.", image: grandmaChinese },
  { id: "european", name: "Nonna", wisdom: "Good food, fresh air, and laughter are the best medicine.", image: grandmaEuropean },
];

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    // Show title for 2.5s, then start cycling grandmothers
    const titleTimer = setTimeout(() => setShowTitle(false), 2500);
    return () => clearTimeout(titleTimer);
  }, []);

  useEffect(() => {
    if (showTitle) return;
    if (currentIndex >= grandmothers.length) {
      // All grandmothers shown, complete
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setCurrentIndex((i) => i + 1), 4500);
    return () => clearTimeout(timer);
  }, [currentIndex, showTitle, onComplete]);

  const currentGrandma = grandmothers[currentIndex];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 60%, hsl(20 40% 39% / 0.06) 0%, transparent 70%)"
      }} />

      <AnimatePresence mode="wait">
        {showTitle ? (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center px-8"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary tracking-tight">
              mygrammie
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-4 text-lg md:text-xl text-muted-foreground font-body font-light"
            >
              Wisdom from grandmothers around the world
            </motion.p>
          </motion.div>
        ) : currentGrandma ? (
          <motion.div
            key={currentGrandma.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center px-8 max-w-lg"
          >
            {/* Breathing animation on the grandmother image */}
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-full bg-secondary/80 flex items-center justify-center shadow-soft">
                <img
                  src={currentGrandma.image}
                  alt={`${currentGrandma.name} grandmother`}
                  className="w-40 h-40 md:w-64 md:h-64 object-contain drop-shadow-md"
                />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-6 font-display text-3xl md:text-4xl font-semibold text-primary"
            >
              {currentGrandma.name}
            </motion.h2>


            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-5 font-display text-lg md:text-xl italic text-foreground/80 leading-relaxed"
            >
              "{currentGrandma.wisdom}"
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Progress dots */}
      {!showTitle && currentGrandma && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-16 flex gap-2.5"
        >
          {grandmothers.map((g, i) => (
            <div
              key={g.id}
              className={`w-2 h-2 rounded-full transition-all duration-700 ${
                i === currentIndex
                  ? "bg-primary scale-125"
                  : i < currentIndex
                  ? "bg-primary/40"
                  : "bg-border"
              }`}
            />
          ))}
        </motion.div>
      )}

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={onComplete}
        className="absolute bottom-8 text-sm text-muted-foreground font-body hover:text-primary transition-colors"
      >
        Skip →
      </motion.button>
    </div>
  );
};

export default SplashScreen;
