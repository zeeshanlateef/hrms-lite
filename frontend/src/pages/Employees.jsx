import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  UserPlus, 
  FileDown, 
  Users, 
  Edit3, 
  Eye, 
  MoreHorizontal, 
  X,
  Mail,
  Building,
  IdCard,
  Filter,
  Download
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { TableSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
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
      setEmployees([]);
      setError('Connection to server failed. Please check backend.');
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
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
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
      link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
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
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto pb-12">
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Employees
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage your organization's roster and member details.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            icon={Download} 
            size="sm"
            onClick={handleExportCSV}
            className="hidden sm:flex"
          >
            Export CSV
          </Button>
          <Button 
            variant="primary" 
            icon={Plus} 
            size="sm"
            onClick={() => handleOpenModal('add')}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-modern p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name, ID, or division..."
              className="input-modern pl-11 shadow-none bg-white dark:bg-slate-950"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Users size={14} className="text-primary-500" />
              {filteredEmployees.length} Total
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card-modern overflow-hidden">
        {loading ? (
          <div className="p-8">
            <TableSkeleton rows={8} cols={5} />
          </div>
        ) : filteredEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Division</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.employee_id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-md">
                        {emp.employee_id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                          {(emp.full_name || 'E').charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{emp.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {emp.email}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-500/10">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Eye} 
                          onClick={() => handleOpenModal('view', emp)}
                          title="View Info"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Edit3} 
                          onClick={() => handleOpenModal('edit', emp)}
                          title="Edit"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Trash2} 
                          onClick={() => handleDelete(emp.employee_id)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          title="Remove"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            icon={Users}
            title={searchTerm ? "No results found" : "Your team is empty"}
            description={searchTerm ? `We couldn't find any employees matching "${searchTerm}"` : "Start building your team by adding your first employee."}
            action={!searchTerm && (
              <Button variant="primary" icon={Plus} onClick={() => handleOpenModal('add')}>
                Add Employee
              </Button>
            )}
          />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'add' ? 'Onboard Staff' : modalMode === 'edit' ? 'Update Profile' : 'Member Details'}
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                loading={submitting}
              >
                {modalMode === 'add' ? 'Add Employee' : 'Save Changes'}
              </Button>
            )}
          </div>
        }
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-semibold animate-shake">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Employee ID"
              placeholder="e.g. EMP001"
              icon={IdCard}
              value={formData.employeeId}
              disabled={modalMode !== 'add'}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
              readOnly={modalMode === 'view'}
            />
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              icon={Users}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              readOnly={modalMode === 'view'}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. john@company.com"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            readOnly={modalMode === 'view'}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Division
            </label>
            <div className="relative group">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              <select
                className="input-modern pl-11 appearance-none cursor-pointer"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={modalMode === 'view'}
              >
                <option value="">Select Division</option>
                {['Engineering', 'Design', 'Marketing', 'Core HR', 'Sales', 'Executive'].map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
