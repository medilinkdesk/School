import React, { useState, useMemo } from 'react';
import PhotoCaptureInput from './PhotoCaptureInput';
import IdCardRenderer from './IdCardRenderer';
import {
  exportToCsv,
  generateIllustratedAvatar,
  downloadIdCardPng,
} from '../utils/helpers';
import {
  UserPlus,
  Search,
  Download,
  CreditCard,
  Edit3,
  Trash2,
  X,
  Phone,
  Droplets,
  GraduationCap,
} from 'lucide-react';

const EMPTY_STUDENT = {
  name: '',
  admissionNo: '',
  rollNo: '',
  className: '10',
  section: 'A',
  stream: 'Science / STEM',
  gender: 'Male',
  dob: '2011-05-15',
  bloodGroup: 'O+',
  fatherName: '',
  motherName: '',
  phone: '+91 ',
  emergencyPhone: '+91 ',
  email: '',
  address: '',
  house: 'Phoenix Red',
  busRoute: 'Route 01 - Main Campus Shuttle',
  admissionDate: new Date().toISOString().split('T')[0],
  status: 'Active',
  medicalNotes: 'None',
  photo: '',
};

export default function StudentManagement({
  students = [],
  settings,
  onCreateStudent,
  onUpdateStudent,
  onDeleteStudent,
  onOpenIdStudio,
}) {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [houseFilter, setHouseFilter] = useState('ALL');
  const [bloodFilter, setBloodFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState(EMPTY_STUDENT);
  const [previewStudent, setPreviewStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = search.trim().toLowerCase();
      const matchQ =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q) ||
        s.rollNo?.toLowerCase().includes(q) ||
        s.admissionNo?.toLowerCase().includes(q) ||
        s.fatherName?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q);

      if (!matchQ) return false;
      if (classFilter !== 'ALL' && String(s.className) !== classFilter) return false;
      if (houseFilter !== 'ALL' && s.house !== houseFilter) return false;
      if (bloodFilter !== 'ALL' && s.bloodGroup !== bloodFilter) return false;
      return true;
    });
  }, [students, search, classFilter, houseFilter, bloodFilter]);

  const openAddModal = () => {
    const nextIdx = students.length + 1;
    setEditingStudent(null);
    setFormData({
      ...EMPTY_STUDENT,
      admissionNo: `ADM/2026/${String(nextIdx).padStart(3, '0')}`,
      rollNo: String(1000 + nextIdx),
      photo: generateIllustratedAvatar(`Student ${nextIdx}`, 'Male', 'student', nextIdx),
    });
    setModalOpen(true);
  };

  const openEditModal = (stu) => {
    setEditingStudent(stu);
    setFormData({ ...stu });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      photo:
        formData.photo ||
        generateIllustratedAvatar(formData.name, formData.gender, 'student'),
    };
    if (editingStudent) {
      await onUpdateStudent(editingStudent.id, payload);
    } else {
      await onCreateStudent(payload);
    }
    setModalOpen(false);
  };

  const houseColors = {
    'Phoenix Red': 'bg-rose-50 text-rose-700 border-rose-200',
    'Titan Blue': 'bg-blue-50 text-blue-700 border-blue-200',
    'Emerald Green': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Solar Gold': 'bg-amber-50 text-amber-800 border-amber-200',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
              Student Admissions & Directory ({filteredStudents.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage student admissions, guardian records, transport routes, photos, and instant ID card generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => exportToCsv('students_directory.csv', filteredStudents)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              <UserPlus className="w-4 h-4" />
              New Student Admission
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, ID, roll no, father's name, phone..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Classes</option>
            {['12', '11', '10', '9', '8', '7', '6', '5'].map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Houses</option>
            <option value="Phoenix Red">Phoenix Red</option>
            <option value="Titan Blue">Titan Blue</option>
            <option value="Emerald Green">Emerald Green</option>
            <option value="Solar Gold">Solar Gold</option>
          </select>

          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Blood Groups</option>
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
              <option key={bg} value={bg}>
                Blood Group {bg}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Student & Admission</th>
                <th className="py-3.5 px-4">Class & Roll</th>
                <th className="py-3.5 px-4">Guardian & Contact</th>
                <th className="py-3.5 px-4">Blood & House</th>
                <th className="py-3.5 px-4">Transport / Bus</th>
                <th className="py-3.5 px-4 text-right">Actions & ID Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={stu.photo}
                        alt={stu.name}
                        className="w-11 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-100"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {stu.name}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span className="text-indigo-600 font-bold">{stu.id}</span>
                          <span>•</span>
                          <span>{stu.admissionNo}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          DOB: {stu.dob} • {stu.gender}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-extrabold text-xs">
                      Class {stu.className} - {stu.section}
                    </span>
                    <div className="text-[11px] text-slate-500 font-semibold mt-1">
                      Roll No: <strong className="text-slate-800">#{stu.rollNo}</strong>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{stu.fatherName}</div>
                    <div className="text-[11px] text-slate-500">
                      Mother: {stu.motherName}
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {stu.phone}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-black text-[11px]">
                        <Droplets className="w-3 h-3" /> {stu.bloodGroup}
                      </span>
                    </div>
                    <span
                      className={`inline-block mt-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold ${
                        houseColors[stu.house] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {stu.house}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-xs font-semibold text-slate-700 max-w-[180px] truncate">
                      {stu.busRoute}
                    </div>
                    <div className="text-[11px] text-slate-400 max-w-[180px] truncate mt-0.5">
                      {stu.address}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewStudent(stu)}
                        title="Instant ID Card & Profile Preview"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        ID Card
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(stu)}
                        title="Edit Student"
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteStudent(stu.id)}
                        title="Delete Student"
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No students match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {previewStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Student Identity Card & 360° Profile
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {previewStudent.name} ({previewStudent.id})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    downloadIdCardPng({
                      person: previewStudent,
                      settings,
                      isStaff: false,
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
                    const target = previewStudent;
                    setPreviewStudent(null);
                    onOpenIdStudio && onOpenIdStudio(target);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  Open in Full Studio
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewStudent(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="py-4 bg-slate-100 rounded-2xl flex justify-center overflow-x-auto">
              <IdCardRenderer
                person={previewStudent}
                settings={settings}
                isStaff={false}
                template={settings?.defaultCardTemplate || 'royal'}
                side="both"
              />
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingStudent
                    ? `Edit Student Profile — ${editingStudent.name}`
                    : 'New Student Admission & ID Registration'}
                </h3>
                <p className="text-xs text-slate-500">
                  All details entered here automatically sync with the ID Card Generator, Exam Portal, and Fee Ledger.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <PhotoCaptureInput
                value={formData.photo}
                name={formData.name || 'New Student'}
                gender={formData.gender}
                role="student"
                onChange={(photo) => setFormData({ ...formData, photo })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Vikramaditya Verma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.admissionNo}
                    onChange={(e) =>
                      setFormData({ ...formData, admissionNo: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class *
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) =>
                      setFormData({ ...formData, className: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    {['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'].map(
                      (c) => (
                        <option key={c} value={c}>
                          Class {c}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Section *
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) =>
                      setFormData({ ...formData, rollNo: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-rose-700"
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
                    Father's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={(e) =>
                      setFormData({ ...formData, fatherName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mother's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.motherName}
                    onChange={(e) =>
                      setFormData({ ...formData, motherName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Guardian Mobile No. *
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
                    Emergency Contact No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.emergencyPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    School House
                  </label>
                  <select
                    value={formData.house}
                    onChange={(e) =>
                      setFormData({ ...formData, house: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="Phoenix Red">Phoenix Red</option>
                    <option value="Titan Blue">Titan Blue</option>
                    <option value="Emerald Green">Emerald Green</option>
                    <option value="Solar Gold">Solar Gold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bus Route / Mode of Transport
                  </label>
                  <input
                    type="text"
                    value={formData.busRoute}
                    onChange={(e) =>
                      setFormData({ ...formData, busRoute: e.target.value })
                    }
                    placeholder="e.g. Route 04 - Green Park"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Residential Address (Printed on ID Card Back) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="House/Flat No, Colony, Sector, City & PIN"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Medical / Allergy Notes
                  </label>
                  <input
                    type="text"
                    value={formData.medicalNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, medicalNotes: e.target.value })
                    }
                    placeholder="None"
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  {editingStudent ? 'Save Student Changes' : 'Complete Admission & Generate ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
