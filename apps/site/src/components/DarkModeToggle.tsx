import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    // The init script always sets either .dark or .light before first paint
    setIsDark(html.classList.contains('dark'));
  }, []);

  function toggle() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('aplica-theme', 'light');
      setIsDark(false);
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      localStorage.setItem('aplica-theme', 'dark');
      setIsDark(true);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.375rem',
        borderRadius: '0.5rem',
        color: 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.15s, background 0.15s',
        lineHeight: 1,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-accent-bg)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}