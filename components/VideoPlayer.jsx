"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlay, HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { RiLiveLine, RiFullscreenLine, RiPictureInPictureLine, RiLoader4Line } from "react-icons/ri";

export default function VideoPlayer({ youtubeId, title }) {
  const [started, setStarted] = useState(false);
  const [loaded,  setLoaded]  = useState(false);
  const [muted,   setMuted]   = useState(false);

  const thumbUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white${muted ? "&mute=1" : ""}`;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: "20px",
        background: "#000",
        boxShadow: "0 12px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* 16:9 ratio */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>

        {/* ── Thumbnail / pre-play state ── */}
        <AnimatePresence>
          {!started && (
            <motion.div
              key="thumb"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={() => setStarted(true)}
            >
              {/* Thumbnail */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${thumbUrl})` }}
              />

              {/* Cinematic overlay */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.15) 100%)" }} />
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)" }} />

              {/* LIVE pill */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-bold font-mono tracking-widest"
                style={{ background: "var(--brand)", boxShadow: "0 0 20px rgba(6,182,212,0.55)" }}
              >
                <RiLiveLine className="w-3 h-3" />
                LIVE
              </div>

              {/* Center play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-20 h-20 rounded-full cursor-pointer"
                  style={{
                    background: "rgba(6,182,212,0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 0 60px rgba(6,182,212,0.55), 0 0 120px rgba(6,182,212,0.2)",
                  }}
                >
                  <HiPlay className="w-8 h-8 text-white ml-1" />
                </motion.div>
              </div>

              {/* Bottom info bar */}
              <div className="absolute bottom-0 inset-x-0 px-5 py-4">
                <p className="text-white font-semibold text-sm line-clamp-1 mb-1 drop-shadow-lg">{title}</p>
                <p className="text-white/50 text-xs font-mono">Click to start streaming</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── YouTube iframe ── */}
        {started && (
          <motion.iframe
            key="frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
        )}

        {/* ── Loading spinner ── */}
        {started && !loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
              <RiLoader4Line className="w-8 h-8 text-brand" />
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Control strip (when not started) ── */}
      {!started && (
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStarted(true)}
              className="flex items-center gap-2 text-[12px] font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <HiPlay className="w-4 h-4" /> Play
            </button>
            <button
              onClick={() => setMuted((m) => !m)}
              className="transition-colors"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {muted ? <HiVolumeOff className="w-4 h-4" /> : <HiVolumeUp className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-3" style={{ color: "rgba(255,255,255,0.4)" }}>
            <RiPictureInPictureLine className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <RiFullscreenLine className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
}

