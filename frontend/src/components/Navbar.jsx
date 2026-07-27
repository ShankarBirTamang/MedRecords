import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function shorten(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header
      className="border-b"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* BRAND */}
        <Link to="/" className="flex items-center gap-2">

          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm"
            style={{
              backgroundColor: "var(--button-primary)",
            }}
          >
            M
          </div>

          <span
            className="font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            MedRecords
          </span>

        </Link>


        {/* RIGHT SIDE */}
        <img src="/Med.png" alt="" className="h-12"/>
        {user && (

          <div className="flex items-center gap-4">

            <span
              className="hidden sm:inline text-sm capitalize"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {user.role}
            </span>


            <span
              className="text-sm font-medium"
              style={{
                color: "var(--text-primary)",
              }}
            >
              {user.name}
            </span>


            <span
              className="badge font-mono"
              style={{
                backgroundColor: "var(--button-primary-soft)",
                color: "var(--button-primary)",
              }}
            >
              {shorten(user.walletAddress)}
            </span>


            {/* THEME SELECTOR */}
            <button
              onClick={toggleTheme}
              className="rounded-lg border px-3 py-2 text-sm font-medium transition"
              style={{
                backgroundColor: "var(--bg-page)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              {theme === "dark"
                ? "☀️ Light"
                : "🌙 Dark"}
            </button>


            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="btn-ghost"
            >
              Log out
            </button>

          </div>

        )}

      </div>
    </header>
  );
}