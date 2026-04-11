"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundContent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center"
      >
        <span className="text-[28px] font-black tracking-[-0.04em] gradient-text mb-6">PULSE</span>

        <p
          className="text-[100px] sm:text-[140px] font-black leading-none tracking-[-0.05em] font-mono gradient-text"
        >
          404
        </p>

        <h1 className="text-[22px] sm:text-[28px] font-black tracking-[-0.025em] mt-4 mb-3" style={{ color: "var(--text-primary)" }}>
          This stream doesn't exist.
        </h1>

        <p className="text-[14px] max-w-[340px] mb-8" style={{ color: "var(--text-muted)" }}>
          The event you're looking for may have ended or never went live.
        </p>

        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-[14px] font-bold transition-all"
          style={{ background: "var(--brand)", boxShadow: "0 0 24px rgba(6,182,212,0.35)" }}
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
