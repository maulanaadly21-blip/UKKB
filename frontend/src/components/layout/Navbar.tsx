import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/image';

interface NavbarProps {
  onSearchClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const { user, isAuthenticated, isMember, isAdminSpace, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navImgError, setNavImgError] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setNavImgError(false);
  }, [user?.foto_profil]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ruang?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchModal(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const userAvatarUrl = getImageUrl(user?.foto_profil);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Studio Eleven / Smart Space */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-display font-extrabold text-lg tracking-wider border border-zinc-800 shadow-md group-hover:scale-105 transition-transform duration-200">
            S<span className="text-red-500">11</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg text-zinc-900 tracking-tight leading-none uppercase">
              Studio<span className="text-red-600">Eleven</span>
            </span>
            <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase mt-1">
              Co-Working Space
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-zinc-600">
          <Link
            to="/"
            className={`transition-colors py-1 relative flex items-center gap-1.5 ${
              isActive('/')
                ? 'text-zinc-900 font-black'
                : 'hover:text-zinc-900'
            }`}
          >
            {isActive('/') && <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>}
            Beranda
          </Link>

          <Link
            to="/ruang"
            className={`transition-colors py-1 relative flex items-center gap-1.5 ${
              isActive('/ruang')
                ? 'text-zinc-900 font-black'
                : 'hover:text-zinc-900'
            }`}
          >
            {isActive('/ruang') && <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>}
            Katalog Ruang
          </Link>

          <Link
            to="/promo"
            className={`transition-colors py-1 relative flex items-center gap-1.5 ${
              isActive('/promo')
                ? 'text-zinc-900 font-black'
                : 'hover:text-zinc-900'
            }`}
          >
            {isActive('/promo') && <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>}
            Promo & Diskon
          </Link>

          <Link
            to="/tentang"
            className={`transition-colors py-1 relative flex items-center gap-1.5 ${
              isActive('/tentang')
                ? 'text-zinc-900 font-black'
                : 'hover:text-zinc-900'
            }`}
          >
            {isActive('/tentang') && <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>}
            Tentang Kami
          </Link>

          {isAuthenticated && isMember && (
            <Link
              to="/reservations"
              className={`transition-colors py-1 relative flex items-center gap-1.5 ${
                isActive('/reservations')
                  ? 'text-zinc-900 font-black'
                  : 'hover:text-zinc-900'
              }`}
            >
              {isActive('/reservations') && <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>}
              E-Ticket Saya
            </Link>
          )}

          {isAuthenticated && isAdminSpace && (
            <Link
              to="/admin/dashboard"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5 border border-red-200/60"
            >
              <i className="fa-solid fa-gauge-high text-xs"></i>
              Panel Admin
            </Link>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => {
              if (onSearchClick) {
                onSearchClick();
              } else {
                setShowSearchModal(!showSearchModal);
              }
            }}
            className="p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
            title="Cari Ruangan"
          >
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 group cursor-pointer hover:opacity-95 transition-opacity"
                  title="Profil Saya"
                >
                  {userAvatarUrl && !navImgError ? (
                    <img
                      src={userAvatarUrl}
                      alt={user?.nama || 'Avatar'}
                      onError={() => setNavImgError(true)}
                      className="w-9 h-9 rounded-full object-cover border border-zinc-300 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-zinc-950 text-white font-bold flex items-center justify-center text-sm group-hover:scale-105 transition-transform border border-zinc-800">
                      <i className="fa-solid fa-user text-xs"></i>
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-zinc-900 leading-tight group-hover:text-red-600 transition-colors">
                      {user?.nama || 'Pengguna'}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                      {user?.role === 'admin_space' ? 'Admin Space' : 'Member'}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-1 cursor-pointer"
                >
                  <i className="fa-solid fa-right-from-bracket text-sm"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-900 px-3 py-2 transition-colors cursor-pointer"
              >
                Masuk
              </button>
              <button
                onClick={() => navigate('/register/member')}
                className="text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-full shadow-red-glow transition-all duration-200 cursor-pointer flex items-center gap-1.5"
              >
                Daftar <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-xs flex items-start justify-center pt-24 px-4 animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2 font-display">
                <i className="fa-solid fa-magnifying-glass text-red-600"></i> Cari Ruang Kerja Studio
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama ruang, meeting room, atau fasilitas..."
                className="flex-1 px-4 py-3 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:border-red-500 font-medium"
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-red-glow cursor-pointer"
              >
                Cari
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
