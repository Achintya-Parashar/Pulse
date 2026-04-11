"use client";

import { useState, useEffect } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulse_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.warn("Failed to read pulse_user from localStorage:", err);
    }
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem("pulse_user");
    } catch (err) {
      console.warn("Failed to remove pulse_user:", err);
    }
    setUser(null);
    setIsLoggedIn(false);
  };

  return { user, isLoggedIn, logout };
}
