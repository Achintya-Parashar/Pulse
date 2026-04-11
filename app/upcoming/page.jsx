"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { RiCpuLine, RiMicLine, RiGamepadLine, RiCalendarCheckLine, RiCalendarLine } from "react-icons/ri";
import Navbar from "@/components/Navbar";
import { events } from "@/data/events";

const catColor = {
  Tech:   "#38bdf8",
  Music:  "#a78bfa",
  Gaming: "#34d399",
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function UpcomingPage() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulse_reminders");
      setReminders(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.warn("Failed to read pulse_reminders:", err);
    }
  }, []);

  const toggleReminder = (eventId) => {
    try {
      const updated = reminders.includes(eventId)
        ? reminders.filter((id) => id !== eventId)
        : [...reminders, eventId];
      setReminders(updated);
      localStorage.setItem("pulse_reminders", JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to update pulse_reminders:", err);
    }
  };

  const upcomingEvents = useMemo(() =>
    events
      .filter((e) => e.status === "upcoming")
      .sort((a, b) => new Date(a.date) - new Date(b.date)),
    []
  );

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)" }}>
      {/* Ambient */}
      <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-orb w-[600px] h-[600px] top-[-150px] right-[-150px]"
          style={{ background: "radial-gradient(circle,rgba(167,139,250,0.07) 0%,transparent 65%)" }} />
        <div className="ambient-orb w-[500px] h-[500px] bottom-[10%] left-[-100px]"
          style={{ background: "radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 65%)" }} />
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
          className="mb-10"
        >
          <p className="text-[10px] font-mono tracking-[0.18em] uppercase mb-1" style={{ color: "var(--brand)" }}>
            Schedule
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-black tracking-[-0.03em] leading-none mb-2" style={{ color: "var(--text-primary)" }}>
            Upcoming Events
          </h1>
          <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
            Set a reminder. Never miss a stream.
          </p>
        </motion.div>

        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <p className="text-[16px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No upcoming events</p>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>Check back soon for new streams.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            {upcomingEvents.map((event) => {
              const color     = catColor[event.category] ?? "var(--brand)";
              const isReminded = reminders.includes(event.id);

              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="relative flex overflow-hidden rounded-2xl"
                  style={{
                    background: "rgba(10,15,28,0.8)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                    transition: "box-shadow 0.25s ease, transform 0.25s ease",
                  }}
                  whileHover={{ y: -3, boxShadow: `0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px ${color}30` }}
                >
                  {/* Left accent bar */}
                  <div className="w-1 flex-shrink-0" style={{ background: color }} />

                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 hidden sm:block" style={{ width: 160, height: 90, alignSelf: "center", margin: "12px 0 12px 12px" }}>
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={160}
                      height={90}
                      className="object-cover rounded-xl"
                      style={{ borderRadius: "12px" }}
                    />
                  </div>

                  {/* Middle content */}
                  <div className="flex-1 min-w-0 px-4 py-4 flex flex-col justify-center gap-1.5">
                    {/* Category chip */}
                    <span
                      className="self-start px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: `${color}18`,
                        border: `1px solid ${color}30`,
                        color,
                      }}
                    >
                      {event.category}
                    </span>

                    {/* Title */}
                    <h3 className="font-bold text-[15px] leading-snug" style={{ color: "var(--text-primary)" }}>
                      {event.title}
                    </h3>

                    {/* Host */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-5 h-5 flex-shrink-0 rounded-full overflow-hidden">
                        <Image src={event.hostAvatar} alt={event.host} width={20} height={20} className="object-cover" />
                      </div>
                      <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{event.host}</span>
                    </div>

                    {/* Description */}
                    <p
                      className="text-[12px] leading-relaxed"
                      style={{
                        color: "var(--text-muted)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.description}
                    </p>
                  </div>

                  {/* Right block */}
                  <div className="flex-shrink-0 flex flex-col items-end justify-center gap-3 px-4 py-4" style={{ minWidth: 160 }}>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end mb-0.5">
                        <RiCalendarLine className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                        <span className="text-[12px] font-semibold text-right" style={{ color }}>
                          {event.scheduledFor}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleReminder(event.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                      style={
                        isReminded
                          ? { background: `${color}18`, border: `1px solid ${color}40`, color }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }
                      }
                    >
                      {isReminded
                        ? <><RiCalendarCheckLine className="w-3.5 h-3.5" /> Reminder Set ✓</>
                        : <><RiCalendarLine className="w-3.5 h-3.5" /> Set Reminder</>
                      }
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
}
