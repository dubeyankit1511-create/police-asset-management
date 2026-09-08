import React, { createContext, useContext, useState, useEffect } from 'react';

interface UISettings {
  fontSize: number;
  zoom: number;
  darkMode: boolean;
  setFontSize: (size: number) => void;
  setZoom: (zoom: number) => void;
  toggleDarkMode: () => void;
}

const UIContext = createContext<UISettings>(null!);

export const UISettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSizeState] = useState(15);
  const [zoom, setZoomState] = useState(1);
  const [darkMode, setDarkMode] = useState(true);

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    document.documentElement.style.setProperty('--font-size-base', `${size}px`);
  };

  const setZoom = (z: number) => {
    setZoomState(z);
    (document.documentElement.style as any).zoom = String(z);
  };

  const toggleDarkMode = () => setDarkMode(d => !d);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`);
  }, []);

  return (
    <UIContext.Provider value={{ fontSize, zoom, darkMode, setFontSize, setZoom, toggleDarkMode }}>
      <div style={{ background: darkMode ? undefined : '#f0f4f8', minHeight: '100vh' }}>
        {children}
      </div>
    </UIContext.Provider>
  );
};

export const useUISettings = () => useContext(UIContext);
