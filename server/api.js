import express from 'express';
import { loadDb, saveDb, resetDb } from './db.js';

export function createApiRouter() {
  const router = express.Router();
  router.use(express.json({ limit: '25mb' }));

  router.get('/bootstrap', (req, res) => {
    const db = loadDb();
    res.json(db);
  });

  router.put('/settings', (req, res) => {
    const db = loadDb();
    db.settings = { ...db.settings, ...req.body };
    saveDb(db);
    res.json(db.settings);
  });

  router.get('/students', (req, res) => {
    const db = loadDb();
    res.json(db.students);
  });

  router.post('/students', (req, res) => {
    const db = loadDb();
    const nextNum = db.students.length + 1001;
    const newStudent = {
      id: req.body.id || `STU-${Date.now().toString().slice(-4)}`,
      admissionNo: req.body.admissionNo || `ADM/2026/${String(db.students.length + 1).padStart(3, '0')}`,
      rollNo: req.body.rollNo || String(nextNum),
      name: req.body.name || 'New Student',
      className: req.body.className || '10',
      section: req.body.section || 'A',
      stream: req.body.stream || 'General',
      gender: req.body.gender || 'Male',
      dob: req.body.dob || '2011-01-01',
      bloodGroup: req.body.bloodGroup || 'O+',
      fatherName: req.body.fatherName || '',
      motherName: req.body.motherName || '',
      phone: req.body.phone || '',
      emergencyPhone: req.body.emergencyPhone || req.body.phone || '',
      email: req.body.email || '',
      address: req.body.address || '',
      house: req.body.house || 'Phoenix Red',
      busRoute: req.body.busRoute || 'Self / Parent Drop',
      admissionDate: req.body.admissionDate || new Date().toISOString().split('T')[0],
      status: req.body.status || 'Active',
      medicalNotes: req.body.medicalNotes || 'None',
      photo: req.body.photo || ''
    };
    db.students.unshift(newStudent);

    const hasFee = db.fees.some((f) => f.studentId === newStudent.id);
    if (!hasFee) {
      db.fees.push({
        id: `FEE-${Date.now().toString().slice(-4)}`,
        studentId: newStudent.id,
        academicYear: db.settings?.academicYear || '2026-2027',
        totalAnnualFee: 84000,
        discount: 0,
        netPayable: 84000,
        paidAmount: 0,
        breakdown: {
          tuitionFee: 56000,
          labAndSmartClass: 12000,
          transportFee: 12000,
          libraryAndSports: 4000
        },
        payments: []
      });
    }

    saveDb(db);
    res.status(201).json({ student: newStudent, db });
  });

  router.put('/students/:id', (req, res) => {
    const db = loadDb();
    const idx = db.students.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Student not found' });
    db.students[idx] = { ...db.students[idx], ...req.body };
    saveDb(db);
    res.json(db.students[idx]);
  });

  router.delete('/students/:id', (req, res) => {
    const db = loadDb();
    db.students = db.students.filter((s) => s.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  router.post('/staff', (req, res) => {
    const db = loadDb();
    const newStaff = {
      id: req.body.id || `EMP-${Date.now().toString().slice(-4)}`,
      employeeCode: req.body.employeeCode || `FAC/2026/${101 + db.staff.length}`,
      name: req.body.name || 'New Faculty',
      designation: req.body.designation || 'TGT Teacher',
      department: req.body.department || 'Academics',
      qualification: req.body.qualification || 'M.Sc., B.Ed.',
      experience: req.body.experience || '5 Years',
      gender: req.body.gender || 'Male',
      dob: req.body.dob || '1988-01-01',
      bloodGroup: req.body.bloodGroup || 'O+',
      phone: req.body.phone || '',
      emergencyPhone: req.body.emergencyPhone || req.body.phone || '',
      email: req.body.email || '',
      address: req.body.address || '',
      joiningDate: req.body.joiningDate || new Date().toISOString().split('T')[0],
      salary: Number(req.body.salary) || 65000,
      status: req.body.status || 'Active',
      photo: req.body.photo || ''
    };
    db.staff.unshift(newStaff);
    saveDb(db);
    res.status(201).json(newStaff);
  });

  router.put('/staff/:id', (req, res) => {
    const db = loadDb();
    const idx = db.staff.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Staff member not found' });
    db.staff[idx] = { ...db.staff[idx], ...req.body };
    saveDb(db);
    res.json(db.staff[idx]);
  });

  router.delete('/staff/:id', (req, res) => {
    const db = loadDb();
    db.staff = db.staff.filter((s) => s.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  router.post('/attendance', (req, res) => {
    const { date, records } = req.body;
    const db = loadDb();
    const existingIdx = db.attendance.findIndex((a) => a.date === date);
    if (existingIdx >= 0) {
      db.attendance[existingIdx].records = {
        ...db.attendance[existingIdx].records,
        ...records
      };
    } else {
      db.attendance.unshift({ date, records });
    }
    saveDb(db);
    res.json(db.attendance);
  });

  router.post('/exams', (req, res) => {
    const db = loadDb();
    const payload = req.body;
    const existingIdx = db.exams.findIndex(
      (e) => e.studentId === payload.studentId && e.examTerm === payload.examTerm
    );
    if (existingIdx >= 0) {
      db.exams[existingIdx] = { ...db.exams[existingIdx], ...payload };
    } else {
      db.exams.push({
        id: `EXM-${Date.now().toString().slice(-4)}`,
        ...payload
      });
    }
    saveDb(db);
    res.json(db.exams);
  });

  router.delete('/exams/:id', (req, res) => {
    const db = loadDb();
    db.exams = db.exams.filter((e) => e.id !== req.params.id);
    saveDb(db);
    res.json(db.exams);
  });

  router.post('/fees/:studentId/pay', (req, res) => {
    const { studentId } = req.params;
    const { amount, mode, transactionRef, installment, collectedBy, discount } = req.body;
    const db = loadDb();
    let ledger = db.fees.find((f) => f.studentId === studentId);
    if (!ledger) {
      ledger = {
        id: `FEE-${Date.now().toString().slice(-4)}`,
        studentId,
        academicYear: db.settings?.academicYear || '2026-2027',
        totalAnnualFee: 84000,
        discount: 0,
        netPayable: 84000,
        paidAmount: 0,
        breakdown: {
          tuitionFee: 56000,
          labAndSmartClass: 12000,
          transportFee: 12000,
          libraryAndSports: 4000
        },
        payments: []
      };
      db.fees.push(ledger);
    }

    if (typeof discount === 'number') {
      ledger.discount = discount;
      ledger.netPayable = Math.max(0, ledger.totalAnnualFee - ledger.discount);
    }

    const payAmount = Number(amount) || 0;
    const receipt = {
      receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: payAmount,
      mode: mode || 'UPI / Online',
      transactionRef: transactionRef || `TXN${Date.now().toString().slice(-8)}`,
      installment: installment || 'Installment Payment',
      collectedBy: collectedBy || 'Accounts Office'
    };

    ledger.payments.unshift(receipt);
    ledger.paidAmount = ledger.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    saveDb(db);
    res.json({ ledger, receipt, fees: db.fees });
  });

  router.put('/fees/:studentId', (req, res) => {
    const { studentId } = req.params;
    const db = loadDb();
    let idx = db.fees.findIndex((f) => f.studentId === studentId);
    if (idx === -1) {
      const newLedger = {
        id: `FEE-${Date.now().toString().slice(-4)}`,
        studentId,
        ...req.body
      };
      db.fees.push(newLedger);
      saveDb(db);
      return res.json(db.fees);
    }
    db.fees[idx] = { ...db.fees[idx], ...req.body };
    saveDb(db);
    res.json(db.fees);
  });

  router.post('/timetable', (req, res) => {
    const db = loadDb();
    const { className, section, roomNo, classTeacher, schedule } = req.body;
    const idx = db.timetable.findIndex(
      (t) => t.className === className && t.section === section
    );
    if (idx >= 0) {
      db.timetable[idx] = { className, section, roomNo, classTeacher, schedule };
    } else {
      db.timetable.push({ className, section, roomNo, classTeacher, schedule });
    }
    saveDb(db);
    res.json(db.timetable);
  });

  router.post('/notices', (req, res) => {
    const db = loadDb();
    const notice = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      title: req.body.title,
      category: req.body.category || 'General',
      date: req.body.date || new Date().toISOString().split('T')[0],
      priority: req.body.priority || 'Medium',
      audience: req.body.audience || 'All Students & Staff',
      content: req.body.content || ''
    };
    db.notices.unshift(notice);
    saveDb(db);
    res.json(db.notices);
  });

  router.delete('/notices/:id', (req, res) => {
    const db = loadDb();
    db.notices = db.notices.filter((n) => n.id !== req.params.id);
    saveDb(db);
    res.json(db.notices);
  });

  router.post('/reset', (req, res) => {
    const db = resetDb();
    res.json(db);
  });

  return router;
}
