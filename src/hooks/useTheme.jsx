import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [variant, setVariant] = useState("editorial");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-variant", variant);
    document.body.setAttribute("data-dark", String(!!dark));
  }, [variant, dark]);

  return (
    <ThemeContext.Provider value={{ variant, setVariant, dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
