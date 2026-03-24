import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Settings,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: ClipboardCheck },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[60] transition-all duration-300 group w-20 hover:w-64 hidden lg:flex flex-col shadow-xl shadow-slate-200/50 dark:shadow-none">
      {/* Brand Logo Area */}
      <div className="h-20 flex items-center px-6 overflow-hidden border-b border-slate-100 dark:border-slate-800/50">
        <div className="min-w-[32px] h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-600/20">
          H
        </div>
        <span className="ml-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          HRMS<span className="text-primary-600">.</span>Lite
        </span>
      </div>

      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center h-12 rounded-xl transition-all duration-300 relative group/item ${isActive
                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="min-w-[56px] flex items-center justify-center">
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.name}
                </span>

                {/* Active Indicator Pin */}
                <div
                  className={`absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
        <div className="space-y-1">
          <button className="flex items-center h-12 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-300 overflow-hidden group/btn">
            <div className="min-w-[56px] flex items-center justify-center">
              <Settings size={20} />
            </div>
            <span className="font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Settings
            </span>
          </button>
          <button className="flex items-center h-12 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-300 overflow-hidden">
            <div className="min-w-[56px] flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <span className="font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Help Center
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
