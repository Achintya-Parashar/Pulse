"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPaperAirplane } from "react-icons/hi";
import { RiEmotionLine, RiUserLine } from "react-icons/ri";
import { TbPointFilled } from "react-icons/tb";
import { mockChatMessages, autoMessages } from "@/data/chatMessages";

const EMOJIS = ["🔥","💯","🎉","👏","🚀","❤️","😍","🤯","✨","⚡","👀","🙌"];

export default function ChatBox({ viewerCount }) {
  const [messages,     setMessages]     = useState(mockChatMessages);
  const [input,        setInput]        = useState("");
  const [showEmoji,    setShowEmoji]    = useState(false);
  const [autoIdx,      setAutoIdx]      = useState(0);
  const chatRef    = useRef(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    const chatEl = chatRef.current;
    if (chatEl) {
      chatEl.scrollTo({ top: chatEl.scrollHeight, behavior: "smooth" });
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const t = setInterval(() => {
      const msg = autoMessages[autoIdx % autoMessages.length];
      setMessages((prev) => [
        ...prev.slice(-60),
        { id: Date.now(), ...msg, time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), isNew: true },
      ]);
      setAutoIdx((i) => i + 1);
    }, 3400);
    return () => clearInterval(t);
  }, [autoIdx]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev.slice(-60),
      { id: Date.now(), user: "You", avatar: "Y", color: "var(--brand)", message: t, time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), isNew: true, isSelf: true },
    ]);
    setInput("");
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "rgba(13,13,22,0.85)",
        backdropFilter: "blur(32px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <TbPointFilled className="w-3.5 h-3.5 live-dot" style={{ color: "var(--brand)" }} />
          <span className="text-[13px] font-bold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
            Live Chat
          </span>
        </div>
        <div className="flex items-center gap-1.5 stat-badge">
          <RiUserLine className="w-3 h-3" />
          <span>{viewerCount}</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto chat-scroll px-3 py-3 space-y-0.5 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.isSelf ? 8 : -8, y: 6 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-2.5 py-1.5 px-2 rounded-xl transition-all group/msg"
              style={{
                background: msg.isSelf ? "rgba(6,182,212,0.07)" : "transparent",
                border: msg.isSelf ? "1px solid rgba(6,182,212,0.15)" : "1px solid transparent",
              }}
            >
              {/* Avatar */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5"
                style={{ background: msg.color, fontSize: "9px" }}
              >
                {msg.avatar}
              </div>

              {/* Message content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-[11px] font-semibold" style={{ color: msg.isSelf ? "var(--brand)" : msg.color }}>
                    {msg.user}
                  </span>
                  <span className="text-[9px] font-mono opacity-0 group-hover/msg:opacity-100 transition-opacity" style={{ color: "var(--text-muted)" }}>
                    {msg.time}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed break-words" style={{ color: "rgba(240,240,250,0.75)" }}>
                  {msg.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Emoji tray */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-shrink-0 overflow-hidden"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex flex-wrap gap-1 px-4 py-2.5">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => { setInput((p) => p + e); inputRef.current?.focus(); }}
                  className="text-base hover:scale-125 transition-transform duration-150"
                >
                  {e}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="flex-shrink-0 p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-2xl transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onFocus={() => {}}
        >
          <button
            onClick={() => setShowEmoji((s) => !s)}
            className="flex-shrink-0 transition-colors"
            style={{ color: showEmoji ? "var(--brand)" : "var(--text-muted)" }}
          >
            <RiEmotionLine className="w-4 h-4" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Say something..."
            maxLength={200}
            className="flex-1 bg-transparent text-[12px] outline-none min-w-0"
            style={{ color: "var(--text-primary)", caretColor: "var(--brand)" }}
          />
          <motion.button
            onClick={send}
            disabled={!input.trim()}
            whileHover={input.trim() ? { scale: 1.15 } : {}}
            whileTap={input.trim() ? { scale: 0.88 } : {}}
            className="flex-shrink-0 transition-colors"
            style={{ color: input.trim() ? "var(--brand)" : "var(--text-muted)", cursor: input.trim() ? "pointer" : "not-allowed" }}
          >
            <HiPaperAirplane className="w-4 h-4 rotate-90" />
          </motion.button>
        </div>
        <p className="text-[9.5px] text-center mt-1.5 font-mono" style={{ color: "var(--text-muted)" }}>
          Be respectful · Community guidelines apply
        </p>
      </div>
    </div>
  );
}

