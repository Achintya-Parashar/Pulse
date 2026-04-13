"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCpuLine, RiMicLine, RiGamepadLine } from "react-icons/ri";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";

const CATEGORY_OPTIONS = [
  { label: "Tech",   icon: RiCpuLine,    color: "#38bdf8", bg: "rgba(56,189,248,0.08)",   border: "rgba(56,189,248,0.25)",   activeBorder: "#38bdf8" },
  { label: "Music",  icon: RiMicLine,    color: "#a78bfa", bg: "rgba(167,139,250,0.08)",  border: "rgba(167,139,250,0.25)",  activeBorder: "#a78bfa" },
  { label: "Gaming", icon: RiGamepadLine, color: "#34d399", bg: "rgba(52,211,153,0.08)",   border: "rgba(52,211,153,0.25)",   activeBorder: "#34d399" },
];

const STATUS_ORDER = { live: 0, upcoming: 1, ended: 2 };

export default function ForYouPage() {
  const [interests,         setInterests]         = useState([]);
  const [interestsSet,      setInterestsSet]       = useState(false);
  const [selectedInterests, setSelectedInterests]  = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulse_interests");
      if (stored) {
        const parsed = JSON.parse(stored);
        setInterests(parsed);
        setInterestsSet(true);
      }
    } catch (err) {
      console.warn("Failed to read pulse_interests:", err);
    }
  }, []);

  const toggleInterest = (label) => {
    setSelectedInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length === 0) return;
    try {
      localStorage.setItem("pulse_interests", JSON.stringify(selectedInterests));
    } catch (err) {
      console.warn("Failed to write pulse_interests:", err);
    }
    setInterests(selectedInterests);
    setInterestsSet(true);
  };

  const handleEditInterests = () => {
    try {
      localStorage.removeItem("pulse_interests");
    } catch (err) {
      console.warn("Failed to remove pulse_interests:", err);
    }
    setInterests([]);
    setInterestsSet(false);
    setSelectedInterests([]);
  };

  const primaryEvents = useMemo(() => {
    if (!interestsSet || interests.length === 0) return [];
    return events
      .filter((e) => interests.includes(e.category))
      .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  }, [interests, interestsSet]);

  const suggestedEvents = useMemo(() => {
    if (!interestsSet || primaryEvents.length >= 4) return [];
    return events
      .filter((e) => !interests.includes(e.category))
      .slice(0, 2);
  }, [interests, interestsSet, primaryEvents]);

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)" }}>
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb w-[700px] h-[700px] top-[-250px] left-[-200px]"
          style={{ background: "radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 65%)" }} />
        <div className="ambient-orb w-[500px] h-[500px] bottom-[0] right-[-100px]"
          style={{ background: "radial-gradient(circle,rgba(167,139,250,0.06) 0%,transparent 65%)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.055) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
        }} />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 pt-[86px] pb-16">
        <AnimatePresence mode="wait">
          {!interestsSet ? (
            /* ── Onboarding ── */
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <span className="text-[28px] font-black tracking-[-0.04em] brand-logo mb-6">StreamVerse<span className="brand-logo-x">X</span></span>
              <h1 className="text-[28px] sm:text-[36px] font-black tracking-[-0.03em] mb-2" style={{ color: "var(--text-primary)" }}>
                What do you love?
              </h1>
              <p className="text-[14px] mb-10" style={{ color: "var(--text-muted)" }}>
                Pick your interests to personalize your feed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {CATEGORY_OPTIONS.map(({ label, icon: Icon, color, bg, border, activeBorder }) => {
                  const isSelected = selectedInterests.includes(label);
                  return (
                    <motion.button
                      key={label}
                      onClick={() => toggleInterest(label)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex flex-col items-center gap-3 px-8 py-7 rounded-[20px] transition-all"
                      style={{
                        background: isSelected ? bg : "rgba(255,255,255,0.03)",
                        border: `2px solid ${isSelected ? activeBorder : "rgba(255,255,255,0.07)"}`,
                        boxShadow: isSelected ? `0 0 32px ${color}28` : "none",
                        backdropFilter: "blur(20px)",
                        minWidth: 140,
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: isSelected ? color : "var(--text-muted)" }} />
                      <span className="text-[14px] font-bold" style={{ color: isSelected ? color : "var(--text-secondary)" }}>
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                onClick={handleContinue}
                disabled={selectedInterests.length === 0}
                whileHover={selectedInterests.length > 0 ? { scale: 1.04, boxShadow: "0 0 28px rgba(6,182,212,0.5)" } : {}}
                whileTap={selectedInterests.length > 0 ? { scale: 0.97 } : {}}
                className="px-10 py-3 rounded-2xl text-white text-[14px] font-bold transition-all"
                style={{
                  background: "var(--brand)",
                  boxShadow: "0 0 20px rgba(6,182,212,0.3)",
                  opacity: selectedInterests.length === 0 ? 0.4 : 1,
                  cursor: selectedInterests.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                Continue
              </motion.button>
            </motion.div>
          ) : (
            /* ── Main feed ── */
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Heading row */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-[10px] font-mono tracking-[0.18em] uppercase mb-1" style={{ color: "var(--brand)" }}>
                    Personalized
                  </p>
                  <h1 className="text-[32px] sm:text-[40px] font-black tracking-[-0.03em] leading-none mb-3" style={{ color: "var(--text-primary)" }}>
                    Your Feed
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>Based on:</span>
                    {interests.map((cat) => {
                      const opt = CATEGORY_OPTIONS.find((o) => o.label === cat);
                      return (
                        <span
                          key={cat}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{
                            background: opt ? `${opt.color}18` : "rgba(255,255,255,0.05)",
                            border: `1px solid ${opt ? `${opt.color}30` : "rgba(255,255,255,0.08)"}`,
                            color: opt?.color ?? "var(--text-secondary)",
                          }}
                        >
                          {cat}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={handleEditInterests}
                  className="px-4 py-2 rounded-xl text-[12px] font-medium transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                  Edit Interests
                </button>
              </div>

              {/* Primary grid */}
              {primaryEvents.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center gap-4">
                  <p className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>No events found for your interests.</p>
                  <button
                    onClick={handleEditInterests}
                    className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--text-secondary)" }}
                  >
                    Edit Interests
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-6 mb-14">
                  {primaryEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))}
                </div>
              )}

              {/* You might also like */}
              {suggestedEvents.length > 0 && (
                <div>
                  <div className="mb-6">
                    <p className="text-[10px] font-mono tracking-[0.12em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                      Explore More
                    </p>
                    <h2 className="text-[22px] font-black tracking-[-0.025em]" style={{ color: "var(--text-primary)" }}>
                      You might also like
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-6">
                    {suggestedEvents.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
