import React, { useState, useEffect } from 'react';
import DashboardOverview from './components/DashboardOverview';
import IdCardStudio from './components/IdCardStudio';
import StudentManagement from './components/StudentManagement';
import StaffManagement from './components/StaffManagement';
import AttendanceModule from './components/AttendanceModule';
import ExamReportModule from './components/ExamReportModule';
import FeeReceiptModule from './components/FeeReceiptModule';
import TimetableNoticesModule from './components/TimetableNoticesModule';
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
} from 'lucide-react';

export default function App() {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studioTargetPerson, setStudioTargetPerson] = useState(null);

  const fetchBootstrap = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bootstrap');
      const data = await res.json();
      setDb(data);
    } catch (err) {
      console.error('Failed to load school database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBootstrap();
  }, []);

  const handleCreateStudent = async (payload) => {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.db) setDb(data.db);
    else fetchBootstrap();
  };

  const handleUpdateStudent = async (id, payload) => {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    setDb((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === id ? updated : s)),
    }));
  };

  const handleDeleteStudent = async (id) => {
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    setDb((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
    }));
  };

  const handleCreateStaff = async (payload) => {
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    setDb((prev) => ({ ...prev, staff: [created, ...prev.staff] }));
  };

  const handleUpdateStaff = async (id, payload) => {
    const res = await fetch(`/api/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    setDb((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => (s.id === id ? updated : s)),
    }));
  };

  const handleDeleteStaff = async (id) => {
    await fetch(`/api/staff/${id}`, { method: 'DELETE' });
    setDb((prev) => ({
      ...prev,
      staff: prev.staff.filter((s) => s.id !== id),
    }));
  };

  const handleSaveAttendance = async (date, records) => {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, records }),
    });
    const updatedAttendance = await res.json();
    setDb((prev) => ({ ...prev, attendance: updatedAttendance }));
  };

  const handleSaveExam = async (examPayload) => {
    const res = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(examPayload),
    });
    const updatedExams = await res.json();
    setDb((prev) => ({ ...prev, exams: updatedExams }));
  };

  const handleCollectFee = async (studentId, paymentPayload) => {
    const res = await fetch(`/api/fees/${studentId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentPayload),
    });
    const data = await res.json();
    if (data.fees) {
      setDb((prev) => ({ ...prev, fees: data.fees }));
    }
    return data;
  };

  const handleAddNotice = async (noticePayload) => {
    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noticePayload),
    });
    const notices = await res.json();
    setDb((prev) => ({ ...prev, notices }));
  };

  const handleDeleteNotice = async (id) => {
    const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
    const notices = await res.json();
    setDb((prev) => ({ ...prev, notices }));
  };

  const handleUpdateSettings = async (newSettings) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    });
    const settings = await res.json();
    setDb((prev) => ({ ...prev, settings }));
  };

  const handleResetDemo = async () => {
    const res = await fetch('/api/reset', { method: 'POST' });
    const fresh = await res.json();
    setDb(fresh);
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
      count: db.students.length,
    },
    {
      id: 'staff',
      label: 'Faculty & Staff',
      icon: Briefcase,
      count: db.staff.length,
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
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Academic Year: {db.settings?.academicYear}
              </span>

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
            students={db.students}
            staff={db.staff}
            settings={db.settings}
            onUpdateStudent={handleUpdateStudent}
            onUpdateStaff={handleUpdateStaff}
            initialSelectedPerson={studioTargetPerson}
          />
        )}

        {activeTab === 'students' && (
          <StudentManagement
            students={db.students}
            settings={db.settings}
            onCreateStudent={handleCreateStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onOpenIdStudio={openIdStudioForPerson}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagement
            staff={db.staff}
            settings={db.settings}
            onCreateStaff={handleCreateStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
            onOpenIdStudio={openIdStudioForPerson}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceModule
            students={db.students}
            attendance={db.attendance}
            onSaveAttendance={handleSaveAttendance}
          />
        )}

        {activeTab === 'exams' && (
          <ExamReportModule
            students={db.students}
            exams={db.exams}
            settings={db.settings}
            onSaveExam={handleSaveExam}
          />
        )}

        {activeTab === 'fees' && (
          <FeeReceiptModule
            students={db.students}
            fees={db.fees}
            settings={db.settings}
            onCollectFee={handleCollectFee}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableNoticesModule
            timetable={db.timetable}
            notices={db.notices}
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
