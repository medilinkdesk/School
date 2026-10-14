import React, { useEffect, useState } from 'react';
import {
  generateQrDataUrl,
  generateBarcodeSvgDataUrl,
  generateIllustratedAvatar,
} from '../utils/helpers';
import { Droplets, Phone, ShieldCheck, Bus, MapPin } from 'lucide-react';

export const ID_CARD_TEMPLATES = {
  royal: {
    id: 'royal',
    name: 'Royal Academic Crest',
    orientation: 'vertical',
    headerGradient: 'from-blue-950 via-blue-900 to-indigo-950',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-400',
    borderAccent: 'border-amber-400',
    pillBg: 'bg-blue-900 text-white',
    metaBg: 'bg-blue-50/80 border-blue-100',
    footerBg: 'bg-blue-950',
    qrColor: '#1e3a8a',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Modern Wave',
    orientation: 'vertical',
    headerGradient: 'from-emerald-950 via-emerald-800 to-teal-900',
    accentBg: 'bg-emerald-400',
    accentText: 'text-emerald-300',
    borderAccent: 'border-emerald-400',
    pillBg: 'bg-emerald-800 text-white',
    metaBg: 'bg-emerald-50/80 border-emerald-100',
    footerBg: 'bg-emerald-950',
    qrColor: '#065f46',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Heritage Elite',
    orientation: 'vertical',
    headerGradient: 'from-rose-950 via-red-900 to-amber-950',
    accentBg: 'bg-amber-400',
    accentText: 'text-amber-300',
    borderAccent: 'border-amber-400',
    pillBg: 'bg-rose-900 text-white',
    metaBg: 'bg-rose-50/70 border-rose-100',
    footerBg: 'bg-rose-950',
    qrColor: '#881337',
  },
  indigo: {
    id: 'indigo',
    name: 'Cyber Indigo Neo',
    orientation: 'vertical',
    headerGradient: 'from-slate-950 via-indigo-950 to-violet-950',
    accentBg: 'bg-cyan-400',
    accentText: 'text-cyan-300',
    borderAccent: 'border-cyan-400',
    pillBg: 'bg-indigo-900 text-white',
    metaBg: 'bg-indigo-50/70 border-indigo-100',
    footerBg: 'bg-slate-950',
    qrColor: '#312e81',
  },
  landscape: {
    id: 'landscape',
    name: 'Executive Horizontal CR80',
    orientation: 'horizontal',
    headerGradient: 'from-slate-900 via-blue-950 to-indigo-950',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-400',
    borderAccent: 'border-amber-400',
    pillBg: 'bg-blue-900 text-white',
    metaBg: 'bg-slate-50 border-slate-200',
    footerBg: 'bg-slate-900',
    qrColor: '#0f172a',
  },
};

export default function IdCardRenderer({
  person,
  settings,
  isStaff = false,
  template = 'royal',
  side = 'both',
  options = {
    showQr: true,
    showBarcode: true,
    showBloodGroup: true,
    showSignature: true,
    showTransport: true,
    showLanyardSlot: true,
    showCropMarks: false,
  },
  onInspectQr,
}) {
  const [qrUrl, setQrUrl] = useState('');
  const theme = ID_CARD_TEMPLATES[template] || ID_CARD_TEMPLATES.royal;

  const qrPayloadString = JSON.stringify({
    verifiedBy: settings?.schoolName || 'SXIA',
    session: settings?.academicYear || '2026-2027',
    type: isStaff ? 'FACULTY_ID' : 'STUDENT_ID',
    id: person?.id,
    code: isStaff ? person?.employeeCode : person?.admissionNo,
    name: person?.name,
    classOrRole: isStaff
      ? `${person?.designation} (${person?.department})`
      : `Class ${person?.className}-${person?.section} | Roll #${person?.rollNo}`,
    bloodGroup: person?.bloodGroup,
    emergencyContact: person?.emergencyPhone || person?.phone,
    validUpto: settings?.validUpto || '31 Mar 2027',
  });

  useEffect(() => {
    let mounted = true;
    generateQrDataUrl(qrPayloadString, theme.qrColor).then((url) => {
      if (mounted) setQrUrl(url);
    });
    return () => {
      mounted = false;
    };
  }, [qrPayloadString, theme.qrColor]);

  if (!person) return null;

  const barcodeUrl = generateBarcodeSvgDataUrl(person.id, '#0f172a');
  const avatarSrc =
    person.photo ||
    generateIllustratedAvatar(
      person.name,
      person.gender,
      isStaff ? 'staff' : 'student'
    );

  const houseBadgeColors = {
    'Phoenix Red': 'bg-rose-600 text-white',
    'Titan Blue': 'bg-blue-600 text-white',
    'Emerald Green': 'bg-emerald-600 text-white',
    'Solar Gold': 'bg-amber-500 text-slate-950',
  };

  if (theme.orientation === 'horizontal') {
    const renderHorizontalFront = () => (
      <div
        className={`id-card-print-unit relative w-[430px] h-[272px] rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between select-none ${
          options.showCropMarks ? 'ring-1 ring-dashed ring-slate-400' : ''
        }`}
      >
        <div className={`bg-gradient-to-r ${theme.headerGradient} px-3.5 py-2.5 flex items-center justify-between border-b-4 border-amber-400`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={settings.logo}
              alt="Logo"
              className="w-10 h-10 rounded-full bg-white/10 p-0.5 object-contain shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-white font-black text-xs tracking-wide uppercase truncate">
                {settings.schoolName}
              </h3>
              <p className="text-[9px] text-amber-300 font-semibold truncate">
                {settings.affiliation}
              </p>
              <p className="text-[8.5px] text-slate-300 truncate">
                {settings.address}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <span className="inline-block px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">
              {isStaff ? 'STAFF ID' : 'STUDENT ID'}
            </span>
            <div className="text-[8.5px] text-white/80 font-mono mt-0.5">
              {settings.academicYear}
            </div>
          </div>
        </div>

        <div className="flex-1 px-3.5 py-2 flex gap-3 items-center bg-gradient-to-br from-white via-slate-50 to-blue-50/40">
          <div className="relative shrink-0 flex flex-col items-center">
            <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-blue-900 shadow-md bg-slate-100">
              <img src={avatarSrc} alt={person.name} className="w-full h-full object-cover" />
            </div>
            {options.showBloodGroup && (
              <span className="-mt-2.5 z-10 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] shadow">
                <Droplets className="w-2.5 h-2.5" /> {person.bloodGroup}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-slate-900 text-sm truncate">
                {person.name}
              </h4>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-900 text-white text-[10px] font-bold">
              {isStaff
                ? `${person.designation} • ${person.department}`
                : `Class ${person.className} - Sec ${person.section} | Roll #${person.rollNo}`}
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1 text-[9.5px]">
              <div>
                <span className="text-slate-400 font-semibold">ID No: </span>
                <span className="font-bold text-slate-800">{person.id}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">DOB: </span>
                <span className="font-bold text-slate-800">{person.dob}</span>
              </div>
              <div className="col-span-2 truncate">
                <span className="text-slate-400 font-semibold">
                  {isStaff ? 'Qual: ' : 'Guardian: '}
                </span>
                <span className="font-bold text-slate-800">
                  {isStaff ? person.qualification : person.fatherName}
                </span>
              </div>
              <div className="col-span-2 truncate">
                <span className="text-slate-400 font-semibold">Phone: </span>
                <span className="font-bold text-slate-800">{person.phone}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-between h-full py-0.5">
            {options.showQr && qrUrl && (
              <button
                type="button"
                onClick={() => onInspectQr && onInspectQr(person, qrPayloadString, qrUrl)}
                title="Click to inspect QR verification payload"
                className="p-1 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-500 transition"
              >
                <img src={qrUrl} alt="QR" className="w-16 h-16" />
              </button>
            )}
            {options.showSignature && (
              <div className="text-center">
                <img
                  src={settings.principalSignature}
                  alt="Signature"
                  className="h-6 mx-auto object-contain"
                />
                <div className="text-[7.5px] font-bold text-slate-600 uppercase tracking-wider border-t border-slate-300 pt-0.5">
                  Principal
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 text-white px-3.5 py-1 flex items-center justify-between text-[8.5px]">
          <span className="font-mono text-amber-300 font-semibold">
            VALID UPTO: {settings.validUpto}
          </span>
          <span className="truncate">{settings.phone} • {settings.website}</span>
        </div>
      </div>
    );

    const renderHorizontalBack = () => (
      <div
        className={`id-card-print-unit relative w-[430px] h-[272px] rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between select-none ${
          options.showCropMarks ? 'ring-1 ring-dashed ring-slate-400' : ''
        }`}
      >
        <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between border-b-2 border-amber-400">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
            Emergency & Verification Details
          </span>
          <span className="text-[9px] font-mono text-slate-300">
            {isStaff ? person.employeeCode : person.admissionNo}
          </span>
        </div>

        <div className="p-3.5 flex-1 grid grid-cols-12 gap-3 items-center text-[10px]">
          <div className="col-span-8 space-y-1.5">
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 space-y-1">
              <div className="text-[9px] font-black text-rose-700 uppercase">
                Emergency Contact & Residential Address
              </div>
              <div className="font-bold text-slate-900">
                Emergency Tel: {person.emergencyPhone || person.phone}
              </div>
              <div className="text-slate-700 text-[9.5px] leading-snug">
                {person.address}
              </div>
              {options.showTransport && (
                <div className="text-indigo-800 font-semibold text-[9px]">
                  {isStaff ? `Dept: ${person.department}` : `Transport: ${person.busRoute}`}
                </div>
              )}
            </div>

            <ul className="text-[8.5px] text-slate-600 space-y-0.5 list-disc pl-3.5">
              {(settings.cardTerms || []).slice(0, 2).map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 flex flex-col items-center justify-center border-l border-slate-200 pl-2 space-y-1.5">
            {options.showBarcode && (
              <img src={barcodeUrl} alt="Barcode" className="w-full h-9 object-contain" />
            )}
            <div className="text-[8.5px] font-mono font-bold text-slate-700">
              {person.id}
            </div>
            <div className="text-[8px] text-center text-slate-500 leading-tight">
              If found, please return to:
              <br />
              <strong className="text-slate-800">{settings.shortName || 'School Office'}</strong>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-300 px-3.5 py-1 text-center text-[8.5px]">
          {settings.schoolName} • {settings.address}
        </div>
      </div>
    );

    return (
      <div className="flex flex-wrap items-center justify-center gap-5">
        {(side === 'front' || side === 'both') && renderHorizontalFront()}
        {(side === 'back' || side === 'both') && renderHorizontalBack()}
      </div>
    );
  }

  const renderVerticalFront = () => (
    <div
      className={`id-card-print-unit relative w-[312px] h-[492px] rounded-[20px] bg-white shadow-xl border border-slate-200/90 overflow-hidden flex flex-col justify-between select-none ${
        options.showCropMarks ? 'ring-1 ring-dashed ring-slate-400' : ''
      }`}
    >
      {options.showLanyardSlot && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-12 h-2 rounded-full bg-slate-950/50 border border-white/30 shadow-inner" />
      )}

      <div className={`relative bg-gradient-to-br ${theme.headerGradient} pt-5 pb-12 px-3.5 text-center`}>
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-12 -left-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5 text-left">
          <img
            src={settings.logo}
            alt="School Crest"
            className="w-12 h-12 rounded-full bg-white/10 p-0.5 object-contain shrink-0 shadow"
          />
          <div className="min-w-0">
            <h3 className="text-white font-black text-[12.5px] leading-tight tracking-tight uppercase">
              {settings.schoolName}
            </h3>
            <p className={`text-[9px] font-bold ${theme.accentText} truncate mt-0.5`}>
              {settings.affiliation}
            </p>
            <p className="text-[8.5px] text-slate-200/90 leading-tight line-clamp-1 mt-0.5">
              {settings.address}
            </p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between px-1">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${theme.accentBg} text-slate-950`}
          >
            <ShieldCheck className="w-3 h-3" />
            {isStaff ? 'FACULTY IDENTITY CARD' : 'STUDENT IDENTITY CARD'}
          </span>
          <span className="text-[9.5px] font-mono font-bold text-white/90 bg-white/10 px-2 py-0.5 rounded-full">
            {settings.academicYear}
          </span>
        </div>

        <div className={`absolute bottom-0 inset-x-0 h-1.5 ${theme.accentBg}`} />
      </div>

      <div className="relative -mt-10 z-10 flex flex-col items-center px-4">
        <div className="relative">
          <div
            className={`w-24 h-28 rounded-2xl overflow-hidden border-[3px] ${theme.borderAccent} shadow-lg bg-white`}
          >
            <img
              src={avatarSrc}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          </div>

          {options.showBloodGroup && (
            <div
              title={`Blood Group: ${person.bloodGroup}`}
              className="absolute -bottom-2 -right-2.5 px-2 py-0.5 rounded-lg bg-rose-600 text-white font-black text-[10px] shadow-md border-2 border-white flex items-center gap-0.5"
            >
              <Droplets className="w-2.5 h-2.5 fill-current" />
              {person.bloodGroup || 'O+'}
            </div>
          )}

          {!isStaff && person.house && (
            <div
              className={`absolute -bottom-2 -left-2.5 px-2 py-0.5 rounded-lg font-extrabold text-[8.5px] shadow-md border-2 border-white uppercase tracking-wider ${
                houseBadgeColors[person.house] || 'bg-indigo-600 text-white'
              }`}
            >
              {person.house.split(' ')[0]}
            </div>
          )}
        </div>

        <h4 className="mt-3 font-black text-slate-900 text-[15px] leading-tight text-center">
          {person.name}
        </h4>
        <div
          className={`mt-1 px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${theme.pillBg}`}
        >
          {isStaff
            ? `${person.designation}`
            : `CLASS ${person.className} - SEC ${person.section}  •  ROLL #${person.rollNo}`}
        </div>
      </div>

      <div className="px-4 mt-2 flex-1 flex flex-col justify-center">
        <div className={`rounded-xl border p-2.5 space-y-1 text-[10.5px] ${theme.metaBg}`}>
          {isStaff ? (
            <>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Employee ID</span>
                <span className="font-bold text-slate-900 font-mono">
                  {person.id} ({person.employeeCode})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Department</span>
                <span className="font-bold text-slate-900 truncate max-w-[165px]">
                  {person.department}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Qualification</span>
                <span className="font-bold text-slate-900 truncate max-w-[165px]">
                  {person.qualification}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Date of Birth</span>
                <span className="font-bold text-slate-900">{person.dob}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Mobile No.</span>
                <span className="font-bold text-slate-900">{person.phone}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">ID / Adm No.</span>
                <span className="font-bold text-slate-900 font-mono">
                  {person.id} • {person.admissionNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Date of Birth</span>
                <span className="font-bold text-slate-900">{person.dob}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Father's Name</span>
                <span className="font-bold text-slate-900 truncate max-w-[165px]">
                  {person.fatherName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Guardian Tel</span>
                <span className="font-bold text-slate-900">{person.phone}</span>
              </div>
              {options.showTransport && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold flex items-center gap-1">
                    <Bus className="w-3 h-3 text-indigo-600" /> Transport
                  </span>
                  <span className="font-bold text-indigo-950 truncate max-w-[160px] text-[10px]">
                    {person.busRoute || 'Self Drop'}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="px-4 py-1.5 flex items-end justify-between gap-2">
        <div className="flex-1 min-w-0">
          {options.showBarcode ? (
            <div className="flex flex-col items-start">
              <img
                src={barcodeUrl}
                alt="Barcode"
                className="h-7 w-36 object-contain object-left"
              />
              <span className="text-[8.5px] font-mono font-bold text-slate-500 tracking-wider">
                {person.id} • VALID: {settings.validUpto}
              </span>
            </div>
          ) : (
            <span className="text-[9px] font-mono font-bold text-slate-500">
              VALID UPTO: {settings.validUpto}
            </span>
          )}
        </div>

        {options.showSignature && (
          <div className="text-center shrink-0">
            <img
              src={settings.principalSignature}
              alt="Principal Sign"
              className="h-7 w-20 object-contain mx-auto"
            />
            <div className="text-[8px] font-extrabold text-slate-700 uppercase tracking-wider border-t border-slate-300 pt-0.5">
              Principal Sign
            </div>
          </div>
        )}
      </div>

      <div
        className={`${theme.footerBg} text-white px-3 py-1.5 text-center text-[8.5px] font-medium tracking-wide flex items-center justify-between`}
      >
        <span>Tel: {settings.phone.split(',')[0]}</span>
        <span className="text-amber-300 font-semibold">{settings.website}</span>
      </div>
    </div>
  );

  const renderVerticalBack = () => (
    <div
      className={`id-card-print-unit relative w-[312px] h-[492px] rounded-[20px] bg-white shadow-xl border border-slate-200/90 overflow-hidden flex flex-col justify-between select-none ${
        options.showCropMarks ? 'ring-1 ring-dashed ring-slate-400' : ''
      }`}
    >
      {options.showLanyardSlot && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-12 h-2 rounded-full bg-slate-950/50 border border-white/30 shadow-inner" />
      )}

      <div className={`bg-gradient-to-r ${theme.headerGradient} pt-5 pb-2.5 px-4 text-center border-b-4 ${theme.borderAccent}`}>
        <div className="text-[11px] font-black text-white uppercase tracking-wider">
          Verification & Emergency Info
        </div>
        <div className="text-[8.5px] text-amber-300 font-mono">
          CARD REF: {person.id} • SESSION {settings.academicYear}
        </div>
      </div>

      <div className="px-4 pt-2.5 flex flex-col items-center">
        {options.showQr && qrUrl && (
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => onInspectQr && onInspectQr(person, qrPayloadString, qrUrl)}
              title="Click to inspect QR verification payload"
              className="p-2 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-600 transition shadow-sm group"
            >
              <img src={qrUrl} alt="Verification QR" className="w-24 h-24 object-contain" />
            </button>
            <span className="mt-1 text-[8.5px] font-extrabold text-slate-500 uppercase tracking-wider">
              Scan QR for Digital ID Verification
            </span>
          </div>
        )}
      </div>

      <div className="px-4 mt-1.5">
        <div className="rounded-xl bg-rose-50/90 border border-rose-200 p-2.5 space-y-1 text-[10px]">
          <div className="flex items-center justify-between text-rose-800 font-black text-[9.5px] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> Emergency Contact
            </span>
            <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded text-[8.5px]">
              Blood: {person.bloodGroup}
            </span>
          </div>
          <div className="font-extrabold text-slate-900 text-[11px]">
            {person.emergencyPhone || person.phone}
          </div>
          <div className="text-slate-700 text-[9.5px] leading-snug flex items-start gap-1 pt-0.5">
            <MapPin className="w-3 h-3 text-rose-600 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{person.address}</span>
          </div>
          {person.medicalNotes && person.medicalNotes !== 'None' && (
            <div className="text-[9px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
              Medical Note: {person.medicalNotes}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 mt-1.5 flex-1 flex flex-col justify-center">
        <div className="text-[9px] font-black text-slate-800 uppercase tracking-wider mb-1">
          Cardholder Instructions:
        </div>
        <ol className="text-[8.5px] text-slate-600 space-y-1 list-decimal pl-3.5 leading-tight">
          {(settings.cardTerms || []).map((term, i) => (
            <li key={i}>{term}</li>
          ))}
        </ol>
      </div>

      <div className={`${theme.footerBg} text-white p-2.5 text-center space-y-0.5`}>
        <div className="text-[8.5px] font-extrabold text-amber-300 uppercase tracking-widest">
          If found, please return to:
        </div>
        <div className="text-[10px] font-black tracking-wide">
          {settings.schoolName}
        </div>
        <div className="text-[8px] text-slate-300 leading-tight">
          {settings.address}
        </div>
        <div className="text-[8.5px] text-amber-200 font-semibold pt-0.5">
          Helpline: {settings.phone}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      {(side === 'front' || side === 'both') && renderVerticalFront()}
      {(side === 'back' || side === 'both') && renderVerticalBack()}
    </div>
  );
}
