import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('chefqueue_theme') === 'dark');
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('chefqueue_theme_color') || 'orange');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('chefqueue_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('chefqueue_theme_color', themeColor);
  }, [themeColor]);

  const toggleDarkMode = useCallback(() => setDarkMode((v) => !v), []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
