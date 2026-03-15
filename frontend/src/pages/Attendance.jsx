import React, { useState, useEffect } from 'react';
import { Calendar, Filter, CheckCircle2, XCircle, Clock, Check, X, UserCheck, Search, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { getEmployees, getAttendance, markAttendance } from '../services/api';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
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
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!formData.employeeId) return alert('Please select an employee');

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
      alert('Failed to mark attendance: ' + (err.response?.data?.detail || 'Validation error'));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter(record => record.date === filterDate);
  const filteredEmployees = employees.filter(emp => 
    (emp.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24 px-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Calendar size={12} strokeWidth={3} />
          Precision Logging
        </div>
        <h1 className="text-5xl font-black tracking-tight gradient-text">Attendance Desk</h1>
        <p className="text-gray-500 dark:text-slate-400 font-medium max-w-lg">Track and verify daily presence with our high-fidelity logging system.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Attendance Form */}
        <div className="lg:col-span-5 h-fit sticky top-28">
          <div className="card-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center">
                <Clock size={22} strokeWidth={2.5} />
              </div>
              Record Entry
            </h2>

            <form onSubmit={handleMarkAttendance} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Member Identity</label>
                <div className="relative">
                  <select 
                    className="input-premium pl-12 appearance-none"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  >
                    <option value="">Select a member...</option>
                    {employees.map(emp => (
                      <option key={emp.employee_id} value={emp.employee_id}>{emp.full_name} ({emp.employee_id})</option>
                    ))}
                  </select>
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-400" size={18} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Event Date</label>
                <input 
                  type="date" 
                  className="input-premium"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Current Status</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'Present'})}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all duration-500 ${
                      formData.status === 'Present' 
                      ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10 text-green-700 dark:text-green-400 shadow-lg shadow-green-500/10' 
                      : 'border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-gray-400 grayscale hover:grayscale-0'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${formData.status === 'Present' ? 'bg-green-500 text-white animate-bounce-slow' : 'bg-gray-100 dark:bg-slate-800'}`}>
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Present</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'Absent'})}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all duration-500 ${
                      formData.status === 'Absent' 
                      ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10 text-red-700 dark:text-red-400 shadow-lg shadow-red-500/10' 
                      : 'border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-gray-400 grayscale hover:grayscale-0'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${formData.status === 'Absent' ? 'bg-red-500 text-white animate-shake' : 'bg-gray-100 dark:bg-slate-800'}`}>
                      <XCircle size={24} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Absent</span>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-premium btn-premium-primary w-full shadow-2xl h-14 text-base"
                disabled={submitting}
              >
                {submitting ? 'Archiving...' : 'Finalize Record'}
              </button>
            </form>
          </div>
        </div>

        {/* Attendance List */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <h2 className="text-2xl font-black gradient-text">History Log</h2>
            <div className="flex items-center gap-3 group">
              <div className="relative group/input">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 z-10" size={16} />
                <input 
                  type="date" 
                  className="input-premium pl-12 h-10 w-44 text-sm font-bold bg-white dark:bg-slate-900 border-none shadow-sm focus:ring-2 focus:ring-primary-500/20"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card-premium p-0 border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-primary-600 via-primary-300 to-transparent"></div>
            
            {loading ? (
              <div className="py-32 flex justify-center"><Loader /></div>
            ) : filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-800 text-slate-400 text-[11px] font-black uppercase tracking-widest bg-gray-50/10">
                      <th className="px-8 py-5">Full Name</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Auth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                    {filteredRecords.map((record, i) => (
                      <tr key={i} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-all duration-300">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-[10px] font-black">
                              {record.employee_name?.charAt(0)}
                            </div>
                            <span className="text-base font-bold text-gray-900 dark:text-white">{record.employee_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-bold text-gray-500 dark:text-slate-400 font-mono italic">
                            {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            record.status === 'Present' 
                            ? 'bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                            : 'bg-red-100/50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          }`}>
                            {record.status === 'Present' ? <UserCheck size={12} strokeWidth={3} /> : <XCircle size={12} strokeWidth={3} />}
                            {record.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Verified</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-40 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] mx-auto flex items-center justify-center text-gray-200 dark:text-slate-700 mb-8 border-2 border-dashed border-gray-100 dark:border-slate-800">
                  <Clock size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Logs Deteced</h3>
                <p className="text-gray-500 dark:text-slate-400 font-medium">Clear for current selection. Try a different date filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
