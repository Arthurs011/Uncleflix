import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Film, Tv, BookMarked, Search, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/movies', label: 'Movies', icon: Film },
  { to: '/tv', label: 'TV Shows', icon: Tv },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/my-list', label: 'My List', icon: BookMarked },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      {/* ─── TOP NAV BAR ─── */}
      <nav className="fixed top-0 z-50 w-full bg-primary/90 backdrop-blur-md shadow-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-3 md:px-8">
          <div className="flex items-center h-14 md:h-16 gap-3">

            {/* Mobile: Hamburger (left) */}
            <button
              className="md:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/70 border border-white/10 active:scale-90 transition-transform touch-manipulation"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} className="text-white" />
            </button>

            {/* Logo — centered on mobile, left on desktop */}
            <div className="flex-1 flex md:flex-none items-center justify-center md:justify-start">
              <Link to="/" className="flex items-center gap-2 group touch-manipulation">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-accent to-glow flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-base md:text-xl font-black text-primary">U</span>
                </div>
                <span className="text-lg md:text-2xl font-black bg-gradient-to-r from-accent via-glow to-accent bg-clip-text text-transparent">
                  UncleFlix
                </span>
              </Link>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-accent text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={17} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile: Search icon (right) */}
            <button
              className="md:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/70 border border-white/10 active:scale-90 transition-transform touch-manipulation"
              onClick={() => navigate('/search')}
              aria-label="Search"
            >
              <Search size={20} className="text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE SLIDE-OUT DRAWER ─── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 z-[70] w-72 bg-secondary border-r border-white/10 flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <Link to="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-glow flex items-center justify-center">
                    <span className="text-base font-black text-primary">U</span>
                  </div>
                  <span className="text-lg font-black bg-gradient-to-r from-accent via-glow to-accent bg-clip-text text-transparent">
                    UncleFlix
                  </span>
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 active:scale-90 transition-all touch-manipulation"
                  aria-label="Close menu"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all touch-manipulation active:scale-95 ${
                        active
                          ? 'bg-accent text-white shadow-lg shadow-accent/20'
                          : 'text-gray-300 hover:bg-white/8 hover:text-white'
                      }`}
                    >
                      <Icon size={20} strokeWidth={2} />
                      <span className="text-base">{link.label}</span>
                      {active && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-white/10">
                <p className="text-xs text-gray-600 text-center">UncleFlix · Stream Anything</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-primary/95 backdrop-blur-lg border-t border-white/8 pb-safe">
        <div className="flex items-stretch h-14">
          {[
            { to: '/', label: 'Home', icon: Home },
            { to: '/movies', label: 'Movies', icon: Film },
            { to: '/tv', label: 'TV', icon: Tv },
            { to: '/search', label: 'Search', icon: Search },
            { to: '/my-list', label: 'My List', icon: BookMarked },
          ].map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 touch-manipulation transition-all active:scale-90 ${
                  active ? 'text-accent' : 'text-gray-500'
                }`}
              >
                <Icon size={active ? 22 : 20} strokeWidth={active ? 2.5 : 1.8} />
                <span className={`text-[10px] font-medium leading-none ${active ? 'text-accent' : 'text-gray-500'}`}>
                  {link.label}
                </span>
                {active && <div className="absolute bottom-0 h-0.5 w-8 bg-accent rounded-t-full" />}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
