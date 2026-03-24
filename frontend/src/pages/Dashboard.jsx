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
import Loader from '../components/common/Loader';
import { getLocalDateString } from '../utils/date';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(getLocalDateString());

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

        setEmployees(employees);
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

  if (loading) return <Loader />;

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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Monitor your organization's health and activity in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm self-start sm:self-center">
          <Calendar size={16} className="text-primary-500 shrink-0" />
          <input
            type="date"
            className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend */}
        <div className="lg:col-span-8 card-modern p-6">
          <div className="flex items-center justify-between mb-6">
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

          {/* Bar chart */}
          <div className="flex flex-col gap-2">
            {/* Bars */}
            <div className="flex items-end justify-between gap-2 md:gap-3 h-52 px-1">
              {[45, 60, 55, 85, 95, 70, 65].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                  {/* Track */}
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-lg absolute bottom-0 left-0" />
                  {/* Bar */}
                  <div
                    className="relative w-full bg-primary-500/80 hover:bg-primary-500 rounded-lg transition-all duration-500 cursor-pointer"
                    style={{ height: `${h}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity font-bold z-10 whitespace-nowrap pointer-events-none">
                      {h}% Present
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Labels */}
            <div className="flex justify-between gap-2 md:gap-3 px-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day} className="flex-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="lg:col-span-4">
          <div className="card-modern p-6 h-full flex flex-col justify-between overflow-hidden relative">
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

      {/* Recent Employees */}
      <div className="card-modern overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Employees</h3>
            <span className="ml-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full">
              {employees.length}
            </span>
          </div>
          <Link
            to="/employees"
            className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {employees.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500 font-medium">
            No employees found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {employees.slice(0, 5).map((emp) => (
              <div key={emp.employee_id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {(emp.full_name || 'E').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{emp.full_name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{emp.email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-500/10">
                    {emp.department}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {emp.employee_id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {employees.length > 5 && (
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
            <Link
              to="/employees"
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              View all {employees.length} employees <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
