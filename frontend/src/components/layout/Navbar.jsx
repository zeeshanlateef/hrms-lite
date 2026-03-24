import React from 'react';
import { Bell, Sun, Moon, Search, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/employees') return 'Employee Management';
    if (path === '/attendance') return 'Attendance Tracking';
    return 'HRMS Lite';
  };

  return (
    <nav className="h-20 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
            Welcome back, Super Admin
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center relative group">
          <Search className="absolute left-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search records..."
            className="w-64 h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 border-x border-slate-200 dark:border-slate-800">
          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group"
            title={isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
          >
            {isDarkMode
              ? <Sun size={20} className="group-hover:rotate-45 transition-transform" />
              : <Moon size={20} className="group-hover:-rotate-12 transition-transform" />
            }
          </button>

          <button className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative group">
            <Bell size={20} className="group-hover:animate-swing transition-transform" />
            <span className="absolute top-2.5 right-3 w-2 h-2 bg-primary-500 border-2 border-white dark:border-[#020617] rounded-full"></span>
          </button>
        </div>

        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/20 cursor-pointer hover:scale-105 transition-transform">
            SA
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
