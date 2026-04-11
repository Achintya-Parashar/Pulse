"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RiCameraLine, RiLiveLine, RiLoader4Line } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";
import Navbar from "@/components/Navbar";

const inputStyle = {
  width:        "100%",
  background:   "rgba(255,255,255,0.04)",
  border:       "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding:      "10px 14px",
  fontSize:     "14px",
  color:        "var(--text-primary)",
  outline:      "none",
  caretColor:   "var(--brand)",
  transition:   "border-color 0.2s, background 0.2s",
};

const onFocus = (e) => { e.target.style.borderColor = "rgba(6,182,212,0.4)"; e.target.style.background = "rgba(255,255,255,0.06)"; };
const onBlur  = (e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; };

const Label = ({ children }) => (
  <label className="block text-[11px] font-mono tracking-[0.1em] uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>
    {children}
  </label>
);

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-[22px] p-6 sm:p-7 ${className}`}
    style={{
      background:    "rgba(10,15,28,0.82)",
      backdropFilter: "blur(28px)",
      border:        "1px solid rgba(255,255,255,0.07)",
      boxShadow:     "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
    }}
  >
    {children}
  </div>
);

export default function GoLivePage() {
  const router = useRouter();

  const [streamTitle,       setStreamTitle]       = useState("");
  const [streamCategory,    setStreamCategory]    = useState("");
  const [streamTags,        setStreamTags]        = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [showToast,         setShowToast]         = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulse_user");
      if (!stored) router.push("/signin");
    } catch (err) {
      console.warn("Failed to check auth:", err);
      router.push("/signin");
    }
  }, [router]);

  const handleStartStream = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2400);
  };

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)" }}>
      {/* Ambient */}
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb w-[700px] h-[700px] top-[-250px] left-[-200px]"
          style={{ background: "radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 65%)" }} />
        <div className="ambient-orb w-[500px] h-[500px] bottom-[0] right-[-100px]"
          style={{ background: "radial-gradient(circle,rgba(230,57,70,0.05) 0%,transparent 65%)" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.055) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
        }} />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 pt-[86px] pb-20">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 pt-4"
        >
          <p className="text-[10px] font-mono tracking-[0.18em] uppercase mb-1" style={{ color: "var(--brand)" }}>
            Studio
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-black tracking-[-0.03em] leading-none mb-2 gradient-text">
            Go Live
          </h1>
          <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
            Set up your stream below. Broadcasting tools are coming soon.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left: Stream Setup Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 min-w-0"
          >
            <GlassCard>
              <h2 className="text-[16px] font-bold mb-6" style={{ color: "var(--text-primary)" }}>
                Stream Setup
              </h2>

              {/* Title */}
              <div className="mb-4">
                <Label>Stream Title</Label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="Give your stream a title..."
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <Label>Category</Label>
                <select
                  value={streamCategory}
                  onChange={(e) => setStreamCategory(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                >
                  <option value="" style={{ background: "var(--bg)" }}>Select a category</option>
                  <option value="Tech"   style={{ background: "var(--bg)" }}>Tech</option>
                  <option value="Music"  style={{ background: "var(--bg)" }}>Music</option>
                  <option value="Gaming" style={{ background: "var(--bg)" }}>Gaming</option>
                </select>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <Label>Tags</Label>
                <input
                  type="text"
                  value={streamTags}
                  onChange={(e) => setStreamTags(e.target.value)}
                  placeholder="#gaming #live #esports"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <Label>Description</Label>
                <textarea
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  placeholder="Tell viewers what this stream is about..."
                  rows={3}
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Divider */}
              <div className="mb-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

              {/* Start Stream button + toast */}
              <div className="relative">
                <motion.button
                  onClick={handleStartStream}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(6,182,212,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-[14px] font-bold"
                  style={{ background: "var(--brand)", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
                >
                  <RiLiveLine className="w-4 h-4" />
                  Start Stream
                </motion.button>

                <AnimatePresence>
                  {showToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.92 }}
                      transition={{ duration: 0.22 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-[12px] text-white font-medium whitespace-nowrap pointer-events-none"
                      style={{
                        background: "rgba(30,30,48,0.97)",
                        border:     "1px solid rgba(255,255,255,0.1)",
                        boxShadow:  "0 8px 32px rgba(0,0,0,0.5)",
                      }}
                    >
                      Broadcasting tools are coming soon!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>

          {/* ── Right: Preview Panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[400px] flex-shrink-0"
          >
            <GlassCard>
              <h2 className="text-[16px] font-bold mb-5" style={{ color: "var(--text-primary)" }}>
                Preview
              </h2>

              {/* 16:9 preview box */}
              <div
                className="w-full flex flex-col items-center justify-center gap-3 rounded-2xl mb-5"
                style={{
                  aspectRatio: "16/9",
                  background:  "rgba(0,0,0,0.55)",
                  border:      "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <RiCameraLine className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                <p className="text-[12px] text-center font-mono" style={{ color: "var(--text-muted)" }}>
                  Preview will appear here
                </p>
              </div>

              {/* Fake stats */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="stat-badge">Viewers: 0</span>
                  <span className="stat-badge">Duration: 00:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="stat-badge">Bitrate: --</span>
                  <span className="stat-badge" style={{ color: "var(--text-muted)" }}>
                    Status: Offline
                  </span>
                </div>
              </div>

              {/* Info note */}
              <div
                className="flex items-start gap-2 mt-5 p-3 rounded-xl"
                style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.12)" }}
              >
                <HiInformationCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--brand)" }} />
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Live streaming tools are under development. Your setup will be saved when they launch.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
