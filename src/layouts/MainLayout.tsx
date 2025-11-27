import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiArrowUpRight, FiSearch } from 'react-icons/fi';
import SpinozaMark from '../components/SpinozaMark';

const navItems = [
    { to: '/', label: 'Home' },
    { to: '/ethics/part/1', label: 'Parts' },
    { to: '/corpus', label: 'Corpus' },
    { to: '/graph', label: 'Explorer' },
    { to: '/logic', label: 'Method' },
    { to: '/about', label: 'About' },
];

const MainLayout = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('ethics-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    const handler = () => setShrink(window.scrollY > 16);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
    root.style.setProperty('color-scheme', theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem('ethics-theme', theme);
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navClass = useMemo(
    () =>
      `sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-elevated)]/85 backdrop-blur transition-all duration-300 ${
        shrink ? 'shadow-sm' : ''
      }`,
    [shrink],
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className={navClass}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className={`h-12 w-12 transition-all duration-300 ${shrink ? 'scale-90' : ''}`}>
              <SpinozaMark />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--text-muted)]">Ethics / Logic</p>
              <h1 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
                Spinoza Interface
              </h1>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 text-sm font-semibold md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 font-mono tracking-tight transition hover:text-[var(--accent)] ${
                    isActive ? 'underline decoration-[var(--accent)] underline-offset-8' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `flex items-center gap-1 rounded-full px-3 py-2 text-xs font-mono transition hover:text-[var(--accent)] ${
                  isActive ? 'underline decoration-[var(--accent)] underline-offset-8' : ''
                }`
              }
            >
              <FiSearch /> Search
            </NavLink>
          </nav>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] transition hover:border-[var(--accent)]"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] transition hover:border-[var(--accent)] md:hidden"
              onClick={() => setMenuOpen((m) => !m)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2 text-sm font-semibold" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 font-mono transition hover:text-[var(--accent)] ${
                      isActive ? 'bg-[var(--card-tint)] underline decoration-[var(--accent)] underline-offset-6' : ''
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 font-mono transition hover:text-[var(--accent)] ${
                    isActive ? 'bg-[var(--card-tint)] underline decoration-[var(--accent)] underline-offset-6' : ''
                  }`
                }
              >
                Search corpus <FiArrowUpRight className="inline" />
              </NavLink>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-10 md:px-6 md:pt-14">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)]/90 text-[var(--text-muted)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]">
            <span>Work in progress · Ethics / Logic v0.1</span>
            <span className="text-[var(--accent)]">∴</span>
            <span>Interface by Sebastian Suárez</span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/logic" className="underline decoration-dotted decoration-[var(--border)] underline-offset-6 hover:text-[var(--accent)]">
              Method
            </Link>
            <Link to="/about" className="underline decoration-dotted decoration-[var(--border)] underline-offset-6 hover:text-[var(--accent)]">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
