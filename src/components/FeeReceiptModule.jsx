import React, { useState, useMemo } from 'react';
import { amountToWords } from '../utils/helpers';
import {
  IndianRupee,
  Printer,
  Search,
  Receipt,
  PlusCircle,
  X,
} from 'lucide-react';

export default function FeeReceiptModule({
  students = [],
  fees = [],
  settings,
  onCollectFee,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [payModalStudent, setPayModalStudent] = useState(null);
  const [activeReceiptData, setActiveReceiptData] = useState(null);

  const [payForm, setPayForm] = useState({
    amount: 21000,
    mode: 'UPI / NEFT',
    transactionRef: '',
    installment: 'Installment Payment',
    collectedBy: 'Accounts Desk 01',
    discount: 0,
  });

  const rows = useMemo(() => {
    return students.map((stu) => {
      const ledger = fees.find((f) => f.studentId === stu.id) || {
        studentId: stu.id,
        academicYear: settings?.academicYear || '2026-2027',
        totalAnnualFee: 84000,
        discount: 0,
        netPayable: 84000,
        paidAmount: 0,
        breakdown: {
          tuitionFee: 56000,
          labAndSmartClass: 12000,
          transportFee: 12000,
          libraryAndSports: 4000,
        },
        payments: [],
      };
      const balance = Math.max(0, (ledger.netPayable || 84000) - (ledger.paidAmount || 0));
      const status =
        balance === 0 ? 'PAID' : ledger.paidAmount > 0 ? 'PARTIAL' : 'PENDING';
      return { student: stu, ledger, balance, status };
    });
  }, [students, fees, settings]);

  const filteredRows = useMemo(() => {
    return rows.filter(({ student, status }) => {
      const q = search.trim().toLowerCase();
      const matchQ =
        !q ||
        student.name?.toLowerCase().includes(q) ||
        student.id?.toLowerCase().includes(q) ||
        student.rollNo?.toLowerCase().includes(q);
      if (!matchQ) return false;
      if (statusFilter !== 'ALL' && status !== statusFilter) return false;
      return true;
    });
  }, [rows, search, statusFilter]);

  const kpis = useMemo(() => {
    const totalPayable = rows.reduce((s, r) => s + (r.ledger.netPayable || 0), 0);
    const totalCollected = rows.reduce((s, r) => s + (r.ledger.paidAmount || 0), 0);
    const totalPending = rows.reduce((s, r) => s + r.balance, 0);
    const pct = totalPayable > 0 ? Math.round((totalCollected / totalPayable) * 100) : 0;
    return { totalPayable, totalCollected, totalPending, pct };
  }, [rows]);

  const openCollectModal = (row) => {
    setPayModalStudent(row);
    setPayForm({
      amount: row.balance > 0 ? row.balance : 10000,
      mode: 'UPI / NEFT',
      transactionRef: `UTR${Date.now().toString().slice(-8)}`,
      installment: 'Term Installment',
      collectedBy: 'Accounts Desk 01',
      discount: row.ledger.discount || 0,
    });
  };

  const handleCollectSubmit = async (e) => {
    e.preventDefault();
    if (!payModalStudent) return;
    const res = await onCollectFee(payModalStudent.student.id, {
      ...payForm,
      amount: Number(payForm.amount),
      discount: Number(payForm.discount),
    });
    setPayModalStudent(null);
    if (res?.receipt) {
      setActiveReceiptData({
        student: payModalStudent.student,
        ledger: res.ledger,
        receipt: res.receipt,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-indigo-600" />
              Fee Collection, Dues Ledger & Official Receipt Generator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track annual fee structures, scholarships/discounts, pending dues, and issue printable fee receipts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold uppercase text-slate-400">
              Net Annual Fee Demand
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">
              ₹{kpis.totalPayable.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-[11px] font-bold uppercase text-emerald-700">
              Total Fee Collected
            </div>
            <div className="text-xl font-black text-emerald-900 mt-1">
              ₹{kpis.totalCollected.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-[11px] font-bold uppercase text-rose-700">
              Total Pending Dues
            </div>
            <div className="text-xl font-black text-rose-900 mt-1">
              ₹{kpis.totalPending.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
            <div className="text-[11px] font-bold uppercase text-indigo-700">
              Collection Efficiency
            </div>
            <div className="text-xl font-black text-indigo-900 mt-1">
              {kpis.pct}% Collected
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student by name, ID, or roll number..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            {['ALL', 'PAID', 'PARTIAL', 'PENDING'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === st
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="no-print bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Class / Roll</th>
                <th className="py-3.5 px-4">Net Payable</th>
                <th className="py-3.5 px-4">Paid Amount</th>
                <th className="py-3.5 px-4">Balance Due</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions & Receipts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRows.map((row) => {
                const { student, ledger, balance, status } = row;
                const latestReceipt = ledger.payments?.[0];
                return (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="w-9 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">
                            {student.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {student.id} • {student.admissionNo}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-700">
                      Class {student.className}-{student.section} (#{student.rollNo})
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">
                      ₹{(ledger.netPayable || 0).toLocaleString('en-IN')}
                      {ledger.discount > 0 && (
                        <span className="block text-[10px] text-emerald-600">
                          Scholarship: -₹{ledger.discount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-black text-emerald-700">
                      ₹{(ledger.paidAmount || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 font-black text-rose-600">
                      ₹{balance.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : status === 'PARTIAL'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openCollectModal(row)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Collect Fee
                        </button>

                        {latestReceipt && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReceiptData({
                                student,
                                ledger,
                                receipt: latestReceipt,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition"
                          >
                            <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                            View Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {activeReceiptData && (
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-lg max-w-3xl mx-auto p-6 print-container">
          <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
            <span className="text-xs font-bold text-indigo-600 uppercase">
              Official Printable Fee Receipt Preview
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Print Fee Receipt
              </button>
              <button
                type="button"
                onClick={() => setActiveReceiptData(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={settings.logo}
                alt="Crest"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase">
                  {settings.schoolName}
                </h3>
                <p className="text-[11px] font-bold text-slate-600">
                  {settings.affiliation}
                </p>
                <p className="text-[11px] text-slate-500">{settings.address}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-slate-900 text-amber-400 font-black text-xs uppercase">
                FEE RECEIPT
              </span>
              <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                No: {activeReceiptData.receipt.receiptNo}
              </div>
              <div className="text-[11px] text-slate-500">
                Date: {activeReceiptData.receipt.date}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block">Student Name</span>
              <strong className="text-slate-900">
                {activeReceiptData.student.name}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Admission / ID No.</span>
              <strong className="text-slate-900 font-mono">
                {activeReceiptData.student.admissionNo} ({activeReceiptData.student.id})
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Class & Roll No.</span>
              <strong className="text-slate-900">
                Class {activeReceiptData.student.className}-
                {activeReceiptData.student.section} (Roll #
                {activeReceiptData.student.rollNo})
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Father's Name</span>
              <strong className="text-slate-900">
                {activeReceiptData.student.fatherName}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Payment Mode & Ref</span>
              <strong className="text-slate-900">
                {activeReceiptData.receipt.mode} (
                {activeReceiptData.receipt.transactionRef})
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Installment / Term</span>
              <strong className="text-indigo-700">
                {activeReceiptData.receipt.installment}
              </strong>
            </div>
          </div>

          <div className="my-4">
            <table className="w-full text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-black text-slate-700">
                  <th className="py-2 px-3 text-left">Fee Particulars</th>
                  <th className="py-2 px-3 text-right">Annual Fee (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3">Tuition & Academic Fee</td>
                  <td className="py-2 px-3 text-right font-semibold">
                    ₹
                    {(
                      activeReceiptData.ledger.breakdown?.tuitionFee || 56000
                    ).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3">
                    STEM Lab, Robotics & Smart Classroom Charges
                  </td>
                  <td className="py-2 px-3 text-right font-semibold">
                    ₹
                    {(
                      activeReceiptData.ledger.breakdown?.labAndSmartClass || 12000
                    ).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3">School Bus / Transport Charges</td>
                  <td className="py-2 px-3 text-right font-semibold">
                    ₹
                    {(
                      activeReceiptData.ledger.breakdown?.transportFee || 12000
                    ).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Library, Sports & Co-Curricular</td>
                  <td className="py-2 px-3 text-right font-semibold">
                    ₹
                    {(
                      activeReceiptData.ledger.breakdown?.libraryAndSports || 4000
                    ).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-emerald-50 font-black text-emerald-950 text-sm">
                  <td className="py-3 px-3">
                    AMOUNT RECEIVED THIS RECEIPT ({activeReceiptData.receipt.receiptNo})
                  </td>
                  <td className="py-3 px-3 text-right">
                    ₹{Number(activeReceiptData.receipt.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-3 text-xs">
            <div className="space-y-1">
              <div>
                <span className="text-slate-500 font-semibold">Amount in Words: </span>
                <strong className="text-slate-900 italic">
                  {amountToWords(activeReceiptData.receipt.amount)}
                </strong>
              </div>
              <div className="text-[11px] text-slate-500">
                Total Paid to Date: ₹
                {activeReceiptData.ledger.paidAmount.toLocaleString('en-IN')} •
                Remaining Balance: ₹
                {Math.max(
                  0,
                  activeReceiptData.ledger.netPayable -
                    activeReceiptData.ledger.paidAmount
                ).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="text-center shrink-0 pt-4">
              <div className="font-mono text-[10px] text-indigo-700 font-bold border border-indigo-300 bg-indigo-50 px-3 py-1 rounded mb-1">
                VERIFIED ACCOUNTS SEAL
              </div>
              <div className="text-[11px] font-bold text-slate-700">
                Authorized Cashier ({activeReceiptData.receipt.collectedBy})
              </div>
            </div>
          </div>
        </div>
      )}

      {payModalStudent && (
        <div className="no-print fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Collect Fee & Generate Receipt
                </h3>
                <p className="text-xs text-slate-500">
                  {payModalStudent.student.name} ({payModalStudent.student.id})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPayModalStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCollectSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Amount Being Collected (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={payForm.amount}
                  onChange={(e) =>
                    setPayForm({ ...payForm, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-sm text-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={payForm.mode}
                    onChange={(e) =>
                      setPayForm({ ...payForm, mode: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="UPI / NEFT">UPI / NEFT</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                    <option value="Cheque / DD">Cheque / DD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Scholarship Discount (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={payForm.discount}
                    onChange={(e) =>
                      setPayForm({ ...payForm, discount: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Transaction Reference / Cheque No.
                </label>
                <input
                  type="text"
                  value={payForm.transactionRef}
                  onChange={(e) =>
                    setPayForm({ ...payForm, transactionRef: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Installment Description
                </label>
                <input
                  type="text"
                  value={payForm.installment}
                  onChange={(e) =>
                    setPayForm({ ...payForm, installment: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPayModalStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Record Payment & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
