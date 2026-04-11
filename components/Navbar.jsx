"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiBell, HiMenuAlt3, HiX } from "react-icons/hi";
import { RiLiveLine, RiSearchLine, RiUserLine } from "react-icons/ri";
import useAuth from "@/lib/useAuth";

const navLinks = [
  { label: "Live Now", href: "/" },
  { label: "Upcoming", href: "/upcoming" },
  { label: "Browse", href: "/browse" },
  { label: "For You", href: "/for-you" },
];

const dropdownMotion = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
};

const NOTIFICATIONS = [
  { dot: "#00A8E1", text: "TechStream Pro just went live", time: "2m ago" },
  { dot: "#a78bfa", text: "Neon Frequencies festival starts in 1 hour", time: "58m ago" },
  { dot: "#34d399", text: "ESL Pro League Grand Final is starting", time: "3h ago" },
  { dot: "#00A8E1", text: "New events added in Gaming", time: "1d ago" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [navSearch, setNavSearch] = useState("");

  const handleNavSearch = (value) => {
    setNavSearch(value);
    if (pathname === "/") {
      router.push(`/?q=${encodeURIComponent(value)}`, { scroll: false });
    }
  };


  const avatarRef = useRef(null);
  const notifRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Outside-click for avatar dropdown
  useEffect(() => {
    if (!avatarMenuOpen) return;
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [avatarMenuOpen]);

  // Outside-click for notifications dropdown
  useEffect(() => {
    if (!notificationsOpen) return;
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notificationsOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 navbar-glow-line ${scrolled ? "scrolled" : ""} ${scrolled
          ? "glass-card-strong shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[62px]">
            {/* Left section — Logo only */}
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group select-none">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  whileTap={{ scale: 0.93 }}
                  className="relative w-8 h-8 rounded-xl flex items-center justify-center shadow-glow-sm" style={{ background: "rgba(30, 16, 226, 0.46)" }}
                >
                  <RiLiveLine className="w-4 h-4 text-white" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full live-dot border-2 border-[var(--bg)]" style={{ background: "rgba(30, 16, 226, 0.46)" }} />
                </motion.div>
                <span className="text-[19px] font-black tracking-[-0.04em]" style={{ color: "rgba(30, 16, 226, 0.46)" }}>PULSE</span>
              </Link>
            </div>

            {/* Center section — Routes + Search Bar */}
            <div className="hidden md:flex items-center gap-8">
              {/* The 4 route links */}
              <div className="flex items-center gap-6">
                {/* Desktop nav */}
                <nav className="flex items-center gap-0.5">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="relative px-4 py-2 text-base font-medium tracking-wide rounded-xl group"
                        style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}
                      >
                        {link.label}
                        <motion.span
                          className="absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full" style={{ background: "rgba(30, 16, 226, 0.46)" }}
                          initial={false}
                          animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Search Bar - Center */}
              {pathname === "/" && (
                <div className="relative items-center w-[280px]">
                  <RiSearchLine className="absolute left-3 top-2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    type="text"
                    value={navSearch}
                    onChange={(e) => handleNavSearch(e.target.value)}
                    placeholder="Search streams..."
                    className="w-full rounded-full pl-9 pr-9 py-1.5 text-[13px] outline-none transition-all placeholder-[var(--text-muted)] text-white"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(0,168,225,0.4)"; e.target.style.boxShadow = "0 0 12px rgba(255,255,255,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                  />
                  <AnimatePresence>
                    {navSearch && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { handleNavSearch(""); router.push("/", { scroll: false }); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
                      >
                        <HiX className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">

              {/* Bell icon */}
              <div ref={notifRef} className="relative hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => { setNotificationsOpen((o) => !o); setAvatarMenuOpen(false); }}
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <HiBell className="w-[18px] h-[18px]" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "rgba(30, 16, 226, 0.46)" }} />
                </motion.button>

                {/* Notifications dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      {...dropdownMotion}
                      className="absolute right-0 top-[calc(100%+8px)] w-[300px] rounded-[16px] overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.7)] z-50"
                      style={{
                        background: "rgba(10,15,28,0.96)",
                        backdropFilter: "blur(32px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {/* Header */}
                      <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <span className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>
                          Notifications
                        </span>
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/[0.07] transition-all text-[var(--text-muted)] hover:text-white"
                          style={{ fontSize: "16px" }}
                        >
                          ×
                        </button>
                      </div>
                      {/* Items */}
                      {NOTIFICATIONS.map((n, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-all"
                          style={{ borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                        >
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                            style={{ background: n.dot }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                              {n.text}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono flex-shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {n.time}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sign In / Avatar */}
              {!isLoggedIn ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push("/signin")}
                  className="hidden sm:flex items-center gap-2 px-4 py-[7px] rounded-xl border border-white/[0.09] text-[13px] font-medium text-[var(--text-secondary)] hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04] transition-all"
                >
                  Sign In
                </motion.button>
              ) : (
                <div ref={avatarRef} className="relative hidden sm:block">
                  <button
                    onClick={() => { setAvatarMenuOpen((o) => !o); setNotificationsOpen(false); }}
                    style={{
                      background: "rgba(30, 16, 226, 0.46)",
                      color: "#FFFFFF",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "14px",
                      border: "none",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() ?? <RiUserLine />}
                  </button>

                  {/* Avatar dropdown */}
                  <AnimatePresence>
                    {avatarMenuOpen && (
                      <motion.div
                        {...dropdownMotion}
                        className="absolute right-0 top-[calc(100%+8px)] w-[160px] rounded-[14px] overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.7)] z-50"
                        style={{
                          background: "rgba(10,15,28,0.96)",
                          backdropFilter: "blur(32px)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <button
                          onClick={() => { router.push("/profile"); setAvatarMenuOpen(false); }}
                          className="w-full text-left px-4 py-3 text-[13px] hover:bg-white/[0.05] transition-all"
                          style={{ color: "var(--text-secondary)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => { logout(); router.push("/"); setAvatarMenuOpen(false); }}
                          className="w-full text-left px-4 py-3 text-[13px] hover:bg-white/[0.05] transition-all"
                          style={{ color: "rgba(239,68,68,0.75)" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(239,68,68,1)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(239,68,68,0.75)"}
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Go Live */}
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(230,57,70,0.5)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(isLoggedIn ? "/golive" : "/signin")}
                className="hidden sm:flex items-center gap-1.5 px-4 py-[7px] rounded-xl text-white text-[13px] font-semibold shadow-glow-sm transition-all hover:bg-[#0090C0]" style={{ background: "rgba(30, 16, 226, 0.46)" }}
              >
                <RiLiveLine className="w-3.5 h-3.5" />
                Go Live
              </motion.button>

              {/* Mobile hamburger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden flex w-9 h-9 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen
                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><HiX className="w-5 h-5" /></motion.span>
                    : <motion.span key="men" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><HiMenuAlt3 className="w-5 h-5" /></motion.span>
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
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div key={link.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                        background: isActive ? "rgba(230,57,70,0.08)" : "transparent",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Auth section in mobile menu */}
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => { router.push("/signin"); setMobileOpen(false); }}
                      className="w-full py-2.5 rounded-xl border border-white/[0.09] text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { router.push("/signin"); setMobileOpen(false); }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:bg-[#0090C0]" style={{ background: "#00A8E1" }}
                    >
                      Go Live
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { router.push("/profile"); setMobileOpen(false); }}
                      className="w-full py-2.5 rounded-xl border border-white/[0.09] text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => { router.push("/golive"); setMobileOpen(false); }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:bg-[#0090C0]" style={{ background: "#00A8E1" }}
                    >
                      Go Live
                    </button>
                    <button
                      onClick={() => { logout(); router.push("/"); setMobileOpen(false); }}
                      className="w-full py-2.5 rounded-xl border text-sm font-medium transition-all"
                      style={{ borderColor: "rgba(239,68,68,0.25)", color: "rgba(239,68,68,0.8)" }}
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
