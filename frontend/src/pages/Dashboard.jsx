import React, { useEffect, useState } from 'react';
import {
  Users,
  ClipboardCheck,
  UserCheck,
  UserX,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Calendar,
  Layers,
  Activity,
  ArrowRight
} from 'lucide-react';
import { getEmployees, getAttendance, getDashboardStats } from '../services/api';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';

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
          getDashboardStats(filterDate).catch(() => ({
            data: { total_employees: 0, total_attendance: 0, present_today: 0, absent_today: 0 }
          }))
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-12 w-48 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[400px] rounded-2xl" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    </div>
  );

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      colorClass: 'text-blue-500',
      description: 'Active personnel',
      trend: { type: 'up', value: 12 }
    },
    {
      title: 'Total Logs',
      value: stats.totalRecords,
      icon: Layers,
      colorClass: 'text-indigo-500',
      description: 'Historical entries',
      trend: { type: 'up', value: 8 }
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: UserCheck,
      colorClass: 'text-emerald-500',
      description: 'Attendance log',
      trend: { type: 'up', value: 4 }
    },
    {
      title: 'Absent Today',
      value: stats.absentToday,
      icon: UserX,
      colorClass: 'text-rose-500',
      description: 'Missing records',
      trend: { type: 'down', value: 2 }
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Monitor your organization's health and activity in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="pl-3 text-slate-400">
            <Calendar size={18} />
          </div>
          <input
            type="date"
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 dark:text-slate-200 pr-4 outline-none"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Trend */}
        <div className="lg:col-span-8 card-modern p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-primary-500" />
                Attendance Trends
              </h3>
              <p className="text-sm font-medium text-slate-500">Weekly participation report</p>
            </div>
            <Link to="/attendance">
              <Button variant="ghost" size="sm" icon={ArrowRight}>
                View Full
              </Button>
            </Link>
          </div>

          <div className="flex items-end justify-between gap-2 md:gap-4 h-64 px-2 mb-4">
            {[45, 60, 55, 85, 95, 70, 65].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full relative flex items-end justify-center h-full">
                  <div
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 transition-colors"
                    style={{ height: '100%' }}
                  />
                  <div
                    className="absolute bottom-0 w-full bg-primary-600/80 rounded-t-xl transition-all duration-700 group-hover:bg-primary-500 group-hover:shadow-lg group-hover:shadow-primary-500/20"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all font-bold z-10 whitespace-nowrap">
                      {h}% Present
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-modern p-8 h-full flex flex-col justify-between overflow-hidden relative">
            <div className="space-y-8 relative z-10">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={20} className="text-primary-500" />
                  Quick Actions
                </h3>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest text-[10px]">Operations Center</p>
              </div>

              <div className="space-y-3">
                <Link to="/employees" className="block">
                  <Button variant="primary" className="w-full justify-between group" icon={Plus}>
                    Onboard Staff
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/attendance" className="block">
                  <Button variant="secondary" className="w-full justify-between" icon={ClipboardCheck}>
                    Attendance Entry
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-12 p-6 bg-slate-900 dark:bg-slate-800 rounded-2xl text-white overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-400 mb-2">Efficiency Rating</p>
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
