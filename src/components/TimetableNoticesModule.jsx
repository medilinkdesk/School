import React, { useState } from 'react';
import {
  Clock,
  Bell,
  Settings,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export default function TimetableNoticesModule({
  timetable = [],
  notices = [],
  settings,
  onAddNotice,
  onDeleteNotice,
  onUpdateSettings,
  activeSubTab = 'timetable',
}) {
  const [subTab, setSubTab] = useState(activeSubTab);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'Academics',
    priority: 'High',
    audience: 'All Students & Faculty',
    content: '',
  });

  const [settingsForm, setSettingsForm] = useState({
    ...settings,
    cardTermsText: (settings?.cardTerms || []).join('\n'),
  });
  const [savedBanner, setSavedBanner] = useState(false);

  const currentTimetable = timetable[0] || {
    className: '10',
    section: 'A',
    roomNo: 'Block B • Room 204',
    classTeacher: 'Prof. Radhika Iyer',
    schedule: {},
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!noticeForm.title.trim()) return;
    await onAddNotice(noticeForm);
    setNoticeForm({
      title: '',
      category: 'Academics',
      priority: 'High',
      audience: 'All Students & Faculty',
      content: '',
    });
  };

  const handleLogoOrSigUpload = (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSettingsForm((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const payload = {
      ...settingsForm,
      cardTerms: settingsForm.cardTermsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    delete payload.cardTermsText;
    await onUpdateSettings(payload);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const typeBadge = {
    Theory: 'bg-blue-50 text-blue-700 border-blue-200',
    Practical: 'bg-purple-50 text-purple-700 border-purple-200',
    Lab: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Activity: 'bg-amber-50 text-amber-800 border-amber-200',
    Tutorial: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
          <button
            type="button"
            onClick={() => setSubTab('timetable')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
              subTab === 'timetable'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            <Clock className="w-4 h-4" />
            Class Timetable & Periods
          </button>

          <button
            type="button"
            onClick={() => setSubTab('notices')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
              subTab === 'notices'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notice Board & Circulars ({notices.length})
          </button>

          <button
            type="button"
            onClick={() => setSubTab('settings')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
              subTab === 'settings'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            <Settings className="w-4 h-4" />
            School Branding & ID Card Settings
          </button>
        </div>
      </div>

      {subTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Weekly Academic Timetable — Class {currentTimetable.className} Section{' '}
                {currentTimetable.section}
              </h3>
              <p className="text-xs text-slate-500">
                Room: {currentTimetable.roomNo} • Class Teacher:{' '}
                <strong>{currentTimetable.classTeacher}</strong>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(currentTimetable.schedule || {}).map(
              ([day, periods]) => (
                <div
                  key={day}
                  className="rounded-xl border border-slate-200 overflow-hidden"
                >
                  <div className="bg-slate-900 text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex justify-between">
                    <span>{day}</span>
                    <span className="text-amber-300 font-mono">
                      6 Academic Periods
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                    {periods.map((p) => (
                      <div key={p.period} className="p-3 bg-white space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            P-{p.period} • {p.time}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                              typeBadge[p.type] || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {p.type}
                          </span>
                        </div>
                        <div className="font-black text-xs text-slate-900">
                          {p.subject}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {p.teacher}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {subTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-base font-black text-slate-900 mb-3">
              Publish New School Circular / Notice
            </h3>
            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={(e) =>
                    setNoticeForm({ ...noticeForm, title: e.target.value })
                  }
                  placeholder="e.g. Winter Uniform & Smart ID Card Notice"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Administration">Administration</option>
                    <option value="Examinations">Examinations</option>
                    <option value="Sports & Events">Sports & Events</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={noticeForm.priority}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={noticeForm.audience}
                  onChange={(e) =>
                    setNoticeForm({ ...noticeForm, audience: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Circular Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={noticeForm.content}
                  onChange={(e) =>
                    setNoticeForm({ ...noticeForm, content: e.target.value })
                  }
                  placeholder="Write detailed announcement..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Publish Circular
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                        {n.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {n.date} • {n.audience}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm mt-1">
                      {n.title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteNotice(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {n.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-4xl">
          <h3 className="text-lg font-black text-slate-900 mb-1">
            School Branding, Crest, Signature & ID Card Configuration
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Changes saved here immediately update all Student ID Cards, Faculty ID Cards, Report Cards, and Fee Receipts.
          </p>

          {savedBanner && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              School branding and ID card settings saved!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  School Full Name (Printed on Card Header)
                </label>
                <input
                  type="text"
                  value={settingsForm.schoolName}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, schoolName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Affiliation / Registration Line
                </label>
                <input
                  type="text"
                  value={settingsForm.affiliation}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      affiliation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Campus Address
                </label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, address: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Helpline Phone Numbers
                </label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Website
                </label>
                <input
                  type="text"
                  value={settingsForm.website}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, website: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Academic Session
                </label>
                <input
                  type="text"
                  value={settingsForm.academicYear}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      academicYear: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ID Card Valid Upto Date
                </label>
                <input
                  type="text"
                  value={settingsForm.validUpto}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, validUpto: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Principal Name
                </label>
                <input
                  type="text"
                  value={settingsForm.principalName}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      principalName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <img
                  src={settingsForm.logo}
                  alt="School Logo"
                  className="w-16 h-16 rounded-full object-contain bg-white border border-slate-200 p-1"
                />
                <div>
                  <div className="font-bold text-slate-800 mb-1">
                    School Crest / Logo
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoOrSigUpload('logo', e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <img
                  src={settingsForm.principalSignature}
                  alt="Principal Signature"
                  className="w-28 h-14 object-contain bg-white border border-slate-200 p-1 rounded"
                />
                <div>
                  <div className="font-bold text-slate-800 mb-1">
                    Principal Signature
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Signature
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleLogoOrSigUpload('principalSignature', e)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ID Card Back-Side Instructions (One rule per line)
              </label>
              <textarea
                rows={3}
                value={settingsForm.cardTermsText}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    cardTermsText: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
            >
              Save School Branding & Card Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
