import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg-page)",
        color: "var(--text-primary)",
      }}
    >
      {/* NAVBAR */}
      <nav
        className="border-b"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/Med.png"
              alt="MedRecords Logo"
              className="w-24 object-contain"
            />
          </Link>

          {/* USER AREA */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className=" rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] shadow-card transition hover:bg-[var(--button-primary-soft)]"
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <div className="hidden sm:block text-right">
              <p
                className="text-sm font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                {user?.name || "User"}
              </p>

              <p
                className="text-xs capitalize"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                {user?.role || "Account"}
              </p>
            </div>

            <button onClick={logout} className="btn-outline">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
