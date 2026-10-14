import React, { useState, useMemo } from 'react';
import IdCardRenderer, { ID_CARD_TEMPLATES } from './IdCardRenderer';
import PhotoCaptureInput from './PhotoCaptureInput';
import { downloadIdCardPng } from '../utils/helpers';
import {
  CreditCard,
  Printer,
  Download,
  CheckSquare,
  Square,
  Search,
  Sparkles,
  Users,
  Briefcase,
  QrCode,
  Sliders,
  Eye,
  X,
  Camera,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export default function IdCardStudio({
  students = [],
  staff = [],
  settings,
  onUpdateStudent,
  onUpdateStaff,
  initialSelectedPerson = null,
}) {
  const [cardMode, setCardMode] = useState(
    initialSelectedPerson?.employeeCode ? 'staff' : 'student'
  );
  const [viewLayout, setViewLayout] = useState('studio');
  const [template, setTemplate] = useState(settings?.defaultCardTemplate || 'royal');
  const [side, setSide] = useState('both');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [houseFilter, setHouseFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState(() =>
    students.map((s) => s.id)
  );
  const [activePersonId, setActivePersonId] = useState(
    initialSelectedPerson?.id || students[0]?.id || ''
  );
  const [downloadingId, setDownloadingId] = useState('');
  const [qrModalData, setQrModalData] = useState(null);
  const [quickPhotoOpen, setQuickPhotoOpen] = useState(false);

  const [options, setOptions] = useState({
    showQr: true,
    showBarcode: true,
    showBloodGroup: true,
    showSignature: true,
    showTransport: true,
    showLanyardSlot: true,
    showCropMarks: false,
  });

  const pool = cardMode === 'staff' ? staff : students;

  const filteredList = useMemo(() => {
    return pool.filter((item) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q) ||
        item.rollNo?.toLowerCase().includes(q) ||
        item.admissionNo?.toLowerCase().includes(q) ||
        item.employeeCode?.toLowerCase().includes(q) ||
        item.department?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (cardMode === 'student') {
        if (classFilter !== 'ALL' && String(item.className) !== classFilter) return false;
        if (sectionFilter !== 'ALL' && item.section !== sectionFilter) return false;
        if (houseFilter !== 'ALL' && item.house !== houseFilter) return false;
      }
      return true;
    });
  }, [pool, search, cardMode, classFilter, sectionFilter, houseFilter]);

  const activePerson = useMemo(() => {
    return (
      filteredList.find((p) => p.id === activePersonId) ||
      pool.find((p) => p.id === activePersonId) ||
      filteredList[0] ||
      pool[0] ||
      null
    );
  }, [filteredList, pool, activePersonId]);

  const bulkSelectedPeople = useMemo(() => {
    const list = filteredList.filter((p) => selectedIds.includes(p.id));
    return list.length > 0 ? list : filteredList;
  }, [filteredList, selectedIds]);

  const handleModeSwitch = (mode) => {
    setCardMode(mode);
    const targetPool = mode === 'staff' ? staff : students;
    setSelectedIds(targetPool.map((p) => p.id));
    if (targetPool[0]) setActivePersonId(targetPool[0].id);
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredList.map((p) => p.id);
    const allSelected = filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleDownloadPng = async (person) => {
    if (!person) return;
    setDownloadingId(person.id);
    try {
      await downloadIdCardPng({
        person,
        settings,
        isStaff: cardMode === 'staff',
        template,
      });
    } finally {
      setDownloadingId('');
    }
  };

  const handlePrintCards = () => {
    window.print();
  };

  const handleQuickPhotoChange = async (newPhotoDataUrl) => {
    if (!activePerson) return;
    if (cardMode === 'staff') {
      await onUpdateStaff(activePerson.id, { photo: newPhotoDataUrl });
    } else {
      await onUpdateStudent(activePerson.id, { photo: newPhotoDataUrl });
    }
  };

  const availableClasses = useMemo(() => {
    const set = new Set(students.map((s) => String(s.className)));
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [students]);

  return (
    <div className="space-y-6">
      <div className="no-print bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              CR80 Smart PVC Identity Card Studio (Front & Back + QR + Barcode)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Identity Card Generator & Bulk Print Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Design, customize, verify QR codes, export high-resolution PNGs, or print A4 bulk sheets for Students & Faculty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => handleModeSwitch('student')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  cardMode === 'student'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Students ({students.length})
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('staff')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  cardMode === 'staff'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Faculty & Staff ({staff.length})
              </button>
            </div>

            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewLayout('studio')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  viewLayout === 'studio'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Interactive Studio
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('bulk')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  viewLayout === 'bulk'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Bulk A4 Print Sheet ({bulkSelectedPeople.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrintCards}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Print / Save PDF
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
          <div className="xl:col-span-7">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select ID Card Design Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.values(ID_CARD_TEMPLATES).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplate(tpl.id)}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition ${
                    template === tpl.id
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-full flex items-center justify-between mb-1.5">
                    <span
                      className={`w-6 h-3 rounded bg-gradient-to-r ${tpl.headerGradient}`}
                    />
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {tpl.orientation === 'horizontal' ? 'Wide' : 'Vert'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">
                    {tpl.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="xl:col-span-5 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Card Side & Elements
              </span>
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[11px] font-bold">
                {[
                  { id: 'both', label: 'Front + Back' },
                  { id: 'front', label: 'Front Only' },
                  { id: 'back', label: 'Back Only' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSide(s.id)}
                    className={`px-2.5 py-1 rounded-md transition ${
                      side === s.id
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'showQr', label: 'QR Code' },
                { key: 'showBarcode', label: 'Barcode' },
                { key: 'showBloodGroup', label: 'Blood Group' },
                { key: 'showSignature', label: 'Principal Sign' },
                { key: 'showTransport', label: 'Bus / Dept' },
                { key: 'showLanyardSlot', label: 'Slot Punch' },
                { key: 'showCropMarks', label: 'Crop Marks' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() =>
                    setOptions((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))
                  }
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                    options[opt.key]
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  {options[opt.key] ? '✓ ' : '+ '}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                cardMode === 'staff'
                  ? 'Search faculty by name, employee ID, department...'
                  : 'Search student by name, ID, roll no, admission no...'
              }
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {cardMode === 'student' && (
            <>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="ALL">All Classes</option>
                {availableClasses.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>

              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="ALL">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
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
            </>
          )}

          <button
            type="button"
            onClick={toggleSelectAllFiltered}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
          >
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            Select/Deselect Filtered ({filteredList.length})
          </button>
        </div>
      </div>

      {viewLayout === 'studio' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="no-print lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                {cardMode === 'staff' ? 'Faculty Roster' : 'Student Roster'} (
                {filteredList.length})
              </span>
              <span className="text-[11px] font-semibold text-indigo-600">
                {selectedIds.length} selected for bulk
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredList.map((person) => {
                const isActive = activePerson?.id === person.id;
                const isChecked = selectedIds.includes(person.id);
                return (
                  <div
                    key={person.id}
                    onClick={() => setActivePersonId(person.id)}
                    className={`p-3 flex items-center gap-3 cursor-pointer transition ${
                      isActive
                        ? 'bg-indigo-50/90 border-l-4 border-l-indigo-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectOne(person.id);
                      }}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <img
                      src={person.photo}
                      alt={person.name}
                      className="w-10 h-11 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {person.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {cardMode === 'staff'
                          ? `${person.designation} • ${person.department}`
                          : `Class ${person.className}-${person.section} • Roll #${person.rollNo}`}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono font-semibold text-indigo-600">
                          {person.id}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-rose-50 text-rose-700 font-bold rounded">
                          {person.bloodGroup}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredList.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching records found. Try clearing filters.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {activePerson ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 print-container">
                <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-slate-900">
                        {activePerson.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700">
                        {activePerson.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Click the QR code on the card to test digital verification scanner.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickPhotoOpen((v) => !v)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      {quickPhotoOpen ? 'Hide Photo Studio' : 'Update Photo / Webcam'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadPng(activePerson)}
                      disabled={downloadingId === activePerson.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {downloadingId === activePerson.id
                        ? 'Rendering High-Res PNG...'
                        : 'Download High-Res PNG (Front & Back)'}
                    </button>

                    <button
                      type="button"
                      onClick={handlePrintCards}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      Print Card
                    </button>
                  </div>
                </div>

                {quickPhotoOpen && (
                  <div className="no-print mb-6">
                    <PhotoCaptureInput
                      value={activePerson.photo}
                      name={activePerson.name}
                      gender={activePerson.gender}
                      role={cardMode}
                      onChange={handleQuickPhotoChange}
                    />
                  </div>
                )}

                <div className="py-4 px-2 bg-slate-100/80 rounded-2xl border border-slate-200/70 flex items-center justify-center overflow-x-auto print-container">
                  <IdCardRenderer
                    person={activePerson}
                    settings={settings}
                    isStaff={cardMode === 'staff'}
                    template={template}
                    side={side}
                    options={options}
                    onInspectQr={(person, payload, qrImg) =>
                      setQrModalData({ person, payload, qrImg })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                Select a student or staff member to preview their ID card.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 print-container">
          <div className="no-print mb-6 pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Bulk A4 Print Sheet — {bulkSelectedPeople.length}{' '}
                {cardMode === 'staff' ? 'Faculty Cards' : 'Student Cards'} Ready
              </h3>
              <p className="text-xs text-slate-500">
                Formatted with exact print color preservation. Click "Print All Selected Cards" and choose your printer or "Save as PDF".
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrintCards}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              Print All {bulkSelectedPeople.length} Cards Now
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {bulkSelectedPeople.map((person) => (
              <div
                key={person.id}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 print-container"
              >
                <div className="no-print w-full flex items-center justify-between px-2 pb-1">
                  <span className="text-xs font-bold text-slate-800">
                    {person.name} ({person.id})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownloadPng(person)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <Download className="w-3 h-3" /> PNG
                  </button>
                </div>
                <IdCardRenderer
                  person={person}
                  settings={settings}
                  isStaff={cardMode === 'staff'}
                  template={template}
                  side={side}
                  options={options}
                  onInspectQr={(p, payload, qrImg) =>
                    setQrModalData({ person: p, payload, qrImg })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {qrModalData && (
        <div className="no-print fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">
                    QR Verification Payload
                  </h4>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Cryptographically Validated ID
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQrModalData(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={qrModalData.qrImg}
                alt="QR"
                className="w-24 h-24 rounded-lg border border-slate-200 bg-white p-1"
              />
              <div className="space-y-1 text-xs">
                <div className="font-black text-slate-900">
                  {qrModalData.person.name}
                </div>
                <div className="text-slate-600 font-mono font-bold">
                  ID: {qrModalData.person.id}
                </div>
                <div className="text-rose-600 font-bold">
                  Blood Group: {qrModalData.person.bloodGroup}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Emergency: {qrModalData.person.emergencyPhone || qrModalData.person.phone}
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
                Encoded Scanner JSON Data:
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 text-[11px] font-mono overflow-x-auto">
                {JSON.stringify(JSON.parse(qrModalData.payload), null, 2)}
              </pre>
            </div>

            <button
              type="button"
              onClick={() => setQrModalData(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Close Scanner Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
