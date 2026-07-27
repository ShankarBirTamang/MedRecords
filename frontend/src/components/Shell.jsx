import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeSelector from "./ThemeSelector";

export default function Shell({ children }) {
  const { user, logout } = useAuth();

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
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              src="/medrecords-logo.png"
              alt="MedRecords Logo"
              className="w-10 h-10 object-contain"
            />

            <span
              className="text-xl font-bold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              MedRecords
            </span>
          </Link>

          {/* USER AREA */}
          <div className="flex items-center gap-4">

            <ThemeSelector />

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

            <button
              onClick={logout}
              className="btn-outline"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}