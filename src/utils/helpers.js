import QRCode from 'qrcode';

export async function generateQrDataUrl(text, darkColor = '#0f172a') {
  try {
    return await QRCode.toDataURL(text, {
      width: 220,
      margin: 1,
      color: {
        dark: darkColor,
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('QR generation error:', err);
    return '';
  }
}

export function generateBarcodeSvgDataUrl(codeString = 'STU-1001', color = '#0f172a') {
  const clean = String(codeString).replace(/[^A-Za-z0-9-]/g, '') || 'ID1001';
  const bars = [];
  bars.push(2, 1, 1, 2, 3, 1);
  for (let i = 0; i < clean.length; i++) {
    const charCode = clean.charCodeAt(i);
    const b1 = (charCode % 3) + 1;
    const s1 = ((charCode >> 1) % 2) + 1;
    const b2 = ((charCode >> 2) % 3) + 1;
    const s2 = ((charCode >> 3) % 2) + 1;
    bars.push(b1, s1, b2, s2);
  }
  bars.push(2, 3, 1, 1, 2);

  let x = 6;
  let rects = '';
  for (let i = 0; i < bars.length; i++) {
    const w = bars[i] * 1.6;
    if (i % 2 === 0) {
      rects += `<rect x="${x.toFixed(1)}" y="2" width="${w.toFixed(1)}" height="28" fill="${color}" />`;
    }
    x += w;
  }
  const totalWidth = Math.max(120, Math.ceil(x + 6));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} 34" width="${totalWidth}" height="34">
    <rect width="${totalWidth}" height="34" fill="#ffffff" rx="2"/>
    ${rects}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateIllustratedAvatar(name = 'Student', gender = 'Male', role = 'student', paletteIndex = 0) {
  const palettes = [
    ['#2563eb', '#1d4ed8'],
    ['#7c3aed', '#5b21b6'],
    ['#059669', '#047857'],
    ['#d97706', '#b45309'],
    ['#e11d48', '#be123c'],
    ['#0284c7', '#0369a1'],
    ['#0d9488', '#0f766e'],
  ];
  const hash = String(name)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const [bgPrimary, bgSecondary] = palettes[(hash + paletteIndex) % palettes.length];
  const parts = String(name).trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase()
      : String(name).slice(0, 2).toUpperCase();

  const isFemale = String(gender).toLowerCase().startsWith('f');
  const hairColor = '#1e293b';
  const shirtColor = role === 'staff' ? '#1e3a8a' : '#f8fafc';
  const tieColor = role === 'staff' ? '#d97706' : '#dc2626';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 280" width="240" height="280">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgPrimary}" />
        <stop offset="100%" stop-color="${bgSecondary}" />
      </linearGradient>
    </defs>
    <rect width="240" height="280" fill="url(#bg)" />
    <circle cx="120" cy="60" r="110" fill="#ffffff" fill-opacity="0.07" />
    <path d="M35 280 C35 205 75 190 120 190 C165 190 205 205 205 280 Z" fill="${role === 'staff' ? '#0f172a' : '#1e3a8a'}" />
    <polygon points="95,190 120,245 145,190" fill="${shirtColor}" />
    <polygon points="114,205 126,205 130,275 120,285 110,275" fill="${tieColor}" />
    <rect x="103" y="155" width="34" height="42" rx="12" fill="#f6c492" />
    <ellipse cx="120" cy="115" rx="46" ry="54" fill="#fbd3a7" />
    ${
      isFemale
        ? `<path d="M70 125 C65 65 95 48 120 48 C145 48 175 65 170 125 C175 155 178 180 165 192 C160 165 162 135 160 110 C145 80 95 80 80 110 C78 135 80 165 75 192 C62 180 65 155 70 125 Z" fill="${hairColor}" />`
        : `<path d="M74 108 C72 64 95 52 120 52 C148 52 168 66 166 108 C158 86 142 78 120 78 C98 78 82 86 74 108 Z" fill="${hairColor}" />`
    }
    <circle cx="102" cy="114" r="4.5" fill="#1e293b" />
    <circle cx="138" cy="114" r="4.5" fill="#1e293b" />
    <path d="M92 103 Q102 98 111 103" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path d="M129 103 Q138 98 148 103" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path d="M106 140 Q120 151 134 140" stroke="#b45309" stroke-width="3" fill="none" stroke-linecap="round" />
    <rect x="14" y="14" width="38" height="24" rx="6" fill="#ffffff" fill-opacity="0.2" />
    <text x="33" y="30" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-weight="700" font-size="12">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function calculateGradeInfo(percentage) {
  const pct = Number(percentage) || 0;
  if (pct >= 91) return { grade: 'A1', gp: 10.0, remark: 'Outstanding', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (pct >= 81) return { grade: 'A2', gp: 9.0, remark: 'Excellent', color: 'text-teal-700 bg-teal-50 border-teal-200' };
  if (pct >= 71) return { grade: 'B1', gp: 8.0, remark: 'Very Good', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  if (pct >= 61) return { grade: 'B2', gp: 7.0, remark: 'Good', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  if (pct >= 51) return { grade: 'C1', gp: 6.0, remark: 'Satisfactory', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  if (pct >= 40) return { grade: 'C2', gp: 5.0, remark: 'Acceptable', color: 'text-orange-700 bg-orange-50 border-orange-200' };
  return { grade: 'E (Needs Improvement)', gp: 0.0, remark: 'Needs Improvement', color: 'text-rose-700 bg-rose-50 border-rose-200' };
}

export function amountToWords(num) {
  const n = Math.round(Number(num) || 0);
  if (n === 0) return 'Zero Rupees Only';
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertLessThanThousand(val) {
    let str = '';
    if (val >= 100) {
      str += ones[Math.floor(val / 100)] + ' Hundred ';
      val %= 100;
    }
    if (val >= 20) {
      str += tens[Math.floor(val / 10)] + ' ';
      val %= 10;
    }
    if (val > 0) {
      str += ones[val] + ' ';
    }
    return str.trim();
  }

  let result = '';
  let rem = n;
  if (rem >= 100000) {
    result += convertLessThanThousand(Math.floor(rem / 100000)) + ' Lakh ';
    rem %= 100000;
  }
  if (rem >= 1000) {
    result += convertLessThanThousand(Math.floor(rem / 1000)) + ' Thousand ';
    rem %= 1000;
  }
  if (rem > 0) {
    result += convertLessThanThousand(rem);
  }
  return `Rupees ${result.trim()} Only`;
}

export function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]).filter((k) => k !== 'photo');
  const csvContent = [
    headers.join(','),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const val = r[h] === null || r[h] === undefined ? '' : String(r[h]);
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function downloadIdCardPng({ person, settings, isStaff = false, template = 'royal' }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1420;
  canvas.height = 1040;
  const ctx = canvas.getContext('2d');

  const palettes = {
    royal: { primary: '#1e3a8a', secondary: '#172554', accent: '#d97706', light: '#eff6ff' },
    emerald: { primary: '#065f46', secondary: '#064e3b', accent: '#10b981', light: '#ecfdf5' },
    crimson: { primary: '#9f1239', secondary: '#881337', accent: '#f59e0b', light: '#fff1f2' },
    indigo: { primary: '#4338ca', secondary: '#312e81', accent: '#06b6d4', light: '#eef2ff' },
    landscape: { primary: '#0f172a', secondary: '#1e293b', accent: '#3b82f6', light: '#f8fafc' },
  };
  const theme = palettes[template] || palettes.royal;

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const qrPayload = JSON.stringify({
    school: settings.shortName || settings.schoolName,
    id: person.id,
    name: person.name,
    role: isStaff ? person.designation : `Class ${person.className}-${person.section}`,
    blood: person.bloodGroup,
    phone: person.emergencyPhone || person.phone,
  });
  const qrUrl = await generateQrDataUrl(qrPayload, theme.secondary);
  const barcodeUrl = generateBarcodeSvgDataUrl(person.id, '#0f172a');

  const [logoImg, photoImg, sigImg, qrImg, barcodeImg] = await Promise.all([
    loadImage(settings.logo),
    loadImage(person.photo || generateIllustratedAvatar(person.name, person.gender, isStaff ? 'staff' : 'student')),
    loadImage(settings.principalSignature),
    loadImage(qrUrl),
    loadImage(barcodeUrl),
  ]);

  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const fx = 60, fy = 50, fw = 620, fh = 940;
  ctx.save();
  roundRect(fx, fy, fw, fh, 28);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.clip();

  const grad = ctx.createLinearGradient(fx, fy, fx + fw, fy + 230);
  grad.addColorStop(0, theme.primary);
  grad.addColorStop(1, theme.secondary);
  ctx.fillStyle = grad;
  ctx.fillRect(fx, fy, fw, 225);

  ctx.fillStyle = theme.accent;
  ctx.fillRect(fx, fy + 220, fw, 10);

  if (logoImg) {
    ctx.drawImage(logoImg, fx + 28, fy + 28, 78, 78);
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText((settings.schoolName || '').slice(0, 34), fx + 120, fy + 58);
  ctx.fillStyle = '#fde68a';
  ctx.font = '600 13px Inter, sans-serif';
  ctx.fillText((settings.affiliation || '').slice(0, 52), fx + 120, fy + 84);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 12px Inter, sans-serif';
  ctx.fillText((settings.address || '').slice(0, 56), fx + 120, fy + 106);

  roundRect(fx + 190, fy + 132, 240, 34, 17);
  ctx.fillStyle = theme.accent;
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isStaff ? 'FACULTY IDENTITY CARD' : 'STUDENT IDENTITY CARD', fx + 310, fy + 154);

  roundRect(fx + 215, fy + 185, 190, 215, 20);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = theme.accent;
  ctx.stroke();

  if (photoImg) {
    ctx.save();
    roundRect(fx + 221, fy + 191, 178, 203, 15);
    ctx.clip();
    ctx.drawImage(photoImg, fx + 221, fy + 191, 178, 203);
    ctx.restore();
  }

  roundRect(fx + 375, fy + 365, 56, 40, 12);
  ctx.fillStyle = '#dc2626';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.fillText(person.bloodGroup || 'O+', fx + 403, fy + 391);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.fillText(person.name, fx + 310, fy + 444);

  ctx.fillStyle = theme.primary;
  ctx.font = 'bold 17px Inter, sans-serif';
  ctx.fillText(
    isStaff
      ? `${person.designation} • ${person.department}`
      : `CLASS ${person.className} - SECTION ${person.section}  |  ROLL NO: ${person.rollNo}`,
    fx + 310,
    fy + 474
  );

  roundRect(fx + 36, fy + 498, fw - 72, 260, 16);
  ctx.fillStyle = theme.light;
  ctx.fill();

  const fields = isStaff
    ? [
        ['Employee ID', `${person.id} (${person.employeeCode || ''})`],
        ['Qualification', person.qualification || 'M.Sc., B.Ed.'],
        ['Date of Birth', person.dob || '-'],
        ['Joining Date', person.joiningDate || '-'],
        ['Mobile No.', person.phone || '-'],
        ['Session', settings.academicYear || '2026-2027'],
      ]
    : [
        ['Student ID / Adm', `${person.id}  •  ${person.admissionNo}`],
        ['Date of Birth', person.dob || '-'],
        ["Father's Name", person.fatherName || '-'],
        ["Mother's Name", person.motherName || '-'],
        ['Guardian Phone', person.phone || '-'],
        ['House / Transport', `${person.house || 'Red'} • ${(person.busRoute || '').slice(0, 22)}`],
      ];

  ctx.textAlign = 'left';
  fields.forEach(([label, val], idx) => {
    const rowY = fy + 534 + idx * 38;
    ctx.fillStyle = '#64748b';
    ctx.font = '600 14px Inter, sans-serif';
    ctx.fillText(label.toUpperCase(), fx + 58, rowY);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText(`:  ${val}`, fx + 225, rowY);
  });

  if (barcodeImg) {
    ctx.drawImage(barcodeImg, fx + 44, fy + 785, 250, 55);
  }
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 12px JetBrains Mono, monospace';
  ctx.fillText(`ID: ${person.id} • VALID: ${settings.validUpto}`, fx + 48, fy + 858);

  if (sigImg) {
    ctx.drawImage(sigImg, fx + 415, fy + 780, 150, 48);
  }
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PRINCIPAL SIGNATURE', fx + 490, fy + 852);

  ctx.fillStyle = theme.primary;
  ctx.fillRect(fx, fy + fh - 46, fw, 46);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 13px Inter, sans-serif';
  ctx.fillText(`${settings.phone}  •  ${settings.website}`, fx + 310, fy + fh - 18);
  ctx.restore();

  const bx = 740, by = 50, bw = 620, bh = 940;
  ctx.save();
  roundRect(bx, by, bw, bh, 28);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.clip();

  ctx.fillStyle = theme.secondary;
  ctx.fillRect(bx, by, bw, 95);
  ctx.fillStyle = theme.accent;
  ctx.fillRect(bx, by + 95, bw, 8);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('IMPORTANT INFORMATION & VERIFICATION', bx + 310, by + 56);

  roundRect(bx + 210, by + 135, 200, 200, 18);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#cbd5e1';
  ctx.stroke();
  if (qrImg) {
    ctx.drawImage(qrImg, bx + 225, by + 150, 170, 170);
  }
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.fillText('SCAN QR FOR LIVE STUDENT / STAFF VERIFICATION', bx + 310, by + 360);

  roundRect(bx + 40, by + 385, bw - 80, 220, 16);
  ctx.fillStyle = '#fff1f2';
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#be123c';
  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.fillText('EMERGENCY & RESIDENTIAL DETAILS', bx + 64, by + 420);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.fillText(`Emergency Contact : ${person.emergencyPhone || person.phone}`, bx + 64, by + 455);
  ctx.fillText(`Blood Group       : ${person.bloodGroup}   |   Medical: ${person.medicalNotes || 'None'}`, bx + 64, by + 488);
  ctx.font = '500 14px Inter, sans-serif';
  ctx.fillText(`Address: ${(person.address || '').slice(0, 52)}`, bx + 64, by + 522);
  if ((person.address || '').length > 52) {
    ctx.fillText((person.address || '').slice(52, 104), bx + 64, by + 546);
  }
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.fillText(
    isStaff ? `Department: ${person.department}` : `Transport / Bus: ${person.busRoute || 'Self Drop'}`,
    bx + 64,
    by + 580
  );

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.fillText('TERMS & INSTRUCTIONS:', bx + 44, by + 650);

  ctx.fillStyle = '#334155';
  ctx.font = '500 13.5px Inter, sans-serif';
  const terms = settings.cardTerms || [
    'This card is non-transferable and must be worn visibly on campus.',
    'If found, please return to the School Administrative Office.',
  ];
  terms.forEach((line, i) => {
    ctx.fillText(`${i + 1}. ${line.slice(0, 66)}`, bx + 44, by + 684 + i * 44);
    if (line.length > 66) {
      ctx.fillText(`   ${line.slice(66, 132)}`, bx + 44, by + 704 + i * 44);
    }
  });

  ctx.fillStyle = theme.secondary;
  ctx.fillRect(bx, by + bh - 105, bw, 105);
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('IF FOUND, PLEASE RETURN TO:', bx + 310, by + bh - 74);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.fillText(settings.schoolName, bx + 310, by + bh - 50);
  ctx.font = '500 12.5px Inter, sans-serif';
  ctx.fillText(`${settings.address} • Tel: ${settings.phone}`, bx + 310, by + bh - 24);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `ID_CARD_${person.id}_${person.name.replace(/\s+/g, '_')}.png`;
  link.href = dataUrl;
  link.click();
}
