import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, UserPlus, FileDown, Users, Edit3, Eye, MoreHorizontal, X } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, downloadEmployeesCSV } from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    department: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setEmployees([]); // Don't use mock data anymore
      setError('Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, employee = null) => {
    setModalMode(mode);
    setModalOpen(true);
    setError('');

    if (employee) {
      setSelectedEmployee(employee);
      setFormData({
        employeeId: employee.employee_id,
        fullName: employee.full_name,
        email: employee.email,
        department: employee.department
      });
    } else {
      setSelectedEmployee(null);
      setFormData({ employeeId: '', fullName: '', email: '', department: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'view') return;

    setError('');
    if (!formData.employeeId || !formData.fullName || !formData.email || !formData.department) {
      setError('All fields are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        employee_id: formData.employeeId,
        full_name: formData.fullName,
        email: formData.email,
        department: formData.department
      };

      if (modalMode === 'add') {
        const res = await addEmployee(payload);
        setEmployees(prev => [res.data, ...prev]);
      } else {
        const res = await updateEmployee(formData.employeeId, payload);
        setEmployees(prev => prev.map(emp => emp.employee_id === formData.employeeId ? res.data : emp));
      }

      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to ${modalMode} employee`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee and all their records?')) {
      try {
        await deleteEmployee(id);
        setEmployees(prev => prev.filter(emp => emp.employee_id !== id));
      } catch (err) {
        alert('Deletion failed: ' + (err.response?.data?.detail || 'Unknown error'));
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await downloadEmployeesCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    (emp.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Users size={12} strokeWidth={3} />
            Workforce Management
          </div>
          <h1 className="text-5xl font-black tracking-tight gradient-text">Talent Hub</h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium max-w-lg">Manage your organization's core asset - your people. Modern HR management redefined.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="btn-premium btn-premium-secondary group"
          >
            <FileDown size={20} className="mr-2 group-hover:translate-y-0.5 transition-transform" />
            Export Sync
          </button>
          <button
            onClick={() => handleOpenModal('add')}
            className="btn-premium btn-premium-primary"
          >
            <Plus size={20} className="mr-2" strokeWidth={3} />
            Onboard Talent
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="card-premium overflow-hidden border-0 relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-600 via-primary-400 to-transparent opacity-50"></div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 dark:bg-slate-900/5">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-400" size={20} />
            <input
              type="text"
              placeholder="Search talent by name, ID, or department..."
              className="input-premium pl-14 ring-offset-0 focus:border-primary-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            {filteredEmployees.length} Members Active
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex justify-center"><Loader /></div>
        ) : filteredEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.15em]">
                  <th className="px-8 py-5">ID Code</th>
                  <th className="px-8 py-5">Employee</th>
                  <th className="px-8 py-5">Contact</th>
                  <th className="px-8 py-5">Division</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.employee_id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-900/5 transition-all duration-300">
                    <td className="px-8 py-6 font-mono text-xs font-black text-primary-600 dark:text-primary-400 bg-primary-50/10 dark:bg-primary-900/5">{emp.employee_id}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-primary-600 to-primary-400 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-500">
                          {(emp.full_name || 'E').charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-black text-gray-900 dark:text-white leading-none mb-1">{emp.full_name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">Permanent Staff</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-600 dark:text-slate-300">{emp.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-900/50 shadow-sm">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleOpenModal('view', emp)}
                          className="p-2.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20"
                          title="View Profile"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', emp)}
                          className="p-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit Details"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.employee_id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Offboard"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] text-gray-200 dark:text-slate-700 mb-8 blur-[0.5px]">
              <Users size={48} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Workspace Empty</h3>
            <p className="text-gray-500 dark:text-slate-400 font-medium max-w-xs mx-auto">Time to build the dream team. Start by clicking Onboard Talent above.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'add' ? 'Onboard New Talent' : modalMode === 'edit' ? 'Update Profile' : 'Member Dossier'}
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={() => setModalOpen(false)}
              className="btn-premium btn-premium-secondary"
            >
              {modalMode === 'view' ? 'Close' : 'Discard'}
            </button>
            {modalMode !== 'view' && (
              <button
                onClick={handleSubmit}
                className="btn-premium btn-premium-primary min-w-[140px]"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : modalMode === 'add' ? 'Confirm Onboarding' : 'Save Changes'}
              </button>
            )}
          </div>
        }
      >
        <form id="onboard-form" className="space-y-6 py-4 px-2" onSubmit={handleSubmit}>
          <button type="submit" className="hidden" />
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[1.5rem] flex items-center gap-3 animate-shake">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Unique Identifier</label>
              <input
                placeholder="PRO-2024-001"
                className="input-premium"
                value={formData.employeeId}
                disabled={modalMode !== 'add'}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                readOnly={modalMode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Member Name</label>
              <input
                placeholder="Alex Sterling"
                className="input-premium"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                readOnly={modalMode === 'view'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Official Email Address</label>
            <input
              type="email"
              placeholder="alex@organization.com"
              className="input-premium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              readOnly={modalMode === 'view'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Assigned Division</label>
            <select
              className="input-premium appearance-none"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              disabled={modalMode === 'view'}
            >
              <option value="">Select Division</option>
              {['Engineering', 'Design', 'Marketing', 'Core HR', 'Strategic Sales', 'Executive'].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
