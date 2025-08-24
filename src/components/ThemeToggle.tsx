'use client';

import React, { useEffect, useState } from 'react';
import { ToggleButton, useTheme } from '@once-ui-system/core';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(
      (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light'
    );
  }, []);

  useEffect(() => {
    setCurrentTheme(
      (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light'
    );
  }, [theme]);

  if (!mounted) return null;

  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

  return (
    <div className="theme-toggle-wrapper">
      <ToggleButton
        onClick={() => setTheme(nextTheme)}
        aria-label={`Switch to ${nextTheme} mode`}
      >
        {/* Center the icon manually */}
        <span className="theme-toggle-icon">
          {currentTheme === 'dark' ? '☀️' : '🌙'}
        </span>
      </ToggleButton>
    </div>
  );
};
