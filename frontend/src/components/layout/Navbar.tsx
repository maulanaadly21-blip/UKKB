import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, LogOut, LayoutDashboard, X, User, Key, ShieldCheck } from 'lucide-react';
import { getImageUrl } from '../../utils/image';
import AppMakerModal from '../common/AppMakerModal';

interface NavbarProps {
  onSearchClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const { user, isAuthenticated, isMember, isAdminSpace, logout, appKey } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navImgError, setNavImgError] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMakerModal, setShowMakerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setNavImgError(false);
  }, [user?.foto_profil, user?.foto]);

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
  const userAvatarUrl = getImageUrl(user?.foto_profil || user?.foto, 'members');

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo - Adly Wangsa */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo-transparent.png"
              alt="Adly Wangsa Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight leading-none">
                Adly <span className="text-[#0F382C]">Wangsa</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                SpaceHub Booking
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link
              to="/"
              className={`transition-colors py-1 relative ${
                isActive('/')
                  ? 'text-[#0F382C] font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0F382C] after:rounded-full'
                  : 'hover:text-slate-900'
              }`}
            >
              Beranda
            </Link>

            <Link
              to="/ruang"
              className={`transition-colors py-1 relative ${
                isActive('/ruang')
                  ? 'text-[#0F382C] font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0F382C] after:rounded-full'
                  : 'hover:text-slate-900'
              }`}
            >
              Ruang
            </Link>

            <Link
              to="/promo"
              className={`transition-colors py-1 relative ${
                isActive('/promo')
                  ? 'text-[#0F382C] font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0F382C] after:rounded-full'
                  : 'hover:text-slate-900'
              }`}
            >
              Promo
            </Link>

            <Link
              to="/tentang"
              className={`transition-colors py-1 relative ${
                isActive('/tentang')
                  ? 'text-[#0F382C] font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0F382C] after:rounded-full'
                  : 'hover:text-slate-900'
              }`}
            >
              Tentang Kami
            </Link>

            {isAuthenticated && isMember && (
              <Link
                to="/reservations"
                className={`transition-colors py-1 relative ${
                  isActive('/reservations')
                    ? 'text-[#0F382C] font-extrabold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0F382C] after:rounded-full'
                    : 'hover:text-slate-900'
                }`}
              >
                E-Ticket Saya
              </Link>
            )}

            {isAuthenticated && isAdminSpace && (
              <Link
                to="/admin/dashboard"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0F382C] bg-[#E6F4F1] hover:bg-[#d5eee9] transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Panel Admin
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* App Maker Key Status Pill */}
            <button
              type="button"
              onClick={() => setShowMakerModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
              title="Kelola App Maker Key (Multi-Tenancy UKK)"
            >
              <Key className="w-3.5 h-3.5 text-[#0F382C]" />
              <span className="font-mono text-[11px] truncate max-w-[100px]">
                {appKey || 'Default Key'}
              </span>
            </button>

            {/* Quick Search Button */}
            <button
              onClick={() => {
                if (onSearchClick) {
                  onSearchClick();
                } else {
                  setShowSearchModal(!showSearchModal);
                }
              }}
              className="p-2.5 text-slate-500 hover:text-[#0F382C] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Cari Ruangan"
            >
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 group cursor-pointer hover:opacity-95 transition-opacity"
                    title="Profil Saya"
                  >
                    {userAvatarUrl && !navImgError ? (
                      <img
                        src={userAvatarUrl}
                        alt={user?.nama || user?.nama_member || 'Avatar'}
                        onError={() => setNavImgError(true)}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#0F382C] text-white font-bold flex items-center justify-center text-sm group-hover:scale-105 transition-transform">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#0F382C] transition-colors">
                        {user?.nama || user?.nama_member || user?.nama_pemilik || user?.username || 'Pengguna'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {user?.role === 'admin_space' ? 'Admin Space' : 'Member'}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors ml-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-bold text-slate-700 hover:text-[#0F382C] px-3 py-2 transition-colors cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate('/register/member')}
                  className="text-sm font-bold text-white bg-[#0F382C] hover:bg-[#0b2b22] px-5 py-2.5 rounded-full shadow-xs hover:shadow transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Search Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-24 px-4 animate-fadeIn">
            <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#0F382C]" /> Cari Ruang Kerja
                </h3>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik nama ruang atau area..."
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0F382C]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#0F382C] hover:bg-[#0b2b22] text-white rounded-xl text-sm font-bold shadow-xs cursor-pointer"
                >
                  Cari
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* App Maker Key Management Modal */}
      <AppMakerModal isOpen={showMakerModal} onClose={() => setShowMakerModal(false)} />
    </>
  );
};

export default Navbar;
