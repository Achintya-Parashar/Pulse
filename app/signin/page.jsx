"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { RiLoader4Line } from "react-icons/ri";

export default function SignInPage() {
  const router = useRouter();
  const [emailInput,    setEmailInput]    = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [emailError,    setEmailError]    = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading,       setLoading]       = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulse_user");
      if (stored) router.push("/");
    } catch (err) {
      console.warn("Failed to read pulse_user:", err);
    }
  }, [router]);

  const handleSignIn = async () => {
    let valid = true;
    if (!emailInput.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else {
      setEmailError("");
    }
    if (!passwordInput.trim()) {
      setPasswordError("Password is required.");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;

    setLoading(true);
    await new Promise((res) => setTimeout(res, 1200));
    try {
      localStorage.setItem(
        "pulse_user",
        JSON.stringify({
          email:    emailInput,
          name:     emailInput.split("@")[0],
          avatar:   null,
          joinedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.warn("Failed to write pulse_user:", err);
    }
    router.push("/");
  };

  const inputStyle = {
    width:       "100%",
    background:  "rgba(255,255,255,0.04)",
    border:      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding:     "10px 14px",
    fontSize:    "14px",
    color:       "var(--text-primary)",
    outline:     "none",
    caretColor:  "var(--brand)",
    transition:  "border-color 0.2s, background 0.2s",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card-strong w-full max-w-[400px] rounded-[24px] p-8"
        style={{ boxShadow: "0 12px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)" }}
      >
        {/* Wordmark */}
        <div className="text-center mb-6">
          <span className="text-[32px] font-black tracking-[-0.04em] gradient-text">PULSE</span>
        </div>

        {/* Heading */}
        <h1
          className="text-[22px] font-black tracking-[-0.025em] mb-1 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome back
        </h1>
        <p
          className="text-[13px] text-center mb-7"
          style={{ color: "var(--text-muted)" }}
        >
          Sign in to access your personalized stream.
        </p>

        {/* Email */}
        <div className="mb-4">
          <label
            className="block text-[11px] font-mono tracking-[0.1em] uppercase mb-1.5"
            style={{ color: "var(--text-muted)" }}
          >
            Email
          </label>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
            placeholder="your@email.com"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(6,182,212,0.4)";
              e.target.style.background  = "rgba(255,255,255,0.06)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = emailError ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)";
              e.target.style.background  = "rgba(255,255,255,0.04)";
            }}
            disabled={loading}
            autoComplete="email"
          />
          {emailError && (
            <p className="text-[11px] mt-1" style={{ color: "rgba(239,68,68,0.85)" }}>{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            className="block text-[11px] font-mono tracking-[0.1em] uppercase mb-1.5"
            style={{ color: "var(--text-muted)" }}
          >
            Password
          </label>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(""); }}
            placeholder="••••••••"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(6,182,212,0.4)";
              e.target.style.background  = "rgba(255,255,255,0.06)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = passwordError ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)";
              e.target.style.background  = "rgba(255,255,255,0.04)";
            }}
            disabled={loading}
            autoComplete="current-password"
            onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
          />
          {passwordError && (
            <p className="text-[11px] mt-1" style={{ color: "rgba(239,68,68,0.85)" }}>{passwordError}</p>
          )}
        </div>

        {/* Sign In button */}
        <motion.button
          onClick={handleSignIn}
          disabled={loading}
          whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 28px rgba(6,182,212,0.5)" } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-[14px] font-bold transition-all mb-3"
          style={{
            background:  "var(--brand)",
            boxShadow:   "0 0 20px rgba(6,182,212,0.3)",
            opacity:     loading ? 0.7 : 1,
            cursor:      loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}>
              <RiLoader4Line className="w-5 h-5" />
            </motion.div>
          ) : (
            "Sign In"
          )}
        </motion.button>

        {/* Continue as Guest */}
        <button
          onClick={() => router.push("/")}
          className="w-full text-[13px] py-2 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
        >
          Continue as Guest
        </button>

        {/* Bottom line */}
        <p className="text-center text-[11px] mt-5" style={{ color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link
            href="/golive"
            className="font-semibold transition-colors"
            style={{ color: "var(--brand)" }}
          >
            Go Live →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
