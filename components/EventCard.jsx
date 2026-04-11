"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiHeart, HiOutlineHeart, HiShare, HiPlay, HiEye } from "react-icons/hi";
import { RiCalendarEventLine } from "react-icons/ri";

const catConfig = {
  Tech:   { label: "Tech",   color: "#38bdf8", bg: "rgba(56,189,248,0.1)",   border: "rgba(56,189,248,0.2)",   fade: "rgba(56,189,248,0.22)"   },
  Music:  { label: "Music",  color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  border: "rgba(167,139,250,0.2)",  fade: "rgba(167,139,250,0.22)"  },
  Gaming: { label: "Gaming", color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.2)",   fade: "rgba(52,211,153,0.22)"   },
};

export default function EventCard({ event, index = 0 }) {
  const router = useRouter();
  const [liked,          setLiked]          = useState(false);
  const [likeCount,      setLikeCount]      = useState(event.likes);
  const [showShareToast, setShowShareToast] = useState(false);
  const [imgLoaded,      setImgLoaded]      = useState(false);
  const [hovered,        setHovered]        = useState(false);

  const cat = catConfig[event.category] ?? { label: event.category, color: "#888", bg: "rgba(128,128,128,0.1)", border: "rgba(128,128,128,0.2)" };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((p) => { setLikeCount((c) => (p ? c - 1 : c + 1)); return !p; });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2200);
  };

  const fmt = (n) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000   ? `${(n / 1_000).toFixed(1)}K`
    : String(n);

  const fmtDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => router.push(`/events/${event.id}`)}
      className="group relative rounded-2xl cursor-pointer card-shine overflow-hidden"
      style={{
        background: "rgba(12,17,32,0.75)",
        backdropFilter: "blur(20px)",
        border: hovered ? `1px solid ${cat.border}` : "1px solid rgba(255,255,255,0.06)",
        boxShadow: hovered
          ? `0 28px 64px rgba(0,0,0,0.75), 0 4px 24px ${cat.color}18, inset 0 1px 0 ${cat.color}15`
          : "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* ── Thumbnail ── */}
      <div className="relative aspect-video overflow-hidden">
        {/* Skeleton */}
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}

        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)", opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
        />

        {/* Cinematic gradient + category color fade at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${cat.fade} 0%, rgba(12,17,32,0.85) 25%, rgba(12,17,32,0.2) 60%, transparent 100%)`,
          }}
        />

        {/* LIVE badge */}
        {event.trending && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold font-mono tracking-widest"
            style={{ background: "var(--brand)", boxShadow: "0 0 16px rgba(230,57,70,0.5)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
            LIVE
          </div>
        )}

        {/* Category chip */}
        <div
          className="absolute top-3 right-3 px-2.5 py-[3px] rounded-full text-[10px] font-semibold tracking-wide"
          style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.color }}
        >
          {cat.label}
        </div>

        {/* Viewer count */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/70 text-[11px] font-mono">
          <HiEye className="w-3 h-3" />
          {event.viewers}
        </div>

        {/* Play button – appears on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(230,57,70,0.9)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 0 32px rgba(230,57,70,0.6)",
                }}
              >
                <HiPlay className="w-6 h-6 text-white ml-0.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Body ── */}
      <div className="p-4 pb-3.5">
        {/* Title */}
        <h3
          className="font-bold text-[14px] leading-snug line-clamp-2 mb-2.5 transition-colors duration-200"
          style={{ color: hovered ? "#ffffff" : "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          {event.title}
        </h3>

        {/* Date / Time */}
        <div className="flex items-center gap-1.5 mb-4" style={{ color: "var(--text-muted)" }}>
          <RiCalendarEventLine className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[11px] font-mono">{fmtDate} · {event.time}</span>
        </div>

        {/* Divider */}
        <div className="h-px mb-3.5" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* Actions row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Like */}
            <motion.button
              onClick={handleLike}
              whileTap={{ scale: 0.82 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all"
              style={{
                background: liked ? "rgba(230,57,70,0.1)" : "transparent",
                border: liked ? "1px solid rgba(230,57,70,0.25)" : "1px solid transparent",
              }}
            >
              <AnimatePresence mode="wait">
                {liked
                  ? <motion.span key="on"  initial={{ scale: 0.3, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.3 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                      <HiHeart className="w-3.5 h-3.5" style={{ color: "var(--brand)" }} />
                    </motion.span>
                  : <motion.span key="off" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
                      <HiOutlineHeart className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                    </motion.span>
                }
              </AnimatePresence>
              <span
                className="text-[11px] font-mono tabular-nums"
                style={{ color: liked ? "var(--brand)" : "var(--text-muted)" }}
              >
                {fmt(likeCount)}
              </span>
            </motion.button>

            {/* Share */}
            <motion.button
              onClick={handleShare}
              whileTap={{ scale: 0.82 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/[0.05]"
            >
              <HiShare className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
            </motion.button>
          </div>

          {/* Watch CTA */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); router.push(`/events/${event.id}`); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-[12px] font-semibold transition-all"
            style={{ background: "var(--brand)", boxShadow: hovered ? "0 0 20px rgba(230,57,70,0.4)" : "none" }}
          >
            Watch
            <HiPlay className="w-3 h-3" />
          </motion.button>
        </div>
      </div>

      {/* Share toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-[12px] text-white font-medium whitespace-nowrap pointer-events-none"
            style={{ background: "rgba(30,30,48,0.95)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
          >
            ✓ Link copied
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

