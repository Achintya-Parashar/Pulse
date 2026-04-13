"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlay, HiEye } from "react-icons/hi";
import { RiLiveLine, RiFireLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { formatViewers } from "@/lib/utils";
import { events } from "@/data/events";

const HERO_EVENT_IDS = ["10", "1", "2", "9"];
const heroEvents = HERO_EVENT_IDS.map((id) => events.find((e) => e.id === id)).filter(Boolean);

const stagger = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroBanner() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % heroEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  if (heroEvents.length === 0) return null;
  const event = heroEvents[currentIndex];

  const handleNext = (e) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % heroEvents.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + heroEvents.length) % heroEvents.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden cursor-pointer group hero-float"
      style={{ borderRadius: "24px", minHeight: "clamp(360px, 46vw, 540px)", background: "#000000" }}
      onClick={() => router.push(`/events/${event.id}`)}
    >
      {/* Hero Crossfade Images */}
      <AnimatePresence mode="wait">
        <motion.div
           key={currentIndex}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.6 }}
           className="absolute inset-0 pointer-events-none z-0"
        >
          {/* Desktop Right side image */}
          <div className="hidden md:block absolute right-0 top-0 w-[45%] h-full">
            <Image src={event.image} fill priority sizes="45vw" style={{ objectFit: "cover" }} alt={event.title} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #000000 0%, transparent 40%)" }} />
          </div>

          {/* Mobile full background image */}
          <div className="md:hidden absolute inset-0">
            <Image src={event.image} fill priority sizes="100vw" style={{ objectFit: "cover" }} alt={event.title} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 grain pointer-events-none z-0" />

      {/* Content - Left side */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={{
            enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
            center: { opacity: 1, x: 0 },
            exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative z-10 w-full md:w-[55%] flex flex-col justify-end h-full p-7 sm:p-10 lg:px-14 lg:py-16"
          style={{ minHeight: "clamp(360px, 46vw, 540px)" }}
        >
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <motion.div {...stagger(0.1)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[11px] font-bold font-mono tracking-[0.1em]"
              style={{ background: "rgba(239, 68, 68, 0.9)", border: "1px solid rgba(239, 68, 68, 0.5)", boxShadow: "0 0 20px rgba(239,68,68,0.3)" }}
            >
              <RiLiveLine className="w-3 h-3 text-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
              LIVE
            </motion.div>

            <motion.div {...stagger(0.15)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-white"
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
            >
              <HiEye className="w-3 h-3" />
              {formatViewers(event.viewers)} watching
            </motion.div>

            <motion.div {...stagger(0.2)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-white"
              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
            >
              <RiFireLine className="w-3 h-3 text-orange-400" />
              Featured
            </motion.div>
          </div>

          {/* Title */}
          <motion.h1
            {...stagger(0.18)}
            className="font-extrabold font-display text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.98] tracking-[-0.06em] mb-4 max-w-3xl bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(120deg, #7dd3fc 0%, #c084fc 45%, #e2e8f0 100%)",
              textShadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
            }}
          >
            {event.title}
          </motion.h1>

          {/* Description */}
          <motion.p {...stagger(0.28)}
            className="hidden sm:block text-[14px] leading-relaxed mb-5 max-w-xl line-clamp-2"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {event.description}
          </motion.p>

          {/* Tags */}
          <motion.div {...stagger(0.36)} className="hidden sm:flex flex-wrap gap-2 mb-7">
            {event.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
              >
                #{tag}
              </span>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div {...stagger(0.42)} className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.stopPropagation(); router.push(`/events/${event.id}`); }}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-black font-bold text-[14px] transition-all"
              style={{ background: "#FFFFFF", boxShadow: "0 0 28px rgba(255,255,255,0.1)" }}
            >
              <HiPlay className="w-4 h-4" />
              Watch Now
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 flex justify-between items-center pointer-events-none z-20">
        <button onClick={handlePrev} className="pointer-events-auto p-2 rounded-full hover:bg-white/10 transition backdrop-blur-sm shadow-xl" style={{ background: "rgba(0,0,0,0.5)" }}>
          <RiArrowLeftSLine className="w-6 h-6 text-white" />
        </button>
        <button onClick={handleNext} className="pointer-events-auto p-2 rounded-full hover:bg-white/10 transition backdrop-blur-sm shadow-xl" style={{ background: "rgba(0,0,0,0.5)" }}>
          <RiArrowRightSLine className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-auto">
        {heroEvents.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
            className="rounded-full transition-all duration-300"
            style={{
              width: currentIndex === i ? "24px" : "8px",
              height: "8px",
              background: currentIndex === i ? "#FFFFFF" : "rgba(255,255,255,0.4)"
            }}
          />
        ))}
      </div>
    </div>
  );
}
