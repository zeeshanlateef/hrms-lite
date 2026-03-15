import React, { useEffect, useState } from 'react';
import { Users, ClipboardCheck, UserCheck, UserX, ArrowUpRight, TrendingUp, Plus, FileDown, CheckCircle2, Activity, Calendar, Zap } from 'lucide-react';
import { getEmployees, getAttendance, getDashboardStats } from '../services/api';
import Loader from '../components/common/Loader';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [empRes, attRes, statsRes] = await Promise.all([
          getEmployees().catch(() => ({ data: [] })),
          getAttendance().catch(() => ({ data: [] })),
          getDashboardStats(filterDate).catch(() => ({ data: { total_employees: 0, total_attendance: 0, present_today: 0, absent_today: 0 } }))
        ]);

        const employees = empRes.data || [];
        const attendance = attRes.data || [];
        const dashboardStats = statsRes.data;

        setStats({
          totalEmployees: dashboardStats.total_employees || employees.length || 0,
          totalRecords: dashboardStats.total_attendance || attendance.length || 0,
          presentToday: dashboardStats.present_today || 0,
          absentToday: dashboardStats.absent_today || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filterDate]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader />
    </div>
  );

  const statCards = [
    { title: 'Active Talent', value: stats.totalEmployees, icon: Users, color: 'from-blue-600 to-primary-400', label: 'Organization' },
    { title: 'Logs Processed', value: stats.totalRecords, icon: ClipboardCheck, color: 'from-purple-600 to-indigo-400', label: 'Total Records' },
    { title: 'Present Today', value: stats.presentToday, icon: UserCheck, color: 'from-emerald-600 to-teal-400', label: 'Presence' },
    { title: 'Absent Today', value: stats.absentToday, icon: UserX, color: 'from-rose-600 to-orange-400', label: 'Exceptions' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap size={12} fill="currentColor" />
            Executive Summary
          </div>
          <h1 className="text-5xl font-black tracking-tighter gradient-text">HR Overview</h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium max-w-lg">Strategic workforce insights and real-time operational metrics for your organization.</p>
        </div>

        <div className="flex items-center p-1.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 rounded-[1.5rem] shadow-xl group">
          <div className="p-2.5 text-primary-600 dark:text-primary-400">
            <Calendar size={20} strokeWidth={2.5} />
          </div>
          <input
            type="date"
            className="bg-transparent border-none focus:ring-0 text-sm font-black text-gray-900 dark:text-gray-100 pr-4 cursor-pointer"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="card-premium group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{card.label}</span>
                <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                  <TrendingUp size={12} /> +12%
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">{card.title}</h4>
              <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{card.value}</p>
            </div>
            <div className="mt-6 h-1 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${card.color} w-[70%]`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-8 card-premium flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Trend Analysis</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Participation • Weekly</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 text-sm font-black text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-slate-700 hover:bg-white transition-all shadow-sm">
              Full Report <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="flex-1 flex items-end justify-between gap-3 md:gap-6 px-4">
            {[45, 60, 55, 85, 95, 70, 65].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full relative flex items-end justify-center h-56">
                  {/* Ghost bar */}
                  <div className="absolute inset-0 w-full bg-primary-500/5 rounded-2xl"></div>
                  {/* Active bar */}
                  <div
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-2xl relative transition-all duration-700 ease-out group-hover:shadow-[0_0_30px_rgba(2,109,198,0.3)] cursor-pointer"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all font-black shadow-2xl z-10">
                      {h}%
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Week {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <div className="lg:col-span-4 space-y-8">
          <div className="card-premium h-full relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Action Center</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Immediate Executive Tasks</p>
              </div>

              <div className="space-y-4">
                <a href="/employees" className="flex items-center justify-between p-5 bg-primary-600 text-white rounded-[1.5rem] hover:shadow-xl hover:shadow-primary-500/30 transition-all group overflow-hidden relative">
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Plus size={20} strokeWidth={3} />
                    </div>
                    <span className="font-black tracking-tight">Onboard Member</span>
                  </div>
                  <ArrowUpRight size={20} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                </a>

                <a href="/attendance" className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border-2 border-primary-100 dark:border-primary-900/30 text-gray-900 dark:text-white rounded-[1.5rem] hover:border-primary-500 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                      <CheckCircle2 size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-black tracking-tight">Log Attendance</span>
                  </div>
                  <ArrowUpRight size={20} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>

                <button onClick={() => window.print()} className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 text-gray-400 rounded-[1.5rem] hover:bg-gray-50 dark:hover:bg-slate-900 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                      <FileDown size={20} />
                    </div>
                    <span className="font-bold text-sm">System Report</span>
                  </div>
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-br from-gray-900 to-slate-800 rounded-[2rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-2">Efficiency Rating</p>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-4xl font-black tracking-tighter">94.2%</span>
                  <span className="text-xs font-bold text-emerald-400 mb-1.5">+2.4 pts</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 w-[94.2%] group-hover:w-full transition-all duration-1000"></div>
                </div>
              </div>
              <Activity className="absolute bottom-0 right-0 text-white/5 w-32 h-32 -mb-8 -mr-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
