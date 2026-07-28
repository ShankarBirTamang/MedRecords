import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--bg-page", "#020617");
      root.style.setProperty("--bg-card", "#0f172a");
      root.style.setProperty("--bg-input", "#1e293b");

      root.style.setProperty("--text-primary", "#f8fafc");
      root.style.setProperty("--text-secondary", "#94a3b8");

      root.style.setProperty("--border-color", "#334155");

      root.style.setProperty("--button-primary", "#3b82f6");
      root.style.setProperty("--button-primary-hover", "#2563eb");
      root.style.setProperty("--button-primary-soft", "#1e3a8a");
    } else {
      root.style.setProperty("--bg-page", "#f8fafc");
      root.style.setProperty("--bg-card", "#ffffff");
      root.style.setProperty("--bg-input", "#ffffff");

      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#64748b");

      root.style.setProperty("--border-color", "#e2e8f0");

      root.style.setProperty("--button-primary", "#2563eb");
      root.style.setProperty("--button-primary-hover", "#1d4ed8");
      root.style.setProperty("--button-primary-soft", "#eff6ff");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}