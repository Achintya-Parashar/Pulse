"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiX } from "react-icons/hi";
import { RiFireLine, RiMicLine, RiGamepadLine, RiCpuLine } from "react-icons/ri";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";

const CATEGORIES = ["All", "Tech", "Music", "Gaming"];
const STATUSES   = ["All Status", "Live Now", "Upcoming", "Ended"];

const catIcons = { All: RiFireLine, Tech: RiCpuLine, Music: RiMicLine, Gaming: RiGamepadLine };
const catAccent = {
  All:    { active: "#06b6d4", activeBg: "rgba(6,182,212,0.13)",   activeGrad: "linear-gradient(135deg,rgba(6,182,212,0.18),rgba(6,182,212,0.08))"   },
  Tech:   { active: "#38bdf8", activeBg: "rgba(56,189,248,0.13)",  activeGrad: "linear-gradient(135deg,rgba(56,189,248,0.18),rgba(56,189,248,0.08))"  },
  Music:  { active: "#a78bfa", activeBg: "rgba(167,139,250,0.13)", activeGrad: "linear-gradient(135deg,rgba(167,139,250,0.18),rgba(167,139,250,0.08))" },
  Gaming: { active: "#34d399", activeBg: "rgba(52,211,153,0.13)",  activeGrad: "linear-gradient(135deg,rgba(52,211,153,0.18),rgba(52,211,153,0.08))"  },
};

const statusMap = { "Live Now": "live", "Upcoming": "upcoming", "Ended": "ended" };

const liveCount = events.filter((e) => e.status === "live").length;

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus,   setSelectedStatus]   = useState("All Status");
  const [searchQuery,      setSearchQuery]       = useState("");

  const filtered = useMemo(() => {
    let list = [...events];
    if (selectedCategory !== "All") list = list.filter((e) => e.category === selectedCategory);
    if (selectedStatus   !== "All Status") list = list.filter((e) => e.status === statusMap[selectedStatus]);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) =>
        e.title.toLowerCase().includes(q)    ||
        e.category.toLowerCase().includes(q) ||
        e.host.toLowerCase().includes(q)     ||
        e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, selectedStatus, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedStatus("All Status");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)" }}>
      {/* Ambient orbs */}
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb w-[700px] h-[700px] top-[-200px] left-[-200px]"
          style={{ background: "radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 65%)" }} />
        <div className="ambient-orb w-[500px] h-[500px] top-[30%] right-[-150px]"
          style={{ background: "radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 65%)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.055) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
        }} />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 pt-[86px] pb-16">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <p className="text-[10px] font-mono tracking-[0.18em] uppercase mb-1" style={{ color: "var(--brand)" }}>
            Discover
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-black tracking-[-0.03em] leading-none mb-2" style={{ color: "var(--text-primary)" }}>
            Browse Streams
          </h1>
          <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
            Discover live events, concerts, and more.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex flex-wrap items-center gap-2.5 mb-8"
        >
          {[
            { label: `${events.length} Events` },
            { label: "3 Categories" },
            { label: `Live Now: ${liveCount}` },
          ].map(({ label }) => (
            <span key={label} className="stat-badge">{label}</span>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="flex flex-col gap-3 mb-3"
        >
          {/* Search */}
          <div className="relative max-w-[340px]">
            <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, artists, hosts..."
              className="w-full rounded-2xl pl-10 pr-9 py-2.5 text-[13px] outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--text-primary)",
                caretColor: "var(--brand)",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(6,182,212,0.4)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <HiX className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const Icon    = catIcons[cat] ?? RiFireLine;
              const accent  = catAccent[cat] ?? catAccent.All;
              const isActive = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[13px] font-semibold transition-all"
                  style={{
                    background: isActive ? accent.activeGrad : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isActive ? accent.active + "50" : "rgba(255,255,255,0.07)"}`,
                    color: isActive ? accent.active : "var(--text-secondary)",
                    boxShadow: isActive ? `0 0 24px ${accent.active}25, inset 0 1px 0 ${accent.active}20` : "none",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat}
                </motion.button>
              );
            })}
          </div>

          {/* Status pills */}
          <div className="flex flex-wrap items-center gap-2">
            {STATUSES.map((status) => {
              const isActive = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className="px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all"
                  style={{
                    background: isActive ? "rgba(6,182,212,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.06)"}`,
                    color: isActive ? "var(--brand)" : "var(--text-muted)",
                  }}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Result count */}
        <p className="text-[11px] font-mono mb-6" style={{ color: "var(--text-muted)" }}>
          Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-6">
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <HiSearch className="w-7 h-7" style={{ color: "var(--text-muted)" }} />
            </div>
            <h3 className="text-[18px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>No results found</h3>
            <p className="text-[13px] mb-5" style={{ color: "var(--text-secondary)" }}>Try a different search or filter</p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--text-secondary)" }}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
