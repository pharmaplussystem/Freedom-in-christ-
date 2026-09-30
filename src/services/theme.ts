import { AppSettings } from '../types';

export function applyTheme(theme: AppSettings['theme']) {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  } else if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    // Default dark
    root.classList.remove('light');
    root.classList.add('dark');
  }
}
