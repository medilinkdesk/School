import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'school_db.json');

// Helper to create crisp, realistic SVG avatar data URLs for seeded students/staff
function createAvatarSvg(initials, bgPrimary, bgSecondary, gender = 'M', role = 'student') {
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
    <circle cx="120" cy="60" r="110" fill="#ffffff" fill-opacity="0.06" />
    <path d="M35 280 C35 205 75 190 120 190 C165 190 205 205 205 280 Z" fill="${role === 'staff' ? '#0f172a' : '#1e3a8a'}" />
    <polygon points="95,190 120,245 145,190" fill="${shirtColor}" />
    <polygon points="114,205 126,205 130,275 120,285 110,275" fill="${tieColor}" />
    <rect x="103" y="155" width="34" height="42" rx="12" fill="#f6c492" />
    <ellipse cx="120" cy="115" rx="46" ry="54" fill="#fbd3a7" />
    ${
      gender === 'F'
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

function createSchoolLogoSvg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="shield" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e3a8a" />
        <stop offset="100%" stop-color="#312e81" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="56" fill="url(#shield)" stroke="url(#gold)" stroke-width="4" />
    <circle cx="60" cy="60" r="48" fill="none" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3,3" />
    <path d="M35 36 L60 24 L85 36 L85 62 C85 80 60 94 60 94 C60 94 35 80 35 62 Z" fill="#1e40af" stroke="url(#gold)" stroke-width="2.5" />
    <path d="M44 58 Q52 54 60 58 Q68 54 76 58 L76 72 Q68 68 60 72 Q52 68 44 72 Z" fill="#ffffff" />
    <path d="M60 34 C64 40 65 44 60 49 C55 44 56 40 60 34 Z" fill="#fbbf24" />
    <text x="60" y="108" text-anchor="middle" fill="#fde68a" font-family="serif" font-weight="bold" font-size="8.5" letter-spacing="1.5">ESTD 1998</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createSignatureSvg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60" width="220" height="60">
    <path d="M18 42 C28 15, 42 18, 36 40 C34 46, 52 22, 64 28 C72 32, 68 42, 78 36 C88 30, 96 18, 105 34 C112 45, 122 25, 135 30 C148 35, 162 20, 185 26" stroke="#1e3a8a" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M45 48 L175 44" stroke="#1e3a8a" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>
    <circle cx="165" cy="36" r="1.8" fill="#1e3a8a" />
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const initialSeedData = {
  settings: {
    schoolName: "ST. XAVIER'S INTERNATIONAL ACADEMY",
    shortName: "SXIA",
    tagline: "Excellence in Academics, Character & Global Leadership",
    affiliation: "CBSE Affiliation No: 2130498 • School Code: 65412",
    address: "Sector 14, Knowledge Park III, Institutional Area, New Delhi - 110075",
    phone: "+91 11 2658 9400, +91 98765 43210",
    email: "admissions@stxaviersacademy.edu.in",
    website: "www.stxaviersacademy.edu.in",
    academicYear: "2026-2027",
    validUpto: "31 March 2027",
    principalName: "Dr. Arvind K. Sharma",
    principalQualification: "M.Sc., M.Ed., Ph.D.",
    logo: createSchoolLogoSvg(),
    principalSignature: createSignatureSvg(),
    defaultCardTemplate: "royal",
    cardTerms: [
      "This identity card is non-transferable and remains the property of St. Xavier's International Academy.",
      "Students & staff must wear this card visibly inside the school premises and school transport.",
      "In case of loss or damage, report immediately to the Administrative Office (Duplicate fee ₹150)."
    ]
  },
  students: [
    {
      id: "STU-1001",
      admissionNo: "ADM/2026/001",
      rollNo: "1001",
      name: "Aarav Vikramaditya Verma",
      className: "10",
      section: "A",
      stream: "Science / STEM",
      gender: "Male",
      dob: "2011-04-14",
      bloodGroup: "O+",
      fatherName: "Rajeshwar Verma",
      motherName: "Sunita Verma",
      phone: "+91 98112 23344",
      emergencyPhone: "+91 98112 99887",
      email: "aarav.verma@student.sxia.edu.in",
      address: "B-42, Green Park Extension, South Delhi - 110016",
      house: "Phoenix Red",
      busRoute: "Route 04 - Green Park / Hauz Khas",
      admissionDate: "2020-04-05",
      status: "Active",
      medicalNotes: "None",
      photo: createAvatarSvg("AV", "#2563eb", "#1d4ed8", "M", "student")
    },
    {
      id: "STU-1002",
      admissionNo: "ADM/2026/002",
      rollNo: "1002",
      name: "Ananya Priyadarshini Nair",
      className: "10",
      section: "A",
      stream: "Science / STEM",
      gender: "Female",
      dob: "2011-08-22",
      bloodGroup: "A+",
      fatherName: "Krishnakumar Nair",
      motherName: "Meenakshi Nair",
      phone: "+91 98710 55432",
      emergencyPhone: "+91 98710 11223",
      email: "ananya.nair@student.sxia.edu.in",
      address: "Flat 804, Palm Grove Towers, Vasant Kunj, New Delhi - 110070",
      house: "Titan Blue",
      busRoute: "Route 02 - Vasant Kunj Sector B",
      admissionDate: "2020-04-08",
      status: "Active",
      medicalNotes: "Mild dust allergy",
      photo: createAvatarSvg("AN", "#7c3aed", "#5b21b6", "F", "student")
    },
    {
      id: "STU-1003",
      admissionNo: "ADM/2026/003",
      rollNo: "1003",
      name: "Rohan Deshmukh",
      className: "10",
      section: "B",
      stream: "Science / STEM",
      gender: "Male",
      dob: "2011-01-19",
      bloodGroup: "B+",
      fatherName: "Milind Deshmukh",
      motherName: "Kavita Deshmukh",
      phone: "+91 99104 77889",
      emergencyPhone: "+91 99104 00112",
      email: "rohan.deshmukh@student.sxia.edu.in",
      address: "C-118, Defence Colony, New Delhi - 110024",
      house: "Emerald Green",
      busRoute: "Route 07 - Lajpat Nagar / Def Col",
      admissionDate: "2021-03-29",
      status: "Active",
      medicalNotes: "None",
      photo: createAvatarSvg("RD", "#059669", "#047857", "M", "student")
    },
    {
      id: "STU-1004",
      admissionNo: "ADM/2026/004",
      rollNo: "1201",
      name: "Ishita Sengupta",
      className: "12",
      section: "A",
      stream: "PCM + Computer Science",
      gender: "Female",
      dob: "2009-11-03",
      bloodGroup: "AB+",
      fatherName: "Subrata Sengupta",
      motherName: "Rituparna Sengupta",
      phone: "+91 98180 66554",
      emergencyPhone: "+91 98180 33221",
      email: "ishita.sengupta@student.sxia.edu.in",
      address: "K-19, Chittaranjan Park, New Delhi - 110019",
      house: "Solar Gold",
      busRoute: "Route 05 - CR Park / Greater Kailash",
      admissionDate: "2018-04-02",
      status: "Active",
      medicalNotes: "Spectacles (-1.5D)",
      photo: createAvatarSvg("IS", "#d97706", "#b45309", "F", "student")
    },
    {
      id: "STU-1005",
      admissionNo: "ADM/2026/005",
      rollNo: "1202",
      name: "Kabir Singhania",
      className: "12",
      section: "A",
      stream: "Commerce + Mathematics",
      gender: "Male",
      dob: "2009-06-28",
      bloodGroup: "O-",
      fatherName: "Harshvardhan Singhania",
      motherName: "Nandini Singhania",
      phone: "+91 98101 44556",
      emergencyPhone: "+91 98101 88990",
      email: "kabir.singhania@student.sxia.edu.in",
      address: "Villa 12, Shanti Niketan, New Delhi - 110021",
      house: "Phoenix Red",
      busRoute: "Self / Chauffeur Drop",
      admissionDate: "2018-04-10",
      status: "Active",
      medicalNotes: "Rare Blood Group (O Negative)",
      photo: createAvatarSvg("KS", "#e11d48", "#be123c", "M", "student")
    },
    {
      id: "STU-1006",
      admissionNo: "ADM/2026/006",
      rollNo: "0901",
      name: "Zoya Fatima Khan",
      className: "9",
      section: "A",
      stream: "General Foundation",
      gender: "Female",
      dob: "2012-02-17",
      bloodGroup: "B+",
      fatherName: "Tariq Ahmed Khan",
      motherName: "Farah Khan",
      phone: "+91 98992 34567",
      emergencyPhone: "+91 98992 76543",
      email: "zoya.khan@student.sxia.edu.in",
      address: "A-56, Friends Colony West, New Delhi - 110065",
      house: "Titan Blue",
      busRoute: "Route 09 - New Friends Colony",
      admissionDate: "2022-04-04",
      status: "Active",
      medicalNotes: "None",
      photo: createAvatarSvg("ZK", "#0284c7", "#0369a1", "F", "student")
    },
    {
      id: "STU-1007",
      admissionNo: "ADM/2026/007",
      rollNo: "0801",
      name: "Vivaan Malhotra",
      className: "8",
      section: "A",
      stream: "Middle Wing",
      gender: "Male",
      dob: "2013-09-09",
      bloodGroup: "A+",
      fatherName: "Siddharth Malhotra",
      motherName: "Pooja Malhotra",
      phone: "+91 98115 67890",
      emergencyPhone: "+91 98115 09876",
      email: "vivaan.malhotra@student.sxia.edu.in",
      address: "D-204, Saket Residential Enclave, New Delhi - 110017",
      house: "Emerald Green",
      busRoute: "Route 03 - Saket / Malviya Nagar",
      admissionDate: "2023-04-01",
      status: "Active",
      medicalNotes: "Peanut allergy",
      photo: createAvatarSvg("VM", "#0d9488", "#0f766e", "M", "student")
    },
    {
      id: "STU-1008",
      admissionNo: "ADM/2026/008",
      rollNo: "0601",
      name: "Meera Subramanian",
      className: "6",
      section: "B",
      stream: "Middle Wing",
      gender: "Female",
      dob: "2015-05-25",
      bloodGroup: "O+",
      fatherName: "Venkatesh Subramanian",
      motherName: "Lakshmi Subramanian",
      phone: "+91 97172 88334",
      emergencyPhone: "+91 97172 44112",
      email: "meera.subramanian@student.sxia.edu.in",
      address: "R-88, R.K. Puram Sector 9, New Delhi - 110022",
      house: "Solar Gold",
      busRoute: "Route 01 - RK Puram / Moti Bagh",
      admissionDate: "2024-04-03",
      status: "Active",
      medicalNotes: "None",
      photo: createAvatarSvg("MS", "#9333ea", "#6b21a8", "F", "student")
    }
  ],
  staff: [
    {
      id: "EMP-101",
      employeeCode: "FAC/2026/101",
      name: "Dr. Arvind K. Sharma",
      designation: "Principal & Director",
      department: "Administration",
      qualification: "M.Sc. (Physics), M.Ed., Ph.D.",
      experience: "22 Years",
      gender: "Male",
      dob: "1974-08-12",
      bloodGroup: "O+",
      phone: "+91 98100 11100",
      emergencyPhone: "+91 98100 22200",
      email: "principal@stxaviersacademy.edu.in",
      address: "Principal Bungalow, Sector 14 Institutional Campus, New Delhi",
      joiningDate: "2012-06-01",
      salary: 145000,
      status: "Active",
      photo: createAvatarSvg("AS", "#1e3a8a", "#0f172a", "M", "staff")
    },
    {
      id: "EMP-102",
      employeeCode: "FAC/2026/102",
      name: "Prof. Radhika Iyer",
      designation: "HOD - Mathematics",
      department: "Mathematics & Olympiad",
      qualification: "M.Sc. (Mathematics), B.Ed., CSIR-NET",
      experience: "14 Years",
      gender: "Female",
      dob: "1983-03-19",
      bloodGroup: "A+",
      phone: "+91 98188 33445",
      emergencyPhone: "+91 98188 99001",
      email: "radhika.iyer@stxaviersacademy.edu.in",
      address: "402, Neelkanth Apartments, Dwarka Sector 10, New Delhi",
      joiningDate: "2016-04-15",
      salary: 88000,
      status: "Active",
      photo: createAvatarSvg("RI", "#6d28d9", "#4c1d95", "F", "staff")
    },
    {
      id: "EMP-103",
      employeeCode: "FAC/2026/103",
      name: "Mr. Vikramjeet Singh Gill",
      designation: "Senior PGT - Physics & Robotics",
      department: "Science & STEM Lab",
      qualification: "M.Tech (Instrumentation), B.Ed.",
      experience: "11 Years",
      gender: "Male",
      dob: "1986-11-24",
      bloodGroup: "B+",
      phone: "+91 98733 22110",
      emergencyPhone: "+91 98733 55667",
      email: "vikramjeet.gill@stxaviersacademy.edu.in",
      address: "J-14, Rajouri Garden, New Delhi - 110027",
      joiningDate: "2018-07-01",
      salary: 82000,
      status: "Active",
      photo: createAvatarSvg("VG", "#0f766e", "#115e59", "M", "staff")
    },
    {
      id: "EMP-104",
      employeeCode: "FAC/2026/104",
      name: "Ms. Clara D'Souza",
      designation: "Senior TGT - English Literature",
      department: "Humanities & Languages",
      qualification: "M.A. (English Literature), B.Ed., CELTA",
      experience: "9 Years",
      gender: "Female",
      dob: "1989-05-07",
      bloodGroup: "AB+",
      phone: "+91 99581 44223",
      emergencyPhone: "+91 99581 88776",
      email: "clara.dsouza@stxaviersacademy.edu.in",
      address: "18-B, Connaught Circus Lane, New Delhi - 110001",
      joiningDate: "2019-04-10",
      salary: 74000,
      status: "Active",
      photo: createAvatarSvg("CD", "#be123c", "#881337", "F", "staff")
    },
    {
      id: "EMP-105",
      employeeCode: "FAC/2026/105",
      name: "Mr. Saurabh Chatterjee",
      designation: "PGT - Computer Science & AI",
      department: "Information Technology",
      qualification: "MCA, B.Tech (CSE)",
      experience: "8 Years",
      gender: "Male",
      dob: "1991-09-15",
      bloodGroup: "O+",
      phone: "+91 98119 66778",
      emergencyPhone: "+91 98119 33445",
      email: "saurabh.chatterjee@stxaviersacademy.edu.in",
      address: "H-92, Kalkaji Extension, New Delhi - 110019",
      joiningDate: "2020-08-12",
      salary: 78000,
      status: "Active",
      photo: createAvatarSvg("SC", "#1d4ed8", "#1e3a8a", "M", "staff")
    }
  ],
  attendance: [
    {
      date: "2026-09-28",
      records: {
        "STU-1001": { status: "Present", remarks: "On time" },
        "STU-1002": { status: "Present", remarks: "On time" },
        "STU-1003": { status: "Present", remarks: "On time" },
        "STU-1004": { status: "Present", remarks: "Science Olympiad Prep" },
        "STU-1005": { status: "Late", remarks: "Traffic delay (10 mins)" },
        "STU-1006": { status: "Present", remarks: "On time" },
        "STU-1007": { status: "Absent", remarks: "Medical leave application submitted" },
        "STU-1008": { status: "Present", remarks: "On time" }
      }
    }
  ],
  exams: [
    {
      id: "EXM-01",
      studentId: "STU-1001",
      examTerm: "Mid-Term Examination 2026-27",
      attendanceDays: "96 / 100",
      coScholastic: {
        discipline: "A+",
        workEducation: "A+",
        artEducation: "A",
        healthPhysical: "A+"
      },
      teacherRemarks: "Aarav demonstrates exceptional analytical ability in Mathematics and Physics.",
      subjects: [
        { name: "Mathematics", code: "041", maxMarks: 100, theory: 76, practical: 20, obtained: 96 },
        { name: "Science & Technology", code: "086", maxMarks: 100, theory: 74, practical: 20, obtained: 94 },
        { name: "English Language & Lit.", code: "184", maxMarks: 100, theory: 71, practical: 19, obtained: 90 },
        { name: "Social Science", code: "087", maxMarks: 100, theory: 72, practical: 20, obtained: 92 },
        { name: "Artificial Intelligence / IT", code: "417", maxMarks: 100, theory: 49, practical: 50, obtained: 99 }
      ]
    }
  ],
  fees: [
    {
      id: "FEE-1001",
      studentId: "STU-1001",
      academicYear: "2026-2027",
      totalAnnualFee: 84000,
      discount: 4000,
      netPayable: 80000,
      paidAmount: 80000,
      breakdown: {
        tuitionFee: 54000,
        labAndSmartClass: 12000,
        transportFee: 10000,
        libraryAndSports: 4000
      },
      payments: [
        {
          receiptNo: "RCP-2026-1001",
          date: "2026-04-10",
          amount: 80000,
          mode: "UPI / NEFT",
          transactionRef: "UTR6291048291",
          installment: "Full Annual Fee",
          collectedBy: "Accounts Desk 01"
        }
      ]
    }
  ],
  timetable: [
    {
      className: "10",
      section: "A",
      roomNo: "Block B • Room 204",
      classTeacher: "Prof. Radhika Iyer",
      schedule: {
        Monday: [
          { period: 1, time: "08:00 - 08:45", subject: "Mathematics", teacher: "Prof. Radhika Iyer", type: "Theory" },
          { period: 2, time: "08:45 - 09:30", subject: "Physics", teacher: "Mr. Vikramjeet Gill", type: "Theory" },
          { period: 3, time: "09:30 - 10:15", subject: "English Lit.", teacher: "Ms. Clara D'Souza", type: "Theory" },
          { period: 4, time: "10:35 - 11:20", subject: "AI & Python Lab", teacher: "Mr. Saurabh Chatterjee", type: "Practical" },
          { period: 5, time: "11:20 - 12:05", subject: "Social Science", teacher: "Faculty Pool", type: "Theory" },
          { period: 6, time: "12:05 - 12:50", subject: "Chemistry", teacher: "Mr. Vikramjeet Gill", type: "Lab" }
        ]
      }
    }
  ],
  notices: [
    {
      id: "NOT-01",
      title: "Distribution of Smart RFID & QR Identity Cards (Session 2026-27)",
      category: "Administration",
      date: "2026-09-28",
      priority: "High",
      audience: "All Students & Faculty",
      content: "Updated PVC CR80 Identity Cards with QR verification and emergency contact details are being issued this week."
    }
  ]
};

export function loadDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedData, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(initialSeedData));
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading DB, falling back to initial seed data:', err);
    return JSON.parse(JSON.stringify(initialSeedData));
  }
}

export function saveDb(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving DB:', err);
    return false;
  }
}

export function resetDb() {
  saveDb(initialSeedData);
  return JSON.parse(JSON.stringify(initialSeedData));
}
