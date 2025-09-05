"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Banner data (add alt for accessibility)
const banners = [
  { image: "/banner/maktab.png", alt: "Maktab mavzuli chegirmalar" },
  { image: "/banner/fast-food.png", alt: "Fast food aksiyalari" },
  { image: "/banner/kiyimlar.png", alt: "Kiyımlar kolleksiyasi" },
];

// Motion variants
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const transition = {
  x: { type: "spring" as any, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide((index + banners.length) % banners.length);
  };

  // Stable autoplay (doesn't reset every slide)
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const banner = banners[currentSlide];

  return (
    <div
      className="relative w-full mb-2 overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm aspect-[16/9] sm:aspect-[21/9]"
      aria-roledescription="carousel"
      aria-label="Reklama bannerlari"
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="absolute inset-0"
          aria-live="polite"
        >
          <Image
            src={banner.image}
            alt={banner.alt}
            fill
            className="object-cover"
            priority
          />
          {/* Gentle gradient so any overlaid text (if added) remains readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/0 to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`Slide ${index + 1} ga o'tish`}
            className="relative w-6 h-6 flex items-center justify-center rounded-full"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ring-1 ring-white/60 transition-all ${
                index === currentSlide ? "bg-white scale-110" : "bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full h-9 w-9 sm:h-10 sm:w-10 z-20 shadow ring-1 ring-black/5"
        onClick={() => goTo(currentSlide - 1)}
        aria-label="Oldingi slayd"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full h-9 w-9 sm:h-10 sm:w-10 z-20 shadow ring-1 ring-black/5"
        onClick={() => goTo(currentSlide + 1)}
        aria-label="Keyingi slayd"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </div>
  );
}
