'use client';

import { useState } from 'react';

const links = [
  { href: '/#home', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#contact', label: 'Contact' }
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  function toggleTheme() {
    const root = document.documentElement;
    const current =
      root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  }

  return (
    <header className="site-header">
      <div className="wrap nav">
        <a href="/#home" className="brand">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="7" y="7" width="12" height="12" rx="2" stroke="var(--copper)" strokeWidth="1.6" />
            <path
              d="M13 1V6M13 20V25M1 13H6M20 13H25M5 5L8.5 8.5M20.5 20.5L17.5 17.5M5 21L8.5 17.5M20.5 5.5L17.5 8.5"
              stroke="var(--teal)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          Mubaraq Olalekan
        </a>
        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <button
            className="hamburger"
            style={{ borderRadius: '50%', width: 36, height: 36 }}
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title="Toggle theme"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          </button>
          <a href="/#projects" className="btn btn-primary btn-sm">
            View Projects
          </a>
          <button
            className="hamburger"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span style={open ? { transform: 'translateY(7px) rotate(45deg)' } : undefined}></span>
            <span style={open ? { opacity: 0 } : undefined}></span>
            <span style={open ? { transform: 'translateY(-7px) rotate(-45deg)' } : undefined}></span>
          </button>
        </div>
      </div>
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="/#projects" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
          View Projects
        </a>
      </div>
    </header>
  );
}
