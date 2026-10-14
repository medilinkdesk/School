import React from 'react';
import IdCardRenderer from './IdCardRenderer';
import {
  Users,
  Briefcase,
  CalendarCheck,
  IndianRupee,
  CreditCard,
  Award,
  Sparkles,
  ArrowRight,
  Bell,
  UserPlus,
} from 'lucide-react';

export default function DashboardOverview({
  db,
  onNavigate,
  onOpenIdStudioForPerson,
}) {
  const {
    settings = {},
    students = [],
    staff = [],
    attendance = [],
    fees = [],
    notices = [],
  } = db;

  const latestAttendance = attendance[0]?.records || {};
  const presentCount = students.filter(
    (s) =>
      (latestAttendance[s.id]?.status || 'Present') === 'Present' ||
      latestAttendance[s.id]?.status === 'Late'
  ).length;
  const attendancePct =
    students.length > 0 ? Math.round((presentCount / students.length) * 100) : 100;

  const totalFeeCollected = fees.reduce((s, f) => s + (f.paidAmount || 0), 0);
  const totalFeePayable = fees.reduce((s, f) => s + (f.netPayable || 0), 0);
  const totalFeePending = Math.max(0, totalFeePayable - totalFeeCollected);

  const featuredStudent = students[0] || null;

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-6 sm:p-7 shadow-lg overflow-hidden border border-indigo-900/60">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={settings.logo}
              alt="School Crest"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 p-1.5 object-contain shrink-0 border border-white/15"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                SESSION {settings.academicYear} • FULL ERP & SMART ID STUDIO
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {settings.schoolName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {settings.affiliation} • {settings.address}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('id-studio')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md transition"
            >
              <CreditCard className="w-4 h-4" />
              Open ID Card Studio
            </button>

            <button
              type="button"
              onClick={() => onNavigate('students')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition"
            >
              <UserPlus className="w-4 h-4" />
              Student Admissions
            </button>

            <button
              type="button"
              onClick={() => onNavigate('exams')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition"
            >
              <Award className="w-4 h-4" />
              Report Cards
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          onClick={() => onNavigate('students')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-indigo-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {students.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            100% ID Verified Roster →
          </div>
        </div>

        <div
          onClick={() => onNavigate('staff')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-indigo-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Faculty & Staff
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {staff.length}
          </div>
          <div className="text-[11px] text-purple-600 font-bold mt-1">
            Faculty IDs & Payroll →
          </div>
        </div>

        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-indigo-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Today's Attendance
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {attendancePct}%
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            {presentCount} of {students.length} Present →
          </div>
        </div>

        <div
          onClick={() => onNavigate('fees')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-indigo-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Fee Collected
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            ₹{(totalFeeCollected / 1000).toFixed(0)}K
          </div>
          <div className="text-[11px] text-rose-600 font-bold mt-1">
            ₹{totalFeePending.toLocaleString('en-IN')} Due →
          </div>
        </div>

        <div
          onClick={() => onNavigate('id-studio')}
          className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl p-4 shadow-sm cursor-pointer hover:opacity-95 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-200">
              Smart ID Cards
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/15 text-amber-300 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black mt-2">
            {students.length + staff.length} Cards
          </div>
          <div className="text-[11px] text-amber-300 font-bold mt-1 flex items-center gap-1">
            5 Templates • Bulk Print <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                Live Smart PVC Card Preview (Front & Back)
              </span>
              <h3 className="text-base font-black text-slate-900">
                Student & Staff Identity Card Generator
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('id-studio')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Customize & Print All Cards
            </button>
          </div>

          {featuredStudent && (
            <div className="py-3 bg-slate-100/80 rounded-2xl flex justify-center overflow-x-auto">
              <IdCardRenderer
                person={featuredStudent}
                settings={settings}
                isStaff={false}
                template={settings.defaultCardTemplate || 'royal'}
                side="both"
              />
            </div>
          )}
        </div>

        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-sm text-slate-900">
                Quick Student ID Card Launcher
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('students')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                View All ({students.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {students.slice(0, 5).map((stu) => (
                <div
                  key={stu.id}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={stu.photo}
                      alt={stu.name}
                      className="w-9 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {stu.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Class {stu.className}-{stu.section} • Roll #{stu.rollNo} •{' '}
                        <span className="text-rose-600 font-bold">
                          {stu.bloodGroup}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenIdStudioForPerson(stu)}
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px]"
                  >
                    <CreditCard className="w-3 h-3" /> ID Card
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-500" />
                Official Campus Notices
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('timetable')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Manage Notices
              </button>
            </div>

            <div className="space-y-2.5">
              {notices.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {n.category}
                    </span>
                    <span className="text-slate-400 font-mono">{n.date}</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">
                    {n.title}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {n.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
