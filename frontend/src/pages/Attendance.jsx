import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Search,
  Users,
  SearchCheck,
  History,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Fingerprint
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { TableSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { getEmployees, getAttendance, markAttendance } from '../services/api';
import { getLocalDateString } from '../utils/date';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(getLocalDateString());
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    employeeId: '',
    date: getLocalDateString(),
    status: 'Present'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, attRes] = await Promise.all([
        getEmployees().catch(() => ({ data: [] })),
        getAttendance().catch(() => ({ data: [] }))
      ]);

      setEmployees(empRes.data || []);
      setRecords(attRes.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Connection failed. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.employeeId) {
      setError('Please select an employee');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        employee_id: formData.employeeId,
        date: formData.date,
        status: formData.status
      };

      const res = await markAttendance(payload);
      const savedRecord = res.data;

      setRecords(prev => {
        const exists = prev.findIndex(r => r.employee_name === savedRecord.employee_name && r.date === savedRecord.date);
        if (exists !== -1) {
          const newRecords = [...prev];
          newRecords[exists] = savedRecord;
          return newRecords;
        }
        return [savedRecord, ...prev];
      });

      setFormData({ ...formData, employeeId: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter(record =>
    record.date === filterDate &&
    (record.employee_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Attendance
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
            Track and manage daily records for your workforce.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Attendance Marking Form */}
        <div className="lg:col-span-4 space-y-5">
          <div className="card-modern p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Fingerprint size={80} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <SearchCheck size={20} className="text-primary-500" />
              Quick Entry
            </h2>

            <form onSubmit={handleMarkAttendance} className="space-y-6">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  Employee
                </label>
                <div className="relative group/select">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/select:text-primary-500 transition-colors" size={18} />
                  <select
                    className="input-modern pl-11 appearance-none cursor-pointer"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  >
                    <option value="">Select a member...</option>
                    {employees.map(emp => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.full_name} ({emp.employee_id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Date"
                type="date"
                icon={Calendar}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 text-center block">
                  Attendance Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Present' })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${formData.status === 'Present'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-slate-100 dark:border-slate-800 text-slate-400'
                      }`}
                  >
                    <CheckCircle2 size={24} />
                    <span className="text-xs font-bold uppercase tracking-wider">Present</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Absent' })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${formData.status === 'Absent'
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        : 'border-slate-100 dark:border-slate-800 text-slate-400'
                      }`}
                  >
                    <XCircle size={24} />
                    <span className="text-xs font-bold uppercase tracking-wider">Absent</span>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={submitting}
                icon={ArrowRight}
              >
                Log Attendance
              </Button>
            </form>
          </div>

          {/* Mini Stats Card */}
          <div className="card-modern p-6 bg-slate-900 dark:bg-slate-800 text-white overflow-hidden relative">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-400">Total Presentation</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-black">
                    {records.filter(r => r.status === 'Present').length}
                  </h4>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingUp size={12} /> Live
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary-400">
                <History size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Records List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card-modern p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Filter logs by name..."
                  className="input-modern pl-11 shadow-none bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
                <Calendar size={14} className="text-primary-500" />
                <input
                  type="date"
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card-modern overflow-hidden">
            {loading ? (
              <div className="p-8">
                <TableSkeleton rows={8} cols={4} />
              </div>
            ) : filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Employee</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {filteredRecords.map((record, i) => (
                      <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs">
                              {record.employee_name?.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">{record.employee_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                            {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${record.status === 'Present'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                            <div className={`w-1 h-1 rounded-full ${record.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              Signed
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={History}
                title="No logs found"
                description={`We couldn't find any attendance logs for ${new Date(filterDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
