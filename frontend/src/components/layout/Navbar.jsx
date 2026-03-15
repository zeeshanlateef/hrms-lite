import { User, Bell, LogOut, Sun, Moon, LayoutDashboard, Users, CalendarCheck2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { title: 'Dashboard', path: '/', icon: LayoutDashboard },
    { title: 'Employees', path: '/employees', icon: Users },
    { title: 'Attendance', path: '/attendance', icon: CalendarCheck2 },
  ];

  return (
    <nav className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 sticky top-0 z-50 flex items-center justify-between px-8 transition-all duration-500 shadow-sm">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
            <User size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-gray-900 via-primary-600 to-primary-400 dark:from-white dark:via-primary-400 dark:to-primary-600 bg-clip-text text-transparent">HRMS<span className="text-primary-600 dark:text-primary-400">.</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={18} className={isActive ? 'animate-bounce-slow' : 'group-hover:scale-110 transition-transform'} />
                <span className="text-sm">{link.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-slate-800">
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode 
              ? <Sun size={20} className="group-hover:rotate-90 transition-transform duration-500" /> 
              : <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500" />
            }
          </button>

          <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl relative group">
            <Bell size={20} className="group-hover:shake transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </button>
        </div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Super HR</p>
            <p className="text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-black">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/20 cursor-pointer hover:scale-105 transition-transform">
            SH
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
