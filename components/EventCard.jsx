"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiHeart, HiOutlineHeart, HiShare, HiPlay, HiEye } from "react-icons/hi";
import { RiCalendarEventLine, RiTimeLine } from "react-icons/ri";
import { formatViewers } from "@/lib/utils";

const catConfig = {
  Tech: { label: "Tech", color: "#ffffff", bg: "rgba(255,255,255,0.1)", border: "rgba(255,255,255,0.2)", fade: "rgba(255,255,255,0.22)" },
  Music: { label: "Music", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)", fade: "rgba(167,139,250,0.22)" },
  Gaming: { label: "Gaming", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", fade: "rgba(52,211,153,0.22)" },
};

export default function EventCard({ event, index = 0 }) {
  const router = useRouter();

  // Existing Status Variables - Must Not Change
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(event.likes);
  const [showShareToast, setShowShareToast] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false); // Retained for compatibility

  // New State Variables for Hover/Touch Resizing
  const [isHovered, setIsHovered] = useState(false);
  const [tapExpanded, setTapExpanded] = useState(false);
  const [popupSide, setPopupSide] = useState("center");

  const hoverTimerRef = useRef(null);
  const cardRef = useRef(null);
  const isTouchDevice = useRef(false);

  // Initialize Touch Detection
  useEffect(() => {
    isTouchDevice.current = typeof window !== "undefined" && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Popup Positioning Logic
  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      if (rect.left < vw * 0.25) {
        setPopupSide("right");
      } else if (rect.right > vw * 0.75) {
        setPopupSide("left");
      } else {
        setPopupSide("center");
      }
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    if (isTouchDevice.current) return;
    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice.current) return;
    clearTimeout(hoverTimerRef.current);
    setIsHovered(false);
  };

  const handleTap = () => {
    if (!isTouchDevice.current) return;
    setTapExpanded((prev) => !prev);
  };

  // Timer Cleanup
  useEffect(() => {
    return () => clearTimeout(hoverTimerRef.current);
  }, []);

  // Preserved Initialization
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulse_likes");
      const likes = stored ? JSON.parse(stored) : [];
      if (likes.includes(event.id)) setLiked(true);
    } catch (err) {
      console.warn("Failed to read pulse_likes:", err);
    }
  }, [event.id]);

  // Preserved Interaction Handlers
  const handleLike = (e) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => newLiked ? prev + 1 : prev - 1);
    try {
      const stored = localStorage.getItem("pulse_likes");
      const likes = stored ? JSON.parse(stored) : [];
      const updated = newLiked
        ? [...likes, event.id]
        : likes.filter((id) => id !== event.id);
      localStorage.setItem("pulse_likes", JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to update pulse_likes:", err);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = window.location.origin + '/events/' + event.id;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2200);
      }
    } catch (err) {
      console.warn('Share/Clipboard rewrite failed:', err);
    }
  };

  // Common UI Variables
  const cat = catConfig[event.category] ?? { label: event.category, color: "#888", bg: "rgba(128,128,128,0.1)", border: "rgba(128,128,128,0.2)" };

  const fmt = (n) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K`
        : String(n);

  const fmtDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const getBottomRightLabel = () => {
    if (event.status === "ended") {
      return { icon: "clock", text: event.duration };
    }
    if (event.status === "live") {
      return { icon: "dot", text: "Live Now" };
    }
    if (event.status === "upcoming" && event.scheduledFor) {
      const parts = event.scheduledFor.split("·");
      const time = parts[1] ? parts[1].trim() : event.scheduledFor;
      return { icon: "clock", text: time };
    }
    return null;
  };
  const brLabel = getBottomRightLabel();

  // Reusable JSX Blocks
  const thumbnailJSX = (
    <>
      {!imgLoaded && <div className="absolute inset-0 skeleton" />}
      <Image
        src={event.image}
        alt={event.title}
        fill
        className="object-cover transition-transform duration-700"
        style={{ transform: "scale(1)", opacity: imgLoaded ? 1 : 0 }}
        onLoad={() => setImgLoaded(true)}
        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${cat.fade} 0%, rgba(12,17,32,0.85) 15%, rgba(12,17,32,0.1) 60%, transparent 100%)`,
        }}
      />
      {event.status === "live" && (
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-white text-[10px] font-bold font-mono tracking-widest"
          style={{ background: "rgba(239, 68, 68, 0.9)", border: "1px solid rgba(239, 68, 68, 0.5)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
          LIVE
        </div>
      )}
      <div
        className="absolute top-3 right-3 px-2.5 py-[3px] rounded-full text-[10px] font-semibold tracking-wide"
        style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.color }}
      >
        {cat.label}
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-sm font-medium px-2 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}>
        <HiEye className="w-3.5 h-3.5" />
        {formatViewers(event.viewers)}
      </div>

      {brLabel && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-white/80 text-sm font-medium px-2 py-1 rounded-md z-10" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}>
          {brLabel.icon === "clock" && <RiTimeLine className="w-3.5 h-3.5" />}
          {brLabel.icon === "dot" && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgb(239,68,68)" }} />}
          {brLabel.text}
        </div>
      )}
    </>
  );

  const infoPanelJSX = (
    <>
      <h3 className="font-bold text-[16px] text-white leading-snug line-clamp-2" style={{ letterSpacing: "-0.01em" }}>
        {event.title}
      </h3>

      <div className="flex items-center gap-1.5 mt-2 mb-4 w-full" style={{ color: "var(--text-muted)" }}>
        <RiCalendarEventLine className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-[11px] font-mono truncate">{fmtDate} · {event.time}</span>
      </div>

      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Like */}
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.82 }}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all flex-shrink-0 whitespace-nowrap"
            style={{
              background: liked ? "rgba(230,57,70,0.15)" : "rgba(255,255,255,0.06)",
              border: liked ? "1px solid rgba(230,57,70,0.25)" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <AnimatePresence mode="wait">
              {liked
                ? <motion.span key="on" initial={{ scale: 0.3, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.3 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                  <HiHeart className="w-4 h-4" style={{ color: "var(--brand)" }} />
                </motion.span>
                : <motion.span key="off" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
                  <HiOutlineHeart className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                </motion.span>
              }
            </AnimatePresence>
            <span className="text-[12px] font-mono tabular-nums" style={{ color: liked ? "var(--brand)" : "var(--text-muted)" }}>
              {fmt(likeCount)}
            </span>
          </motion.button>

          {/* Share */}
          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.82 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all hover:bg-white/[0.1] flex-shrink-0 whitespace-nowrap"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <HiShare className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          </motion.button>
        </div>

        {/* Watch CTA */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); router.push(`/events/${event.id}`); }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-white transition-all flex-shrink-0 whitespace-nowrap"
          style={{
            background: "rgba(30, 16, 226, 0.46)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            width: "100%",
            boxShadow: "0 0 20px rgba(0,168,225,0.4)"
          }}
        >
          <HiPlay className="w-4 h-4" />
          Watch Now
        </motion.button>
      </div>

      {/* Share toast isolated for both mobile/desktop nodes */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-[12px] text-white font-medium whitespace-nowrap pointer-events-none"
            style={{ background: "rgba(30,30,48,0.95)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 100 }}
          >
            ✓ Link copied
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <div
      className="relative w-full group"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
    >
      {/* 1. RESTING STATE (Holds grid dims) */}
      <motion.article
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl cursor-pointer overflow-hidden aspect-video relative"
        style={{
          background: "rgba(12,17,32,0.75)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {thumbnailJSX}
      </motion.article>

      {/* 2. DESKTOP HOVER POPUP */}
      {!isTouchDevice.current && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute z-50 rounded-2xl overflow-hidden glass-card cursor-pointer"
              style={{
                top: 0,
                left: popupSide === 'right' ? 0 : popupSide === 'center' ? '50%' : 'auto',
                right: popupSide === 'left' ? 0 : 'auto',
                width: '115%',
                x: popupSide === 'center' ? '-50%' : '0%',
                transformOrigin: popupSide === 'right' ? 'top left' : popupSide === 'left' ? 'top right' : 'top center',
                boxShadow: `0 32px 64px rgba(0,0,0,0.9), 0 4px 32px ${cat.color}25, inset 0 1px 0 rgba(255,255,255,0.1)`,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(10,15,24,0.96)"
              }}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1.08, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => { e.stopPropagation(); router.push(`/events/${event.id}`); }}
            >
              <div className="relative w-full aspect-video overflow-hidden">
                {thumbnailJSX}
              </div>

              <div className="p-5 pb-5 relative z-10">
                {infoPanelJSX}
              </div>

              {/* Bottom Fade Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(10,15,24,1), transparent)" }} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 3. MOBILE TAP-EXPANDED STATE */}
      {isTouchDevice.current && (
        <AnimatePresence>
          {tapExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden glass-card mt-2 rounded-2xl cursor-default"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              onClick={(e) => e.stopPropagation()} // Stop bubbling out immediately on panel touches
            >
              <div className="p-4 relative z-10">
                {infoPanelJSX}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
