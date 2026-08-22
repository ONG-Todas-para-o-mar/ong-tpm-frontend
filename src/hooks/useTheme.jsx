import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "tpm.theme";

const preferenciaDoSistema = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

const persistido = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
};

export function ThemeProvider({ children }) {
  const salvo = persistido();
  const [variant, setVariant] = useState(salvo?.variant || "editorial");
  const [dark, setDark] = useState(
    typeof salvo?.dark === "boolean" ? salvo.dark : preferenciaDoSistema()
  );

  useEffect(() => {
    document.body.setAttribute("data-variant", variant);
    document.body.setAttribute("data-dark", String(!!dark));
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ variant, dark }));
  }, [variant, dark]);

  const toggleDark = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ variant, setVariant, dark, setDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
