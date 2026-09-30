import React from 'react';
import { Shield, LayoutDashboard, Search, FileText, Info, Mail, User as UserIcon, LogOut, ShieldAlert, KeyRound } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchUserRole?: (role: 'admin' | 'user') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  onSwitchUserRole
}) => {
  const baseNavItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'scanner', label: 'Fraud Scanner', icon: Search },
    { id: 'dashboard', label: 'Threat Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  if (user?.role === 'admin') {
    baseNavItems.push({ id: 'admin', label: 'Admin Console', icon: ShieldAlert });
  }

  baseNavItems.push(
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail }
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#040816]/80 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all duration-300">
            <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-slate-100 via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              VeriSafe<span className="text-cyan-400">-AI</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase">
              Fraud Detection
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          {baseNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAdminItem = item.id === 'admin';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? isAdminItem
                      ? 'text-amber-300 bg-gradient-to-r from-amber-600/40 to-yellow-500/20 border border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'text-cyan-300 bg-gradient-to-r from-blue-600/40 to-cyan-500/20 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : isAdminItem
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? (isAdminItem ? 'text-amber-400' : 'text-cyan-400') : (isAdminItem ? 'text-amber-400' : 'text-slate-400')}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Auth State Button & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                    user.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <span className="text-[10px] text-cyan-400/80 font-mono">{user.email}</span>
              </div>

              {/* Quick Role Switcher Button */}
              {onSwitchUserRole && (
                <button
                  onClick={() => onSwitchUserRole(user.role === 'admin' ? 'user' : 'admin')}
                  title={`Switch to ${user.role === 'admin' ? 'Standard User' : 'Admin'} Mode`}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase border transition-all flex items-center gap-1 ${
                    user.role === 'admin'
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Switch to {user.role === 'admin' ? 'User' : 'Admin'}</span>
                </button>
              )}

              <button
                onClick={onLogout}
                title="Logout"
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase text-slate-950 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navbar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-[#040816]/95 gap-2 scrollbar-none">
        {baseNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
