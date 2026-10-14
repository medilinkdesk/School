# 🎓 EduSphere Pro — School Management System & Smart ID Card Studio

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)
![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-success.svg?logo=github)

A comprehensive, production-grade **School ERP & Identity Card Generator** web application that runs both locally (with full Node/Express API) and 100% in the browser on **GitHub Pages** with persistent LocalStorage.

---

## 🌟 Key Features

### 🪪 Smart PVC CR80 Identity Card Generator
- **Student & Faculty Cards**: Switch between student and faculty/staff identity cards.
- **5 Professional Design Templates**:
  - *Royal Academic Crest* (Classic Navy & Gold Vertical CR80)
  - *Emerald Modern Wave* (Teal/Emerald Modern Vertical)
  - *Crimson Heritage Elite* (Maroon & Ivory Vertical)
  - *Cyber Indigo Neo* (Indigo & Cyan Modern Gradient)
  - *Executive Horizontal CR80* (Landscape Layout)
- **Front & Back Card Views**:
  - Front: School Logo, School Name & Affiliation, Student Photo with border, Name, Class/Section, Roll No, DOB, Blood Group badge, Parent Name, Contact No, Valid Thru, Principal Signature, Barcode.
  - Back: Instructions/Rules, Emergency Contact, Address, Bus Route, Blood Group, Scannable QR Code (encoding live vCard/ID verification data) and Code-128 Barcode.
- **Export & Print**:
  - **High-Res PNG Card**: Download crisp 300-DPI Front + Back image.
  - **Bulk A4 Print Sheet**: Batch print multiple cards on standard A4 layout ready for PVC card printing or lamination.
- **Webcam & Photo Upload**: Upload passport photos, capture live from your webcam, or generate custom illustrated uniform avatars.

### 🎓 Student Admissions & Directory
- Full student registration with admission number, roll number, class, section, parent details, transport route, and medical/blood group information.
- Filter by Class, Section, House, and Blood Group.
- Export student rosters to CSV.

### 💼 Faculty & Staff Management
- Complete faculty directory with designations, departments, qualifications, joining date, and monthly payroll tracking.
- One-click Faculty ID Card generator.

### 📅 Daily Attendance Register
- Daily roll-call attendance with one-click "Mark All Present", late/leave remarks, and attendance percentage tracking.

### 🏆 Examinations & Report Cards
- Subject-wise Theory and Practical marks entry.
- Auto calculation of percentages, grades (`A1` to `E`), and Grade Points.
- **Official Printable A4 Report Card** with school crest, grading scale, co-scholastic grades, and signature blocks.

### 💳 Fee Management & Printable Receipts
- Annual fee breakdown, scholarships/discounts, and payment history.
- Collect fees (`UPI`, `Cash`, `Card`, `Cheque`) and generate **Official Printable Fee Receipts** with Rupee amount in words.

### ⏰ Timetable, Notices & School Branding
- Weekly class timetables, school circulars notice board, and branding customizer (upload custom school logo and principal signature).

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/medilinkdesk/School.git
cd School

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser at **`http://localhost:3000/`**.

---

## 🌐 Hosting on GitHub Pages

This repository includes an automatic GitHub Actions workflow (`.github/workflows/deploy.yml`).

To enable **GitHub Pages**:
1. Go to your repository on GitHub: `https://github.com/medilinkdesk/School`
2. Click **Settings** ⚙️ > **Pages** (in the left sidebar).
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. Push any commit to `main`, and your site will be live at:
   **`https://medilinkdesk.github.io/School/`**

---

## 📄 License
MIT License. Free to use for schools, academies, and educational institutions.
