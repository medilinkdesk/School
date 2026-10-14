import React, { useState, useMemo } from 'react';
import { calculateGradeInfo } from '../utils/helpers';
import {
  Award,
  Printer,
  Plus,
  Edit3,
  X,
  Trash2,
} from 'lucide-react';

const DEFAULT_SUBJECTS = [
  { name: 'Mathematics', code: '041', maxMarks: 100, theory: 72, practical: 19, obtained: 91 },
  { name: 'Science & Technology', code: '086', maxMarks: 100, theory: 70, practical: 19, obtained: 89 },
  { name: 'English Language & Lit.', code: '184', maxMarks: 100, theory: 68, practical: 19, obtained: 87 },
  { name: 'Social Science', code: '087', maxMarks: 100, theory: 69, practical: 19, obtained: 88 },
  { name: 'Artificial Intelligence / IT', code: '417', maxMarks: 100, theory: 46, practical: 48, obtained: 94 },
];

export default function ExamReportModule({
  students = [],
  exams = [],
  settings,
  onSaveExam,
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(
    students[0]?.id || ''
  );
  const [selectedTerm, setSelectedTerm] = useState('Mid-Term Examination 2026-27');
  const [editModalOpen, setEditModalOpen] = useState(false);

  const activeStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || students[0],
    [students, selectedStudentId]
  );

  const activeExamRecord = useMemo(() => {
    if (!activeStudent) return null;
    const found = exams.find(
      (e) => e.studentId === activeStudent.id && e.examTerm === selectedTerm
    );
    if (found) return found;
    return {
      studentId: activeStudent.id,
      examTerm: selectedTerm,
      attendanceDays: '94 / 100',
      coScholastic: {
        discipline: 'A+',
        workEducation: 'A',
        artEducation: 'A',
        healthPhysical: 'A+',
      },
      teacherRemarks: `${activeStudent.name} shows commendable dedication and active participation in classroom discussions.`,
      subjects: DEFAULT_SUBJECTS,
    };
  }, [activeStudent, exams, selectedTerm]);

  const [formState, setFormState] = useState(null);

  const openMarksEditor = () => {
    setFormState(JSON.parse(JSON.stringify(activeExamRecord)));
    setEditModalOpen(true);
  };

  const handleSubjectChange = (idx, field, val) => {
    setFormState((prev) => {
      const nextSubs = [...prev.subjects];
      const updated = { ...nextSubs[idx], [field]: val };
      if (field === 'theory' || field === 'practical') {
        updated.obtained =
          (Number(updated.theory) || 0) + (Number(updated.practical) || 0);
      }
      nextSubs[idx] = updated;
      return { ...prev, subjects: nextSubs };
    });
  };

  const addSubjectRow = () => {
    setFormState((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        { name: 'New Subject', code: '099', maxMarks: 100, theory: 70, practical: 20, obtained: 90 },
      ],
    }));
  };

  const removeSubjectRow = (idx) => {
    setFormState((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    await onSaveExam(formState);
    setEditModalOpen(false);
  };

  const summary = useMemo(() => {
    const subs = activeExamRecord?.subjects || [];
    const totalMax = subs.reduce((s, x) => s + (Number(x.maxMarks) || 100), 0);
    const totalObtained = subs.reduce((s, x) => s + (Number(x.obtained) || 0), 0);
    const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0.00';
    const gradeInfo = calculateGradeInfo(percentage);
    return { totalMax, totalObtained, percentage, gradeInfo };
  }, [activeExamRecord]);

  if (!activeStudent) return null;

  return (
    <div className="space-y-6">
      <div className="no-print bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Examinations, Marks & Official Report Card Generator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter subject-wise theory and practical marks, calculate CBSE/ICSE grades & CGPA, and print formal A4 Report Cards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Class {s.className}-{s.section} • Roll #{s.rollNo})
                </option>
              ))}
            </select>

            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="Mid-Term Examination 2026-27">
                Mid-Term Examination 2026-27
              </option>
              <option value="Unit Test I (2026-27)">Unit Test I (2026-27)</option>
              <option value="Annual Final Examination 2026-27">
                Annual Final Examination 2026-27
              </option>
            </select>

            <button
              type="button"
              onClick={openMarksEditor}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Enter / Edit Marks
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Print Official Report Card
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md max-w-4xl mx-auto overflow-hidden print-container">
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 border-b-4 border-amber-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={settings.logo}
                alt="School Crest"
                className="w-20 h-20 rounded-full bg-white/10 p-1 object-contain"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wide uppercase">
                  {settings.schoolName}
                </h1>
                <p className="text-xs text-amber-300 font-bold mt-0.5">
                  {settings.affiliation}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">{settings.address}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tel: {settings.phone} • Web: {settings.website}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className="inline-block px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                Official Progress Report
              </span>
              <div className="text-xs font-mono text-white/90 mt-1.5 font-bold">
                Session: {settings.academicYear}
              </div>
              <div className="text-xs text-amber-200 font-semibold">
                {selectedTerm}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2.5 text-xs flex-1 w-full">
            <div>
              <span className="text-slate-400 font-semibold block">
                Student Name
              </span>
              <span className="font-black text-slate-900 text-sm">
                {activeStudent.name}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">
                Class & Section
              </span>
              <span className="font-black text-indigo-700 text-sm">
                Class {activeStudent.className} - Section {activeStudent.section}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">
                Roll No. & ID
              </span>
              <span className="font-bold text-slate-900 font-mono">
                #{activeStudent.rollNo} ({activeStudent.id})
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">
                Admission No.
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {activeStudent.admissionNo}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">
                Date of Birth
              </span>
              <span className="font-bold text-slate-800">{activeStudent.dob}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">
                Father's / Mother's Name
              </span>
              <span className="font-bold text-slate-800">
                {activeStudent.fatherName} / {activeStudent.motherName}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <img
              src={activeStudent.photo}
              alt={activeStudent.name}
              className="w-24 h-28 rounded-xl object-cover border-2 border-indigo-900 shadow-sm bg-white"
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5">
              Part I : Scholastic Performance (Subject-Wise Marks & Grades)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-black uppercase text-slate-700">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">Max Marks</th>
                    <th className="py-2.5 px-3 text-center">Theory</th>
                    <th className="py-2.5 px-3 text-center">Practical / IA</th>
                    <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                    <th className="py-2.5 px-3 text-center">Subject Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(activeExamRecord.subjects || []).map((sub, i) => {
                    const pct =
                      ((Number(sub.obtained) || 0) / (Number(sub.maxMarks) || 100)) *
                      100;
                    const g = calculateGradeInfo(pct);
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-500">
                          {sub.code}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {sub.name}
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-600">
                          {sub.maxMarks}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-700">
                          {sub.theory}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-700">
                          {sub.practical}
                        </td>
                        <td className="py-2.5 px-3 text-center font-black text-slate-900">
                          {sub.obtained}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md border font-black text-[11px] ${g.color}`}
                          >
                            {g.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-indigo-950 text-white font-black text-xs">
                    <td colSpan={2} className="py-3 px-3 uppercase">
                      Grand Total & Aggregate Percentage
                    </td>
                    <td className="py-3 px-3 text-center">{summary.totalMax}</td>
                    <td colSpan={2} className="py-3 px-3 text-center text-amber-300">
                      Aggregate: {summary.percentage}%
                    </td>
                    <td className="py-3 px-3 text-center text-amber-300 text-sm">
                      {summary.totalObtained} / {summary.totalMax}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                        {summary.gradeInfo.grade} (GP {summary.gradeInfo.gp})
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
              <div className="font-black uppercase text-slate-700 text-[11px]">
                Part II : Co-Scholastic Areas (3-Point Grading Scale)
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-600">Work Education</span>
                  <strong className="text-indigo-700">
                    {activeExamRecord.coScholastic?.workEducation || 'A+'}
                  </strong>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-600">Art Education</span>
                  <strong className="text-indigo-700">
                    {activeExamRecord.coScholastic?.artEducation || 'A'}
                  </strong>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-600">Health & Physical</span>
                  <strong className="text-indigo-700">
                    {activeExamRecord.coScholastic?.healthPhysical || 'A+'}
                  </strong>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-600">Discipline & Values</span>
                  <strong className="text-indigo-700">
                    {activeExamRecord.coScholastic?.discipline || 'A+'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-emerald-50/40 flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase text-slate-700 text-[11px]">
                    Result & Remarks
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px]">
                    RESULT: PASSED ({summary.gradeInfo.remark.toUpperCase()})
                  </span>
                </div>
                <p className="mt-2 text-slate-700 italic leading-relaxed">
                  "{activeExamRecord.teacherRemarks}"
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-200/70 flex justify-between font-bold text-slate-700">
                <span>Term Attendance: {activeExamRecord.attendanceDays} Days</span>
                <span>Date of Issue: {new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>
          </div>

          <div className="pt-8 pb-2 grid grid-cols-3 gap-6 items-end text-center text-xs">
            <div>
              <div className="h-10 flex items-center justify-center font-serif italic text-slate-700">
                Class Teacher
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-700">
                Class Teacher's Signature
              </div>
            </div>

            <div>
              <div className="h-10 flex items-center justify-center text-slate-400 text-[11px]">
                (Parent / Guardian)
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-700">
                Parent's Signature
              </div>
            </div>

            <div>
              <img
                src={settings.principalSignature}
                alt="Principal Sign"
                className="h-10 mx-auto object-contain"
              />
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                {settings.principalName} (Principal)
              </div>
            </div>
          </div>
        </div>
      </div>

      {editModalOpen && formState && (
        <div className="no-print fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Update Exam Marks — {activeStudent.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedTerm}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Subject-Wise Marks Breakdown
                  </span>
                  <button
                    type="button"
                    onClick={addSubjectRow}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Subject
                  </button>
                </div>

                {formState.subjects.map((sub, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs"
                  >
                    <input
                      type="text"
                      value={sub.code}
                      onChange={(e) =>
                        handleSubjectChange(idx, 'code', e.target.value)
                      }
                      placeholder="Code"
                      className="col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 font-mono"
                    />
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) =>
                        handleSubjectChange(idx, 'name', e.target.value)
                      }
                      placeholder="Subject Name"
                      className="col-span-4 px-2 py-1.5 rounded-lg border border-slate-300 font-bold"
                    />
                    <input
                      type="number"
                      value={sub.theory}
                      onChange={(e) =>
                        handleSubjectChange(idx, 'theory', Number(e.target.value))
                      }
                      placeholder="Theory"
                      className="col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 text-center"
                    />
                    <input
                      type="number"
                      value={sub.practical}
                      onChange={(e) =>
                        handleSubjectChange(idx, 'practical', Number(e.target.value))
                      }
                      placeholder="Prac"
                      className="col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 text-center"
                    />
                    <div className="col-span-1 text-center font-black text-indigo-700">
                      ={sub.obtained}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubjectRow(idx)}
                      className="col-span-1 p-1 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Attendance Days (e.g. 96 / 100)
                  </label>
                  <input
                    type="text"
                    value={formState.attendanceDays}
                    onChange={(e) =>
                      setFormState({ ...formState, attendanceDays: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class Teacher Remarks
                  </label>
                  <input
                    type="text"
                    value={formState.teacherRemarks}
                    onChange={(e) =>
                      setFormState({ ...formState, teacherRemarks: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Save & Update Report Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
