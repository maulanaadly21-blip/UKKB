import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Layers, Tag, CalendarCheck, Users, Store, LogOut, ArrowLeft, LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems: MenuItem[] = [
    { label: 'Dashboard Stats', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manajemen Space', path: '/admin/spaces', icon: Layers },
    { label: 'Kelola Member', path: '/admin/members', icon: Users },
    { label: 'Kelola Diskon Promo', path: '/admin/discounts', icon: Tag },
    { label: 'Reservasi & Check-In', path: '/admin/reservations', icon: CalendarCheck },
    { label: 'Profil Coworking Space', path: '/admin/profile', icon: Store }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Admin Info Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {user?.space_owner?.nama_coworking || user?.spaceOwner?.nama_coworking || 'Smart Space Admin'}
            </h4>
            <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
              {user?.username || 'Admin Space'}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 px-3 tracking-widest mb-2">
            Menu Utama Admin
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-emerald-700 text-white shadow-emerald-glow'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Back & Logout */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Keluar Sesi Admin
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
