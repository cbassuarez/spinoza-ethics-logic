import { Link, NavLink, Outlet } from 'react-router-dom';
import SpinozaMark from '../components/SpinozaMark';
import { SpinozaHeroSprite } from '../components/SpinozaHeroSprite';
import type { EthicsPart } from '../three/effects/SpinozaDitherEffect';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/corpus', label: 'Corpus' },
  { to: '/ethics/part/1', label: 'Part I' },
  { to: '/graph', label: 'Graph' },
  { to: '/search', label: 'Search' },
  { to: '/about', label: 'About' },
];

const MainLayout = () => {
  const currentPart: EthicsPart = 1;
  const hoveredPart: EthicsPart | null = null;
  const hoveredItemId: string | null = null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-12 w-12">
              <SpinozaMark />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Spinoza corpus</p>
              <h1 className="text-lg font-semibold text-slate-900">Ethics as Formal Logic</h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <SpinozaHeroSprite currentPart={currentPart} hoveredPart={hoveredPart} hoveredItemId={hoveredItemId} />
            <nav className="flex items-center gap-3 text-sm font-medium text-slate-700">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition hover:bg-slate-100 ${
                      isActive ? 'text-slate-900 font-semibold bg-slate-100' : ''
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm text-slate-600 md:px-6">
          <span>Built for thoughtful exploration of Spinoza&apos;s Ethics.</span>
          <Link to="/about" className="underline hover:text-slate-900">
            About this project
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
