"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiArrowLeft, HiHeart, HiOutlineHeart, HiShare, HiEye, HiCalendar, HiClock,
} from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import { RiUserAddLine, RiLiveLine, RiCalendarCheckLine, RiHistoryLine } from "react-icons/ri";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import ChatBox from "@/components/ChatBox";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";
import { formatViewers } from "@/lib/utils";

const catColors = {
  Tech:   { color: "#38bdf8", bg: "rgba(56,189,248,0.1)",   border: "rgba(56,189,248,0.25)" },
  Music:  { color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  border: "rgba(167,139,250,0.25)" },
  Gaming: { color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)" },
};

function GlassPanel({ children, className = "" }) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(10,15,28,0.8)",
        backdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {children}
    </div>
  );
}

export default function EventPage({ params }) {
  const { id } = params;
  const router  = useRouter();
  const event   = useMemo(() => events.find((e) => e.id === id), [id]);

  const [liked,          setLiked]          = useState(false);
  const [likeCount,      setLikeCount]      = useState(event?.likes ?? 0);
  const [showShareToast, setShowShareToast] = useState(false);

  const related = useMemo(
    () => events.filter((e) => e.id !== id && e.category === event?.category).slice(0, 4),
    [id, event]
  );

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Event not found</h1>
          <Link href="/" className="text-sm underline" style={{ color: "var(--brand)" }}>← Back to events</Link>
        </div>
      </div>
    );
  }

  const handleLike = () => setLiked((p) => { setLikeCount((c) => (p ? c - 1 : c + 1)); return !p; });
  const handleShare = async () => {
    const url = window.location.origin + '/events/' + event.id;
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };
  const fmt = (n) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(1)}K` : String(n);
  const cat = catColors[event.category] ?? { color: "#888", bg: "rgba(128,128,128,0.1)", border: "rgba(128,128,128,0.25)" };
  const fmtDate = new Date(event.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)" }}>
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb w-[600px] h-[600px] top-0 left-[-200px]"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)" }} />
        <div className="ambient-orb w-[500px] h-[500px] top-[40%] right-[-100px]"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
        <div className="ambient-orb w-[500px] h-[500px] bottom-0 right-[-100px]"
          style={{ background: `radial-gradient(circle, ${cat.color}12 0%, transparent 70%)` }} />
        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)"
        }} />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 pt-[62px] pb-16">

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-6 pb-5"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[13px] font-medium transition-colors group"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <HiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to events
          </button>
        </motion.div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-2 mb-10">

          {/* ── Left: video + info ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 min-w-0"
          >
            <VideoPlayer youtubeId={event.youtubeId} title={event.title} />

            {/* VOD badge for ended events */}
            {event.status === "ended" && (
              <div className="flex items-center gap-2 mt-2.5">
                <span
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-[0.08em]"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-secondary)" }}
                >
                  <RiHistoryLine className="w-3 h-3" />
                  VOD · Replay
                </span>
                {event.duration && (
                  <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                    {event.duration}
                  </span>
                )}
              </div>
            )}

            {/* Info panel */}
            <GlassPanel className="mt-5 p-5 sm:p-7">
              {/* Status chips */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {event.status === "live" && (
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-[0.08em]"
                    style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", color: "var(--brand)" }}
                  >
                    <RiLiveLine className="w-3 h-3" />
                    LIVE
                  </span>
                )}
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-semibold"
                  style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.color }}
                >
                  {event.category}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-[20px] sm:text-[26px] font-black leading-tight tracking-[-0.025em] mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                {event.title}
              </h1>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 mb-6 pb-6" style={{ borderBottom: event.status === "upcoming" ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { icon: HiEye,      label: `${formatViewers(event.viewers)} watching` },
                  { icon: HiCalendar, label: fmtDate },
                  { icon: HiClock,    label: event.time },
                  ...(event.status === "ended" && event.duration
                    ? [{ icon: RiHistoryLine, label: `Stream ran for ${event.duration}` }]
                    : []
                  ),
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="stat-badge">
                    <Icon className="w-3 h-3" />{label}
                  </div>
                ))}
              </div>

              {/* scheduledFor — upcoming events only */}
              {event.status === "upcoming" && event.scheduledFor && (
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-6"
                  style={{
                    background: "rgba(6,182,212,0.07)",
                    border: "1px solid rgba(6,182,212,0.18)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <RiCalendarCheckLine className="w-4 h-4 flex-shrink-0" style={{ color: "var(--brand)" }} />
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.1em] uppercase mb-0.5" style={{ color: "var(--brand)" }}>
                      Scheduled For
                    </p>
                    <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {event.scheduledFor}
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <motion.button
                  onClick={handleLike}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-semibold border transition-all"
                  style={{
                    background: liked ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.04)",
                    border: liked ? "1px solid rgba(6,182,212,0.35)" : "1px solid rgba(255,255,255,0.08)",
                    color: liked ? "var(--brand)" : "var(--text-secondary)",
                  }}
                >
                  {liked
                    ? <HiHeart className="w-4 h-4" style={{ color: "var(--brand)" }} />
                    : <HiOutlineHeart className="w-4 h-4" />
                  }
                  {fmt(likeCount)}
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <HiShare className="w-4 h-4" />
                  Share
                  {showShareToast && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-[11px] font-medium text-white whitespace-nowrap"
                      style={{ background: "rgba(30,30,48,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      ✓ Link copied
                    </motion.span>
                  )}
                </motion.button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-[11px] font-mono tracking-[0.1em] uppercase mb-2.5" style={{ color: "var(--text-muted)" }}>About</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{event.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-7">
                {event.tags.map((tag) => (
                  <span key={tag} className="tag-pill">#{tag}</span>
                ))}
              </div>

              {/* Host */}
              <div
                className="flex items-center gap-4 pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
                  style={{ border: "2px solid rgba(255,255,255,0.1)" }}>
                  <Image src={event.hostAvatar} alt={event.host} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{event.host}</span>
                    <MdVerified className="w-4 h-4 flex-shrink-0" style={{ color: "var(--brand)" }} />
                  </div>
                  <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>Official Host</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--text-secondary)" }}
                >
                  <RiUserAddLine className="w-3.5 h-3.5" />
                  Follow
                </motion.button>
              </div>
            </GlassPanel>
          </motion.div>

          {/* ── Right: chat ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[360px] xl:w-[380px] flex-shrink-0"
          >
            <div className="lg:sticky lg:top-[70px]" style={{ height: "calc(100vh - 90px)" }}>
              <ChatBox viewerCount={event.viewers} />
            </div>
          </motion.div>
        </div>

        {/* Related events */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-mono tracking-[0.12em] uppercase mb-1" style={{ color: cat.color }}>
                  More Like This
                </p>
                <h2 className="text-[20px] font-black tracking-[-0.025em]" style={{ color: "var(--text-primary)" }}>
                  More in {event.category}
                </h2>
              </div>
              <Link href="/" className="text-[12px] font-medium transition-colors" style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6">
              {related.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}

