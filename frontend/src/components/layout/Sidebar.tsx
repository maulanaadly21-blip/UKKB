import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems: MenuItem[] = [
    { label: 'Dashboard Stats', path: '/admin/dashboard', icon: 'fa-solid fa-gauge-high' },
    { label: 'Manajemen Space', path: '/admin/spaces', icon: 'fa-solid fa-layer-group' },
    { label: 'Kelola Member', path: '/admin/members', icon: 'fa-solid fa-users' },
    { label: 'Kelola Diskon Promo', path: '/admin/discounts', icon: 'fa-solid fa-tag' },
    { label: 'Reservasi & Check-In', path: '/admin/reservations', icon: 'fa-solid fa-calendar-check' },
    { label: 'Profil Coworking Space', path: '/admin/profile', icon: 'fa-solid fa-store' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-zinc-200/80 shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Admin Info Banner */}
        <div className="bg-zinc-950 text-white rounded-2xl p-4 flex items-center gap-3 shadow-md border border-zinc-800">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-red-glow">
            <i className="fa-solid fa-store text-sm"></i>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate font-display">
              {user?.space_owner?.nama_coworking || user?.spaceOwner?.nama_coworking || 'Studio Eleven Admin'}
            </h4>
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
              {user?.username || 'Admin Space'}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-400 px-3 tracking-widest mb-2 font-display">
            Menu Utama Admin
          </p>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                  active
                    ? 'bg-red-600 text-white shadow-red-glow'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <i className={`${item.icon} text-sm ${active ? 'text-white' : 'text-zinc-500'}`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Back & Logout */}
      <div className="space-y-2 pt-4 border-t border-zinc-100">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          Kembali ke Katalog
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-right-from-bracket text-xs"></i>
          Keluar Sesi Admin
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
