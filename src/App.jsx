import React, { useState, useEffect } from 'react';
import DashboardOverview from './components/DashboardOverview';
import IdCardStudio from './components/IdCardStudio';
import StudentManagement from './components/StudentManagement';
import StaffManagement from './components/StaffManagement';
import AttendanceModule from './components/AttendanceModule';
import ExamReportModule from './components/ExamReportModule';
import FeeReceiptModule from './components/FeeReceiptModule';
import TimetableNoticesModule from './components/TimetableNoticesModule';
import { initialSeedData } from './data/seedData';
import {
  LayoutDashboard,
  CreditCard,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  Award,
  IndianRupee,
  Clock,
  RefreshCw,
  ShieldCheck,
  Globe,
} from 'lucide-react';

const STORAGE_KEY = 'edusphere_school_db';

export default function App() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studioTargetPerson, setStudioTargetPerson] = useState(null);
  const [isCloudMode, setIsCloudMode] = useState(false);

  const saveToStorageAndState = (newDb) => {
    setDb(newDb);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDb));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const fetchBootstrap = async () => {
    setLoading(true);
    let loadedFromApi = false;
    try {
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        if (data && data.students) {
          saveToStorageAndState(data);
          loadedFromApi = true;
        }
      }
    } catch (err) {
      // Backend not running (e.g. GitHub Pages static host)
    }

    if (!loadedFromApi) {
      setIsCloudMode(true);
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.students) {
            setDb(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to parse cached local data:', err);
      }
      // Fallback to rich seed data
      saveToStorageAndState(JSON.parse(JSON.stringify(initialSeedData)));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBootstrap();
  }, []);

  // --- MUTATION HANDLERS (Works both with Backend API and Client-Side LocalStorage on GitHub Pages) ---

  const handleCreateStudent = async (payload) => {
    const nextNum = (db.students?.length || 0) + 1001;
    const newStudent = {
      id: payload.id || `STU-${Date.now().toString().slice(-4)}`,
      admissionNo: payload.admissionNo || `ADM/2026/${String((db.students?.length || 0) + 1).padStart(3, '0')}`,
      rollNo: payload.rollNo || String(nextNum),
      name: payload.name || 'New Student',
      className: payload.className || '10',
      section: payload.section || 'A',
      stream: payload.stream || 'General',
      gender: payload.gender || 'Male',
      dob: payload.dob || '2011-01-01',
      bloodGroup: payload.bloodGroup || 'O+',
      fatherName: payload.fatherName || '',
      motherName: payload.motherName || '',
      phone: payload.phone || '',
      emergencyPhone: payload.emergencyPhone || payload.phone || '',
      email: payload.email || '',
      address: payload.address || '',
      house: payload.house || 'Phoenix Red',
      busRoute: payload.busRoute || 'Self / Parent Drop',
      admissionDate: payload.admissionDate || new Date().toISOString().split('T')[0],
      status: payload.status || 'Active',
      medicalNotes: payload.medicalNotes || 'None',
      photo: payload.photo || '',
      ...payload,
    };

    const nextStudents = [newStudent, ...(db.students || [])];
    const nextFees = [...(db.fees || [])];
    if (!nextFees.some((f) => f.studentId === newStudent.id)) {
      nextFees.push({
        id: `FEE-${Date.now().toString().slice(-4)}`,
        studentId: newStudent.id,
        academicYear: db.settings?.academicYear || '2026-2027',
        totalAnnualFee: 84000,
        discount: 0,
        netPayable: 84000,
        paidAmount: 0,
        breakdown: {
          tuitionFee: 56000,
          labAndSmartClass: 12000,
          transportFee: 12000,
          libraryAndSports: 4000,
        },
        payments: [],
      });
    }

    const updatedDb = { ...db, students: nextStudents, fees: nextFees };
    saveToStorageAndState(updatedDb);

    try {
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      }).catch(() => {});
    } catch (e) {}
  };

  const handleUpdateStudent = async (id, payload) => {
    const updatedStudents = db.students.map((s) =>
      s.id === id ? { ...s, ...payload } : s
    );
    const updatedDb = { ...db, students: updatedStudents };
    saveToStorageAndState(updatedDb);

    try {
      fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (e) {}
  };

  const handleDeleteStudent = async (id) => {
    const updatedStudents = db.students.filter((s) => s.id !== id);
    const updatedDb = { ...db, students: updatedStudents };
    saveToStorageAndState(updatedDb);

    try {
      fetch(`/api/students/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  };

  const handleCreateStaff = async (payload) => {
    const newStaff = {
      id: payload.id || `EMP-${Date.now().toString().slice(-4)}`,
      employeeCode: payload.employeeCode || `FAC/2026/${101 + (db.staff?.length || 0)}`,
      name: payload.name || 'New Faculty',
      designation: payload.designation || 'TGT Teacher',
      department: payload.department || 'Academics',
      qualification: payload.qualification || 'M.Sc., B.Ed.',
      experience: payload.experience || '5 Years',
      gender: payload.gender || 'Male',
      dob: payload.dob || '1988-01-01',
      bloodGroup: payload.bloodGroup || 'O+',
      phone: payload.phone || '',
      emergencyPhone: payload.emergencyPhone || payload.phone || '',
      email: payload.email || '',
      address: payload.address || '',
      joiningDate: payload.joiningDate || new Date().toISOString().split('T')[0],
      salary: Number(payload.salary) || 65000,
      status: payload.status || 'Active',
      photo: payload.photo || '',
      ...payload,
    };
    const updatedDb = { ...db, staff: [newStaff, ...(db.staff || [])] };
    saveToStorageAndState(updatedDb);

    try {
      fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      }).catch(() => {});
    } catch (e) {}
  };

  const handleUpdateStaff = async (id, payload) => {
    const updatedStaff = db.staff.map((s) =>
      s.id === id ? { ...s, ...payload } : s
    );
    const updatedDb = { ...db, staff: updatedStaff };
    saveToStorageAndState(updatedDb);

    try {
      fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (e) {}
  };

  const handleDeleteStaff = async (id) => {
    const updatedStaff = db.staff.filter((s) => s.id !== id);
    const updatedDb = { ...db, staff: updatedStaff };
    saveToStorageAndState(updatedDb);

    try {
      fetch(`/api/staff/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  };

  const handleSaveAttendance = async (date, records) => {
    const existingIdx = (db.attendance || []).findIndex((a) => a.date === date);
    let nextAttendance = [...(db.attendance || [])];
    if (existingIdx >= 0) {
      nextAttendance[existingIdx] = {
        ...nextAttendance[existingIdx],
        records: { ...nextAttendance[existingIdx].records, ...records },
      };
    } else {
      nextAttendance.unshift({ date, records });
    }
    const updatedDb = { ...db, attendance: nextAttendance };
    saveToStorageAndState(updatedDb);

    try {
      fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, records }),
      }).catch(() => {});
    } catch (e) {}
  };

  const handleSaveExam = async (examPayload) => {
    const existingIdx = (db.exams || []).findIndex(
      (e) =>
        e.studentId === examPayload.studentId &&
        e.examTerm === examPayload.examTerm
    );
    let nextExams = [...(db.exams || [])];
    if (existingIdx >= 0) {
      nextExams[existingIdx] = { ...nextExams[existingIdx], ...examPayload };
    } else {
      nextExams.push({
        id: `EXM-${Date.now().toString().slice(-4)}`,
        ...examPayload,
      });
    }
    const updatedDb = { ...db, exams: nextExams };
    saveToStorageAndState(updatedDb);

    try {
      fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examPayload),
      }).catch(() => {});
    } catch (e) {}
  };

  const handleCollectFee = async (studentId, paymentPayload) => {
    const nextFees = [...(db.fees || [])];
    let ledger = nextFees.find((f) => f.studentId === studentId);
    if (!ledger) {
      ledger = {
        id: `FEE-${Date.now().toString().slice(-4)}`,
        studentId,
        academicYear: db.settings?.academicYear || '2026-2027',
        totalAnnualFee: 84000,
        discount: 0,
        netPayable: 84000,
        paidAmount: 0,
        breakdown: {
          tuitionFee: 56000,
          labAndSmartClass: 12000,
          transportFee: 12000,
          libraryAndSports: 4000,
        },
        payments: [],
      };
      nextFees.push(ledger);
    }

    if (typeof paymentPayload.discount === 'number') {
      ledger.discount = paymentPayload.discount;
      ledger.netPayable = Math.max(0, ledger.totalAnnualFee - ledger.discount);
    }

    const payAmount = Number(paymentPayload.amount) || 0;
    const receipt = {
      receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: payAmount,
      mode: paymentPayload.mode || 'UPI / Online',
      transactionRef: paymentPayload.transactionRef || `TXN${Date.now().toString().slice(-8)}`,
      installment: paymentPayload.installment || 'Installment Payment',
      collectedBy: paymentPayload.collectedBy || 'Accounts Office',
    };

    ledger.payments = [receipt, ...(ledger.payments || [])];
    ledger.paidAmount = ledger.payments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const updatedDb = { ...db, fees: nextFees };
    saveToStorageAndState(updatedDb);

    try {
      fetch(`/api/fees/${studentId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload),
      }).catch(() => {});
    } catch (e) {}

    return { ledger, receipt, fees: nextFees };
  };

  const handleAddNotice = async (noticePayload) => {
    const notice = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      title: noticePayload.title,
      category: noticePayload.category || 'General',
      date: noticePayload.date || new Date().toISOString().split('T')[0],
      priority: noticePayload.priority || 'Medium',
      audience: noticePayload.audience || 'All Students & Staff',
      content: noticePayload.content || '',
    };
    const updatedDb = { ...db, notices: [notice, ...(db.notices || [])] };
    saveToStorageAndState(updatedDb);

    try {
      fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticePayload),
      }).catch(() => {});
    } catch (e) {}
  };

  const handleDeleteNotice = async (id) => {
    const updatedDb = {
      ...db,
      notices: (db.notices || []).filter((n) => n.id !== id),
    };
    saveToStorageAndState(updatedDb);

    try {
      fetch(`/api/notices/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  };

  const handleUpdateSettings = async (newSettings) => {
    const updatedDb = {
      ...db,
      settings: { ...db.settings, ...newSettings },
    };
    saveToStorageAndState(updatedDb);

    try {
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      }).catch(() => {});
    } catch (e) {}
  };

  const handleResetDemo = async () => {
    const fresh = JSON.parse(JSON.stringify(initialSeedData));
    saveToStorageAndState(fresh);
    try {
      fetch('/api/reset', { method: 'POST' }).catch(() => {});
    } catch (e) {}
  };

  const openIdStudioForPerson = (person) => {
    setStudioTargetPerson(person);
    setActiveTab('id-studio');
  };

  if (loading || !db) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-pulse">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div className="text-sm font-bold tracking-wide">
          Loading EduSphere Pro School ERP & Smart ID Card Studio...
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'id-studio',
      label: 'ID Card Generator',
      icon: CreditCard,
      badge: 'PRO',
    },
    {
      id: 'students',
      label: 'Students',
      icon: GraduationCap,
      count: db.students?.length || 0,
    },
    {
      id: 'staff',
      label: 'Faculty & Staff',
      icon: Briefcase,
      count: db.staff?.length || 0,
    },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'exams', label: 'Exams & Report Cards', icon: Award },
    { id: 'fees', label: 'Fees & Receipts', icon: IndianRupee },
    { id: 'timetable', label: 'Timetable & Branding', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col">
      <header className="no-print sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src={db.settings?.logo}
                alt="Crest"
                className="w-10 h-10 rounded-xl bg-white/10 p-0.5 object-contain"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-tight text-white">
                    EDUSPHERE PRO
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                    ERP + ID STUDIO
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[260px]">
                  {db.settings?.schoolName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isCloudMode ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700/60 text-xs font-semibold text-indigo-300">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  GitHub Pages Mode (Live Persistent Storage)
                </span>
              ) : (
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Academic Year: {db.settings?.academicYear}
                </span>
              )}

              <button
                type="button"
                onClick={handleResetDemo}
                title="Reset Demo Data to Factory Defaults"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Demo DB</span>
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[9px]">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 print-container">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            db={db}
            onNavigate={setActiveTab}
            onOpenIdStudioForPerson={openIdStudioForPerson}
          />
        )}

        {activeTab === 'id-studio' && (
          <IdCardStudio
            students={db.students || []}
            staff={db.staff || []}
            settings={db.settings}
            onUpdateStudent={handleUpdateStudent}
            onUpdateStaff={handleUpdateStaff}
            initialSelectedPerson={studioTargetPerson}
          />
        )}

        {activeTab === 'students' && (
          <StudentManagement
            students={db.students || []}
            settings={db.settings}
            onCreateStudent={handleCreateStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onOpenIdStudio={openIdStudioForPerson}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagement
            staff={db.staff || []}
            settings={db.settings}
            onCreateStaff={handleCreateStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
            onOpenIdStudio={openIdStudioForPerson}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceModule
            students={db.students || []}
            attendance={db.attendance || []}
            onSaveAttendance={handleSaveAttendance}
          />
        )}

        {activeTab === 'exams' && (
          <ExamReportModule
            students={db.students || []}
            exams={db.exams || []}
            settings={db.settings}
            onSaveExam={handleSaveExam}
          />
        )}

        {activeTab === 'fees' && (
          <FeeReceiptModule
            students={db.students || []}
            fees={db.fees || []}
            settings={db.settings}
            onCollectFee={handleCollectFee}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableNoticesModule
            timetable={db.timetable || []}
            notices={db.notices || []}
            settings={db.settings}
            onAddNotice={handleAddNotice}
            onDeleteNotice={handleDeleteNotice}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>
    </div>
  );
}
