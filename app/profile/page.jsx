"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RiCalendarCheckLine, RiCalendarLine, RiLoader4Line } from "react-icons/ri";
import { HiEye } from "react-icons/hi";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import useAuth from "@/lib/useAuth";
import { events } from "@/data/events";
import { formatViewers } from "@/lib/utils";

const catColor = {
  Tech:   "#38bdf8",
  Music:  "#a78bfa",
  Gaming: "#34d399",
};

export default function ProfilePage() {
  const router          = useRouter();
  const { user, isLoggedIn, logout } = useAuth();

  const [authResolved,    setAuthResolved]   = useState(false);
  const [stats,           setStats]          = useState({ watched: 0, liked: 0, reminders: 0 });
  const [likedEventIds,   setLikedEventIds]  = useState([]);
  const [reminderEventIds, setReminderEventIds] = useState([]);
  const [reminders,       setReminders]      = useState([]);
  const [showToast,       setShowToast]      = useState(false);

  // Auth guard
  useEffect(() => {
    setAuthResolved(true);
    const stored = localStorage.getItem("pulse_user");
    if (!stored) router.push("/signin");
  }, [router]);

  // Load stats from localStorage
  useEffect(() => {
    if (!authResolved) return;
    try {
      // pulse_likes
      const likeRaw   = localStorage.getItem("pulse_likes");
      const likeIds   = likeRaw ? JSON.parse(likeRaw) : [];
      setLikedEventIds(likeIds);

      // pulse_reminders
      const remRaw    = localStorage.getItem("pulse_reminders");
      const remIds    = remRaw ? JSON.parse(remRaw) : [];
      setReminderEventIds(remIds);
      setReminders(remIds);

      // pulse_profile_stats
      const statRaw   = localStorage.getItem("pulse_profile_stats");
      let watched;
      if (statRaw) {
        watched = JSON.parse(statRaw).watched;
      } else {
        watched = Math.floor(Math.random() * (47 - 12 + 1)) + 12;
        localStorage.setItem("pulse_profile_stats", JSON.stringify({ watched }));
      }

      setStats({ watched, liked: likeIds.length, reminders: remIds.length });
    } catch (err) {
      console.warn("Failed to load profile stats:", err);
    }
  }, [authResolved]);

  const likedEvents = useMemo(
    () => events.filter((e) => likedEventIds.includes(e.id)),
    [likedEventIds]
  );

  const reminderEvents = useMemo(
    () => events.filter((e) => reminderEventIds.includes(e.id) && e.status === "upcoming"),
    [reminderEventIds]
  );

  const toggleReminder = (eventId) => {
    try {
      const updated = reminders.includes(eventId)
        ? reminders.filter((id) => id !== eventId)
        : [...reminders, eventId];
      setReminders(updated);
      setReminderEventIds(updated);
      localStorage.setItem("pulse_reminders", JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to update pulse_reminders:", err);
    }
  };

  const handleEditProfile = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  // Loading state
  if (!authResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
          <RiLoader4Line className="w-8 h-8" style={{ color: "var(--brand)" }} />
        </motion.div>
      </div>
    );
  }

  const memberSince = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "April 2026";

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)" }}>
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb w-[600px] h-[600px] top-[-150px] left-[-150px]"
          style={{ background: "radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 65%)" }} />
        <div className="ambient-orb w-[500px] h-[500px] bottom-[10%] right-[-100px]"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 65%)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.055) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
        }} />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 pt-[86px] pb-20">

        {/* ── Profile Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 pt-8"
        >
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-[36px] font-black flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dim) 100%)",
              boxShadow: "0 0 40px rgba(6,182,212,0.35), 0 0 0 3px rgba(6,182,212,0.15)",
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-[26px] sm:text-[32px] font-black tracking-[-0.025em] mb-1" style={{ color: "var(--text-primary)" }}>
              {user?.name ?? "Guest"}
            </h1>
            <p className="text-[13px] mb-1" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
            <p className="text-[11px] font-mono mb-4" style={{ color: "var(--text-muted)" }}>
              Member since {memberSince}
            </p>

            <div className="relative inline-block">
              <motion.button
                onClick={handleEditProfile}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "var(--text-secondary)",
                }}
              >
                Edit Profile
              </motion.button>
              <AnimatePresence>
                {showToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 -top-10 px-3 py-1.5 rounded-xl text-[11px] text-white font-medium whitespace-nowrap pointer-events-none"
                    style={{ background: "rgba(30,30,48,0.95)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                  >
                    Profile editing coming soon
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {[
            { label: "Events Watched", value: stats.watched },
            { label: "Events Liked",   value: stats.liked   },
            { label: "Reminders Set",  value: stats.reminders },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center py-5 px-3 rounded-[18px]"
              style={{
                background: "rgba(10,15,28,0.75)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <span className="text-[30px] font-black tracking-[-0.02em] gradient-text">{value}</span>
              <span className="text-[11px] font-mono text-center mt-1" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Liked Events ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] font-black tracking-[-0.025em]" style={{ color: "var(--text-primary)" }}>
              Liked Events
            </h2>
            <span className="text-[11px] font-mono stat-badge">{likedEvents.length} events</span>
          </div>

          {likedEvents.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-14 rounded-2xl text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[15px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No liked events yet</p>
              <p className="text-[13px] mb-5" style={{ color: "var(--text-muted)" }}>Start exploring!</p>
              <Link
                href="/browse"
                className="px-5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all"
                style={{ background: "var(--brand)", color: "white", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-6">
              {likedEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </motion.section>

        {/* ── Reminders ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[22px] font-black tracking-[-0.025em]" style={{ color: "var(--text-primary)" }}>
              Your Reminders
            </h2>
            <span className="text-[11px] font-mono stat-badge">{reminderEvents.length} upcoming</span>
          </div>

          {reminderEvents.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-14 rounded-2xl text-center"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[15px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No reminders set</p>
              <p className="text-[13px] mb-5" style={{ color: "var(--text-muted)" }}>Check out upcoming events!</p>
              <Link
                href="/upcoming"
                className="px-5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all"
                style={{ background: "var(--brand)", color: "white", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
              >
                Upcoming Events
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reminderEvents.map((event) => {
                const color     = catColor[event.category] ?? "var(--brand)";
                const isReminded = reminders.includes(event.id);
                return (
                  <div
                    key={event.id}
                    className="relative flex overflow-hidden rounded-2xl"
                    style={{
                      background: "rgba(10,15,28,0.8)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="w-1 flex-shrink-0" style={{ background: color }} />
                    <div className="relative flex-shrink-0 hidden sm:block" style={{ width: 120, height: 68, alignSelf: "center", margin: "12px 0 12px 12px" }}>
                      <Image src={event.image} alt={event.title} width={120} height={68} className="object-cover" style={{ borderRadius: "10px" }} />
                    </div>
                    <div className="flex-1 min-w-0 px-4 py-4 flex flex-col justify-center gap-1">
                      <span className="self-start px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
                        {event.category}
                      </span>
                      <h3 className="font-bold text-[14px] leading-snug" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
                      <p className="text-[11px] font-mono" style={{ color }}>
                        {event.scheduledFor}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center px-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => toggleReminder(event.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
                        style={
                          isReminded
                            ? { background: `${color}18`, border: `1px solid ${color}40`, color }
                            : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }
                        }
                      >
                        {isReminded ? <><RiCalendarCheckLine className="w-3.5 h-3.5" /> Set ✓</> : <><RiCalendarLine className="w-3.5 h-3.5" /> Remind</>}
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* ── Sign Out ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex justify-center pt-4"
        >
          <motion.button
            onClick={handleSignOut}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-2.5 rounded-xl text-[13px] font-medium transition-all"
            style={{
              border: "1px solid rgba(239,68,68,0.25)",
              color: "rgba(239,68,68,0.75)",
              background: "transparent",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "rgba(239,68,68,1)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(239,68,68,0.75)"}
          >
            Sign Out
          </motion.button>
        </motion.div>

      </main>
    </div>
  );
}
