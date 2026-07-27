import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="rounded-md border px-3 py-2 text-sm transition-colors"
      style={{
        color: "var(--text-primary)",
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <option value="light">
        ☀️ Light
      </option>

      <option value="dark">
        🌙 Dark
      </option>

      <option value="system">
        💻 System
      </option>
    </select>
  );
}