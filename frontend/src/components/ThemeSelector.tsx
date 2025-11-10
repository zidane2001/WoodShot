import React, { useState, useEffect } from 'react';

const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset"
];

const ThemeSelector: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  return (
   <div className="dropdown dropdown-end">
  <div tabIndex={0} role="button" className="!min-h-[40px] !h-[40px] !w-[40px] !p-3 btn btn-ghost btn-circle">
    <svg className="!w-8 !h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
    </svg>
  </div>
      <ul tabIndex={0} className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box w-52 max-h-64 overflow-y-auto">
        {themes.map((theme) => (
          <li key={theme}>
            <a
              onClick={() => handleThemeChange(theme)}
              className={currentTheme === theme ? 'active' : ''}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary`} data-theme={theme}></div>
                <span className="capitalize">{theme}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSelector;