"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiBell, HiMenuAlt3, HiX } from "react-icons/hi";
import { RiLiveLine } from "react-icons/ri";

const navLinks = [
  { label: "Live Now",   href: "/" },
  { label: "Upcoming",  href: "#" },
  { label: "Browse",    href: "#" },
  { label: "For You",   href: "#" },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Live Now");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 navbar-glow-line ${scrolled ? "scrolled" : ""} ${
          scrolled
            ? "glass-card-strong shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[62px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group select-none">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -4 }}
                whileTap={{ scale: 0.93 }}
                className="relative w-8 h-8 rounded-xl bg-brand flex items-center justify-center shadow-glow-sm"
              >
                <RiLiveLine className="w-4 h-4 text-white" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-light live-dot border-2 border-[var(--bg)]" />
              </motion.div>
              <span className="text-[19px] font-black tracking-[-0.04em] gradient-text">PULSE</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = activeLink === link.label;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setActiveLink(link.label)}
                    className="relative px-4 py-2 text-[13.5px] font-medium rounded-xl group"
                    style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}
                  >
                    {link.label}
                    <motion.span
                      className="absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full bg-brand"
                      initial={false}
                      animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                className="hidden sm:flex relative w-9 h-9 rounded-xl items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <HiBell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="hidden sm:flex items-center gap-2 px-4 py-[7px] rounded-xl border border-white/[0.09] text-[13px] font-medium text-[var(--text-secondary)] hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04] transition-all"
              >
                Sign In
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(230,57,70,0.5)" }}
                whileTap={{ scale: 0.96 }}
                className="hidden sm:flex items-center gap-1.5 px-4 py-[7px] rounded-xl bg-brand text-white text-[13px] font-semibold shadow-glow-sm transition-all"
              >
                <RiLiveLine className="w-3.5 h-3.5" />
                Go Live
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden flex w-9 h-9 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen
                    ? <motion.span key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.15 }}><HiX          className="w-5 h-5" /></motion.span>
                    : <motion.span key="men" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><HiMenuAlt3   className="w-5 h-5" /></motion.span>
                  }
                </AnimatePresence>
              </motion.button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[62px] inset-x-0 z-40 glass-card-strong border-b border-white/[0.06] md:hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link
                    href={link.href}
                    onClick={() => { setActiveLink(link.label); setMobileOpen(false); }}
                    className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: activeLink === link.label ? "var(--text-primary)" : "var(--text-secondary)",
                      background: activeLink === link.label ? "rgba(230,57,70,0.08)" : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                <button className="w-full py-2.5 rounded-xl border border-white/[0.09] text-sm font-medium text-[var(--text-secondary)]">Sign In</button>
                <button className="w-full py-2.5 rounded-xl bg-brand text-sm font-semibold text-white">Go Live</button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

