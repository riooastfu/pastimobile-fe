import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { Appearance } from 'react-native';

interface ThemeContextType {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    error: string;
  };
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    primary: '#81b3c9',
    error: '#FF6B6B',
  },
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');

  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    surface: isDark ? '#1E1E1E' : '#F5F5F5',
    text: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#B3B3B3' : '#666666',
    border: isDark ? '#333333' : '#E0E0E0',
    primary: '#81b3c9',
    error: '#FF6B6B',
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);