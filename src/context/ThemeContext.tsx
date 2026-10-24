import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToThemeConfig, updateThemeConfig, subscribeToBotConfig, updateBotConfig } from '@/src/services/db';

type UIStyle = 'glassmorphism' | 'neon' | 'minimal' | '3d';

interface ThemeState {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  mode: 'dark' | 'light' | 'auto';
  uiStyle: UIStyle;
  fontSize: number;
  animationsEnabled: boolean;
  glowEnabled: boolean;
  soundEnabled: boolean;
  fontFamily: string;
  fontWeight: string;
  lineHeight: number;
  borderRadius: number;
  containerPadding: number;
  glassIntensity: number;
  backgroundStyle: 'stars' | 'neural' | 'dust' | 'void' | 'nebula';
  backgroundSpeed: number;
  backgroundIntensity: number;
  bot: {
    primaryColor: string;
    secondaryColor: string;
    eyeColor: string;
    pattern: 'none' | 'dots' | 'grid' | 'hex';
  };
}

interface ThemeContextType {
  theme: ThemeState;
  updateTheme: (updates: Partial<ThemeState>) => void;
  resetTheme: () => void;
  saveGlobalTheme: () => Promise<void>;
}

const defaultTheme: ThemeState = {
  primaryColor: '#00f2ff', // Cyan Neon
  secondaryColor: '#7000ff', // Purple Neon
  accentColor: '#ff00d4', // Pink Neon
  mode: 'dark',
  uiStyle: 'glassmorphism',
  fontSize: 16,
  animationsEnabled: true,
  glowEnabled: true,
  soundEnabled: true,
  fontFamily: 'Inter',
  fontWeight: '400',
  lineHeight: 1.5,
  borderRadius: 24,
  containerPadding: 24,
  glassIntensity: 5,
  backgroundStyle: 'neural',
  backgroundSpeed: 1,
  backgroundIntensity: 1,
  bot: {
    primaryColor: '#ef4444',
    secondaryColor: '#991b1b',
    eyeColor: '#38bdf8',
    pattern: 'dots'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeState>(() => {
    const saved = localStorage.getItem('aitopia_theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultTheme, ...parsed };
      } catch (e) {
        console.error('Failed to parse theme', e);
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const unsubTheme = subscribeToThemeConfig((config) => {
      setTheme(prev => ({
        ...prev,
        ...config,
        mode: prev.mode,
        soundEnabled: prev.soundEnabled
      }));
    });

    const unsubBot = subscribeToBotConfig((config) => {
      if (config) {
        setTheme(prev => ({
          ...prev,
          bot: { ...prev.bot, ...config }
        }));
      }
    });

    return () => {
      unsubTheme();
      unsubBot();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('aitopia_theme', JSON.stringify(theme));
    localStorage.setItem('aitopia_muted', (!theme.soundEnabled).toString());
    
    // Apply theme variables to root
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--base-font-size', `${theme.fontSize}px`);
    root.style.setProperty('--border-radius', `${theme.borderRadius}px`);
    root.style.setProperty('--container-padding', `${theme.containerPadding}px`);
    root.style.setProperty('--glass-intensity', (theme.glassIntensity / 100).toString());
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--font-weight', theme.fontWeight);
    root.style.setProperty('--line-height', theme.lineHeight.toString());
    
    // Apply UI style class
    const styles = ['glassmorphism', 'neon', 'minimal', '3d'];
    styles.forEach(s => root.classList.remove(`ui-style-${s}`));
    root.classList.add(`ui-style-${theme.uiStyle}`);

    const applyThemeMode = () => {
      if (theme.mode === 'dark') {
        root.classList.add('dark');
      } else if (theme.mode === 'light') {
        root.classList.remove('dark');
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };

    applyThemeMode();

    if (theme.mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        if (e.matches) root.classList.add('dark');
        else root.classList.remove('dark');
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const updateTheme = (updates: Partial<ThemeState>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  const saveGlobalTheme = async () => {
    const { mode, soundEnabled, bot, ...globalConfig } = theme;
    await updateThemeConfig(globalConfig);
    await updateBotConfig(bot);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, saveGlobalTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
