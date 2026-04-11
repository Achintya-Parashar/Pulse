"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiPlay, HiEye } from "react-icons/hi";
import { RiLiveLine, RiFireLine } from "react-icons/ri";

const stagger = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroBanner({ event }) {
  const router = useRouter();
  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden cursor-pointer group"
      style={{ borderRadius: "24px", minHeight: "clamp(360px, 46vw, 540px)" }}
      onClick={() => router.push(`/events/${event.id}`)}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-[1.2s] ease-out"
          style={{ transform: "scale(1.04)" }}
        />
      </div>

      {/* Layered gradients for cinematic depth */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(7,7,13,0.97) 0%, rgba(7,7,13,0.82) 38%, rgba(7,7,13,0.35) 65%, rgba(7,7,13,0.08) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,7,13,0.98) 0%, rgba(7,7,13,0.4) 30%, transparent 60%)" }} />

      {/* Ambient brand glow */}
      <div
        className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      {/* Top right indigo accent */}
      <div
        className="absolute -top-12 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(80px)" }}
      />

      {/* Grain overlay */}
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-end h-full p-7 sm:p-10 lg:p-14"
        style={{ minHeight: "clamp(360px, 46vw, 540px)" }}
      >
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <motion.div {...stagger(0.25)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[11px] font-bold font-mono tracking-[0.1em]"
            style={{ background: "var(--brand)", boxShadow: "0 0 20px rgba(6,182,212,0.55)" }}
          >
            <RiLiveLine className="w-3 h-3" />
            LIVE NOW
          </motion.div>

          <motion.div {...stagger(0.32)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", color: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)" }}
          >
            <HiEye className="w-3 h-3" />
            {event.viewers} watching
          </motion.div>

          <motion.div {...stagger(0.39)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}
          >
            <RiFireLine className="w-3 h-3 text-orange-400" />
            Featured
          </motion.div>
        </div>

        {/* Title */}
        <motion.h1
          {...stagger(0.18)}
          className="font-black text-[clamp(1.6rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-white mb-4 max-w-3xl"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.6)" }}
        >
          {event.title}
        </motion.h1>

        {/* Description */}
        <motion.p {...stagger(0.28)}
          className="hidden sm:block text-[14px] leading-relaxed mb-5 max-w-xl line-clamp-2"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {event.description}
        </motion.p>

        {/* Tags */}
        <motion.div {...stagger(0.36)} className="hidden sm:flex flex-wrap gap-2 mb-7">
          {event.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}
            >
              #{tag}
            </span>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div {...stagger(0.42)} className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(6,182,212,0.65)" }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.stopPropagation(); router.push(`/events/${event.id}`); }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-white font-bold text-[14px] transition-all"
            style={{ background: "var(--brand)", boxShadow: "0 0 28px rgba(6,182,212,0.4)" }}
          >
            <HiPlay className="w-4 h-4" />
            Watch Now
          </motion.button>

          <div className="hidden sm:block">
            <p className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
              {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{event.time}</p>
          </div>
        </motion.div>
      </div>

      {/* Right-side preview mosaic — decorative on large screens */}
      <div className="absolute right-0 top-0 bottom-0 w-[38%] hidden lg:block pointer-events-none">
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(7,7,13,1) 0%, transparent 40%)" }} />
      </div>
    </motion.div>
  );
}

