"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import { RiFireLine, RiMicLine, RiGamepadLine, RiCpuLine } from "react-icons/ri";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import HeroBanner from "@/components/HeroBanner";
import { events } from "@/data/events";

const CATEGORIES = ["All", "Tech", "Music", "Gaming"];
const STATUSES = ["All", "Live", "Upcoming", "Ended"];

const catIcons = {
  All:      RiFireLine,
  Trending: RiFireLine,
  Tech:     RiCpuLine,
  Music:    RiMicLine,
  Gaming:   RiGamepadLine,
};

const catAccent = {
  All:      { active: "#06b6d4", activeBg: "rgba(6,182,212,0.13)",   activeGrad: "linear-gradient(135deg, rgba(6,182,212,0.18), rgba(6,182,212,0.08))"   },
  Trending: { active: "#f97316", activeBg: "rgba(249,115,22,0.13)",  activeGrad: "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(249,115,22,0.08))"  },
  Tech:     { active: "#38bdf8", activeBg: "rgba(56,189,248,0.13)",  activeGrad: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(56,189,248,0.08))"  },
  Music:    { active: "#a78bfa", activeBg: "rgba(167,139,250,0.13)", activeGrad: "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(167,139,250,0.08))" },
  Gaming:   { active: "#34d399", activeBg: "rgba(52,211,153,0.13)",  activeGrad: "linear-gradient(135deg, rgba(52,211,153,0.18), rgba(52,211,153,0.08))"  },
};

function Footer() {
  return (
    <footer className="mt-28 pb-10" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 pt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shadow-glow-sm" style={{ background: "rgba(30, 16, 226, 0.46)" }}>
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
            </div>
            <span className="text-[18px] font-bold tracking-[-0.04em] brand-logo">StreamVerse<span className="brand-logo-x">X</span></span>
          </div>
          <div className="flex items-center gap-6 text-[12px]" style={{ color: "var(--text-muted)" }}>
            {["About","Privacy","Terms","Help","Careers"].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors duration-200">{l}</a>
            ))}
          </div>
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>© 2025 StreamVerse X Inc.</p>
        </div>
      </div>
    </footer>
  );
}

function HomeContent() {
  // const [search, setSearch] = useState(""); -> removed
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus,   setActiveStatus]   = useState("All");
  const [trendingSort,   setTrendingSort]   = useState(false);

  const featured = useMemo(() => events.find((e) => e.id === "10") ?? events[0], []);

  const filtered = useMemo(() => {
    let list = [...events];
    if (activeCategory !== "All") list = list.filter((e) => e.category === activeCategory);
    
    if (activeStatus !== "All") {
      const statusMap = { Live: "live", Upcoming: "upcoming", Ended: "ended" };
      list = list.filter((e) => e.status === statusMap[activeStatus]);
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q));
    }
    
    if (trendingSort) {
      const statusOrder = { live: 1, upcoming: 2, ended: 3 };
      list.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }
    return list;
  }, [search, activeCategory, activeStatus, trendingSort]);

  return (
    <div className="min-h-screen relative animated-screen" style={{ background: "var(--bg)" }}>
      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
        {/* Top-left brand cyan orb */}
        <div className="ambient-orb w-[800px] h-[800px] top-[-300px] left-[-200px]"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 65%)" }} />
        {/* Mid-right indigo orb */}
        <div className="ambient-orb w-[600px] h-[600px] top-[20%] right-[-200px]"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)" }} />
        {/* Bottom center subtle blue */}
        <div className="ambient-orb w-[700px] h-[700px] bottom-[-200px] left-[25%]"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 65%)" }} />
        {/* Extra: top-right warm accent */}
        <div className="ambient-orb w-[400px] h-[400px] top-[5%] right-[10%]"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)" }} />
        {/* Fine dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)"
        }} />
        {/* Horizontal scan lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "100% 60px"
        }} />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 pt-[86px] pb-8">

        {/* Hero banner */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <HeroBanner event={featured} />
        </motion.section>

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex items-end justify-between mb-6"
        >
          <div className="flex items-start gap-4">
            {/* Accent bar */}
            <div className="flex flex-col items-center gap-1 mt-1.5">
              <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(to bottom, var(--brand), transparent)" }} />
              <div className="w-1 h-3 rounded-full" style={{ background: "var(--brand)", opacity: 0.3 }} />
            </div>
            <div>
              <p className="text-[10px] font-mono mb-1 tracking-[0.18em] uppercase font-semibold" style={{ color: "var(--brand)" }}>
                Broadcasting Now
              </p>
              <h2 className="text-[26px] sm:text-[32px] font-black tracking-[-0.03em] leading-none" style={{ color: "var(--text-primary)" }}>
                Live &amp; Upcoming
              </h2>
            </div>
          </div>
          <p className="text-[12px] font-mono hidden sm:block pb-1" style={{ color: "var(--text-muted)" }}>
            {events.length} events globally
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="flex flex-col gap-4 mb-8"
        >
          {/* Top Row: Search and Trending Sort */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Trending Sort Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold transition-colors" style={{ color: trendingSort ? "var(--brand)" : "var(--text-secondary)" }}>
              <input
                type="checkbox"
                checked={trendingSort}
                onChange={(e) => setTrendingSort(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: "var(--brand)" }}
              />
              Trending Sort
            </label>
          </div>

          {/* Bottom Row: Category & Status */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const Icon    = catIcons[cat] ?? RiFireLine;
                const accent  = catAccent[cat] ?? catAccent.All;
                const isActive = activeCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
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
            <div className="flex items-center gap-2 flex-wrap">
              {STATUSES.map((status) => {
                const isActive = activeStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
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
          </div>
        </motion.div>

        {/* Result count */}
        <AnimatePresence>
          {(search || activeCategory !== "All") && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-[11px] font-mono mb-5"
              style={{ color: "var(--text-muted)" }}
            >
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} · {activeCategory !== "All" ? activeCategory : "All categories"}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Event grid */}
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
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <HiSearch className="w-7 h-7" style={{ color: "var(--text-muted)" }} />
            </div>
            <h3 className="text-[18px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {search.trim() ? `No events found for '${search}'` : "No results found"}
            </h3>
            <p className="text-[13px] mb-5" style={{ color: "var(--text-secondary)" }}>Try removing search or filters</p>
            <button
              onClick={() => { window.history.replaceState(null, '', '/'); setActiveCategory("All"); setActiveStatus("All"); setTrendingSort(false); }}
              className="px-5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--text-secondary)" }}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}


export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
