import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Tv, BookMarked, Search, X, Menu } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/tv', label: 'TV Shows', icon: Tv },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/my-list', label: 'My List', icon: BookMarked },
  ];

  const NavLink = ({ link }) => {
    const Icon = link.icon;
    const active = isActive(link.to);
    return (
      <Link
        to={link.to}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 touch-manipulation ${
          active
            ? 'bg-accent text-white shadow-glow scale-105'
            : 'hover:bg-accent/20 hover:text-glow text-gray-300 active:scale-95'
        }`}
      >
        <Icon size={22} strokeWidth={2} />
        <span className="font-semibold text-lg">{link.label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-r from-primary via-secondary to-primary backdrop-blur-md shadow-2xl border-b border-accent/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group touch-manipulation"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-accent to-glow flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl md:text-2xl font-black text-primary">U</span>
            </div>
            <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-accent via-glow to-accent bg-clip-text text-transparent drop-shadow-glow">
              UncleFlix
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink key={link.to} link={link} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-secondary/80 border border-accent/30 touch-manipulation active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={28} className="text-glow" />
            ) : (
              <Menu size={28} className="text-glow" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-accent/10 mt-2 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <NavLink key={link.to} link={link} />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
