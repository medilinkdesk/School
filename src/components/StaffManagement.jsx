import React, { useState, useMemo } from 'react';
import PhotoCaptureInput from './PhotoCaptureInput';
import IdCardRenderer from './IdCardRenderer';
import {
  exportToCsv,
  generateIllustratedAvatar,
  downloadIdCardPng,
} from '../utils/helpers';
import {
  Briefcase,
  UserPlus,
  Search,
  Download,
  CreditCard,
  Edit3,
  Trash2,
  Droplets,
  X,
} from 'lucide-react';

const EMPTY_STAFF = {
  name: '',
  employeeCode: '',
  designation: 'Senior PGT Teacher',
  department: 'Science & STEM',
  qualification: 'M.Sc., B.Ed.',
  experience: '6 Years',
  gender: 'Male',
  dob: '1988-06-15',
  bloodGroup: 'O+',
  phone: '+91 ',
  emergencyPhone: '+91 ',
  email: '',
  address: '',
  joiningDate: new Date().toISOString().split('T')[0],
  salary: 72000,
  status: 'Active',
  photo: '',
};

export default function StaffManagement({
  staff = [],
  settings,
  onCreateStaff,
  onUpdateStaff,
  onDeleteStaff,
  onOpenIdStudio,
}) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState(EMPTY_STAFF);
  const [previewMember, setPreviewMember] = useState(null);

  const filteredStaff = useMemo(() => {
    return staff.filter((m) => {
      const q = search.trim().toLowerCase();
      const matchQ =
        !q ||
        m.name?.toLowerCase().includes(q) ||
        m.id?.toLowerCase().includes(q) ||
        m.employeeCode?.toLowerCase().includes(q) ||
        m.designation?.toLowerCase().includes(q) ||
        m.department?.toLowerCase().includes(q);
      if (!matchQ) return false;
      if (deptFilter !== 'ALL' && m.department !== deptFilter) return false;
      return true;
    });
  }, [staff, search, deptFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(staff.map((s) => s.department).filter(Boolean)));
  }, [staff]);

  const openAddModal = () => {
    const nextIdx = staff.length + 101;
    setEditingStaff(null);
    setFormData({
      ...EMPTY_STAFF,
      employeeCode: `FAC/2026/${nextIdx}`,
      photo: generateIllustratedAvatar(`Faculty ${nextIdx}`, 'Male', 'staff', nextIdx),
    });
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setFormData({ ...member });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      salary: Number(formData.salary) || 65000,
      photo:
        formData.photo ||
        generateIllustratedAvatar(formData.name, formData.gender, 'staff'),
    };
    if (editingStaff) {
      await onUpdateStaff(editingStaff.id, payload);
    } else {
      await onCreateStaff(payload);
    }
    setModalOpen(false);
  };

  const totalMonthlyPayroll = useMemo(
    () => staff.reduce((sum, s) => sum + (Number(s.salary) || 0), 0),
    [staff]
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-600" />
              Faculty & Staff HR Directory ({filteredStaff.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage teachers, HODs, administrative personnel, payroll, and generate official Faculty ID Cards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="text-emerald-700 font-semibold">Monthly Payroll: </span>
              <strong className="text-emerald-950 font-black">
                ₹{totalMonthlyPayroll.toLocaleString('en-IN')}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => exportToCsv('faculty_staff_directory.csv', filteredStaff)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add Faculty / Staff
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by name, employee code, designation, department..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-16 h-20 rounded-xl object-cover border-2 border-indigo-600 shadow-sm shrink-0 bg-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {member.id} • {member.employeeCode}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                      <Droplets className="w-2.5 h-2.5" /> {member.bloodGroup}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-sm mt-1 truncate">
                    {member.name}
                  </h3>
                  <div className="text-xs font-bold text-indigo-700 truncate">
                    {member.designation}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {member.department}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Qualification:</span>
                  <span className="font-bold text-slate-800">{member.qualification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Experience:</span>
                  <span className="font-bold text-slate-800">
                    {member.experience} (Joined {member.joiningDate})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Contact:</span>
                  <span className="font-bold text-slate-800">{member.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Monthly Salary:</span>
                  <span className="font-black text-emerald-700">
                    ₹{Number(member.salary || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPreviewMember(member)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Faculty ID Card
              </button>

              <button
                type="button"
                onClick={() => openEditModal(member)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onDeleteStaff(member.id)}
                className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {previewMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Official Faculty Identity Card
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {previewMember.name} ({previewMember.id})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    downloadIdCardPng({
                      person: previewMember,
                      settings,
                      isStaff: true,
                      template: settings?.defaultCardTemplate || 'royal',
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PNG Card
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = previewMember;
                    setPreviewMember(null);
                    onOpenIdStudio && onOpenIdStudio(target);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  Customize in Studio
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMember(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="py-4 bg-slate-100 rounded-2xl flex justify-center overflow-x-auto">
              <IdCardRenderer
                person={previewMember}
                settings={settings}
                isStaff={true}
                template={settings?.defaultCardTemplate || 'royal'}
                side="both"
              />
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900">
                {editingStaff ? `Edit Faculty — ${editingStaff.name}` : 'Add New Faculty / Staff Member'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <PhotoCaptureInput
                value={formData.photo}
                name={formData.name || 'Faculty'}
                gender={formData.gender}
                role="staff"
                onChange={(photo) => setFormData({ ...formData, photo })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Employee Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeCode: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.qualification}
                    onChange={(e) =>
                      setFormData({ ...formData, qualification: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  {editingStaff ? 'Save Changes' : 'Add Faculty Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
