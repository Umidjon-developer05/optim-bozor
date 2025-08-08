"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Banner data
const banners = [
  { image: "/banner/maktab.png" },
  { image: "/banner/fast-food.png" },
  { image: "/banner/kiyimlar.png" },
];

// Motion variants
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const transition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const updateSlide = (index: number) => {
    const newDirection = index > currentSlide ? 1 : -1;
    setDirection(newDirection);
    setCurrentSlide((index + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateSlide((currentSlide + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const banner = banners[currentSlide];

  return (
    <div className="relative my-4 rounded-xl overflow-hidden h-[250px] sm:h-[300px] md:h-[500px]">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="relative w-full h-[400px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden"
        >
          {/* Background image */}
          <Image
            src={banner.image}
            alt="Banner background"
            fill
            className=" object-fill object-center"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => updateSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="relative w-6 h-6 flex items-center justify-center rounded-full"
          >
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 sm:h-10 sm:w-10 z-20"
        onClick={() => updateSlide(currentSlide - 1)}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 sm:h-10 sm:w-10 z-20"
        onClick={() => updateSlide(currentSlide + 1)}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </Button>
    </div>
  );
}
