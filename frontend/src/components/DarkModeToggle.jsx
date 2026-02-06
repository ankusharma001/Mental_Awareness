import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(() =>
    localStorage.getItem('darkMode') === 'true' ||
    (
      localStorage.getItem('darkMode') === null &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  );
  useEffect(() => {
    document.documentElement.classList.toggle('dark', enabled);
    localStorage.setItem('darkMode', enabled);
  }, [enabled]);

  return (
    <button
      className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 ml-2"
      onClick={() => setEnabled(e => !e)}
      aria-label={enabled ? 'Disable dark mode' : 'Enable dark mode'}
    >
      {enabled ? '🌙 Dark' : '🔆 Light'}
    </button>
  );
}
