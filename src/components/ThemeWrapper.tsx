import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToThemeConfig } from '@/src/services/db';

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  uiStyle: 'glassmorphism' | 'neon' | 'minimal' | '3d';
  fontSize: number;
  animationsEnabled: boolean;
  glowEnabled: boolean;
  borderRadius: number;
  containerPadding: number;
  glassIntensity: number;
  fontFamily: string;
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#22d3ee',
  secondaryColor: '#a855f7',
  accentColor: '#f43f5e',
  uiStyle: 'glassmorphism',
  fontSize: 16,
  animationsEnabled: true,
  glowEnabled: true,
  borderRadius: 24,
  containerPadding: 24,
  glassIntensity: 5,
  fontFamily: 'Inter'
};

const ThemeContext = createContext<{ theme: ThemeConfig }>({ theme: defaultTheme });

export const useGlobalTheme = () => useContext(ThemeContext);

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  useEffect(() => {
    const unsub = subscribeToThemeConfig((data) => {
      if (data) setTheme({ ...defaultTheme, ...data });
    });
    return unsub;
  }, []);

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--border-radius', `${theme.borderRadius}px`);
    root.style.setProperty('--glass-intensity', `${theme.glassIntensity}/10`);
    
    // You could also apply font family and size here
    root.style.setProperty('font-size', `${theme.fontSize}px`);
    root.style.setProperty('font-family', theme.fontFamily);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div 
        className={cn(
          "min-h-screen bg-[#020203] text-white selection:bg-primary selection:text-black",
          theme.animationsEnabled ? "scroll-smooth" : ""
        )}
        style={{
          '--p-color': theme.primaryColor,
          '--s-color': theme.secondaryColor,
        } as any}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Helper for dynamic classes
import { cn } from '@/src/lib/utils';
