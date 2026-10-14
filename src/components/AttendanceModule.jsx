import React, { useState, useMemo, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Users,
  CheckCheck,
} from 'lucide-react';

export default function AttendanceModule({
  students = [],
  attendance = [],
  onSaveAttendance,
}) {
  const [selectedDate, setSelectedDate] = useState('2026-09-28');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [records, setRecords] = useState({});
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const existingDay = attendance.find((a) => a.date === selectedDate);
    const initial = {};
    students.forEach((stu) => {
      initial[stu.id] = existingDay?.records?.[stu.id] || {
        status: 'Present',
        remarks: '',
      };
    });
    setRecords(initial);
  }, [selectedDate, attendance, students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (classFilter !== 'ALL' && String(s.className) !== classFilter) return false;
      if (sectionFilter !== 'ALL' && s.section !== sectionFilter) return false;
      return true;
    });
  }, [students, classFilter, sectionFilter]);

  const setStudentStatus = (studentId, status) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || {}), status },
    }));
  };

  const setStudentRemark = (studentId, remarks) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || { status: 'Present' }), remarks },
    }));
  };

  const markAllFiltered = (status) => {
    setRecords((prev) => {
      const next = { ...prev };
      filteredStudents.forEach((s) => {
        next[s.id] = { ...(next[s.id] || {}), status };
      });
      return next;
    });
  };

  const handleSave = async () => {
    await onSaveAttendance(selectedDate, records);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const stats = useMemo(() => {
    let present = 0,
      absent = 0,
      late = 0;
    filteredStudents.forEach((s) => {
      const st = records[s.id]?.status || 'Present';
      if (st === 'Present') present++;
      else if (st === 'Absent') absent++;
      else if (st === 'Late') late++;
    });
    return { present, absent, late, total: filteredStudents.length };
  }, [filteredStudents, records]);

  const getStudentOverallAttendance = (studentId) => {
    if (!attendance.length) return { presentDays: 1, totalDays: 1, pct: 100 };
    let presentDays = 0;
    attendance.forEach((day) => {
      const st = day.records?.[studentId]?.status || 'Present';
      if (st === 'Present' || st === 'Late') presentDays++;
    });
    const pct = Math.round((presentDays / attendance.length) * 100);
    return { presentDays, totalDays: attendance.length, pct };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-indigo-600" />
              Daily Attendance Register & Analytics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mark daily roll-call attendance by class and section, add remarks, and track student attendance percentages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
            />

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              <option value="ALL">All Classes</option>
              {['12', '10', '9', '8', '6'].map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              <option value="ALL">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>

            <button
              type="button"
              onClick={() => markAllFiltered('Present')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Present
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              Save Attendance
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="mt-3 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Attendance register for {selectedDate} saved to database!
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400">
                Total Roster
              </div>
              <div className="text-xl font-black text-slate-900">{stats.total}</div>
            </div>
            <Users className="w-7 h-7 text-slate-400" />
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-emerald-700">
                Present Today
              </div>
              <div className="text-xl font-black text-emerald-900">
                {stats.present}
              </div>
            </div>
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-rose-700">
                Absent Today
              </div>
              <div className="text-xl font-black text-rose-900">{stats.absent}</div>
            </div>
            <XCircle className="w-7 h-7 text-rose-600" />
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-amber-700">
                Late Arrival
              </div>
              <div className="text-xl font-black text-amber-900">{stats.late}</div>
            </div>
            <Clock className="w-7 h-7 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Roll & Student</th>
                <th className="py-3.5 px-4">Class / Sec</th>
                <th className="py-3.5 px-4">Status ({selectedDate})</th>
                <th className="py-3.5 px-4">Remarks / Leave Note</th>
                <th className="py-3.5 px-4">Overall Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((stu) => {
                const current = records[stu.id] || {
                  status: 'Present',
                  remarks: '',
                };
                const overall = getStudentOverallAttendance(stu.id);
                return (
                  <tr key={stu.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.photo}
                          alt={stu.name}
                          className="w-9 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{stu.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            Roll #{stu.rollNo} • {stu.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-700">
                      Class {stu.className}-{stu.section}
                    </td>

                    <td className="py-3 px-4">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
                        {[
                          {
                            label: 'Present',
                            activeClass: 'bg-emerald-600 text-white shadow-sm',
                          },
                          {
                            label: 'Absent',
                            activeClass: 'bg-rose-600 text-white shadow-sm',
                          },
                          {
                            label: 'Late',
                            activeClass: 'bg-amber-500 text-white shadow-sm',
                          },
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            type="button"
                            onClick={() => setStudentStatus(stu.id, btn.label)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                              current.status === btn.label
                                ? btn.activeClass
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={current.remarks || ''}
                        onChange={(e) => setStudentRemark(stu.id, e.target.value)}
                        placeholder="Add note (e.g. Medical leave, Olympiad)..."
                        className="w-full max-w-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              overall.pct >= 85
                                ? 'bg-emerald-500'
                                : overall.pct >= 75
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${overall.pct}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">
                          {overall.pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
