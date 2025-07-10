"use client";

import { useState } from "react";

const employees = ["AGUS", "BUDI", "CICI"];
const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];
const years = [2023, 2024, 2025];

export default function DropdownFilter() {
  const [selectedEmployee, setSelectedEmployee] = useState("AGUS");
  const [selectedMonth, setSelectedMonth] = useState("MAY");
  const [selectedYear, setSelectedYear] = useState(2025);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Label Karyawan */}
        <label className="col-span-2 text-sm font-semibold text-black">Karyawan</label>
        <div className="col-span-10">
          <select
            className="w-58 px-3 py-1.5 bg-gray-400 text-black rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            {employees.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>
  
      <div className="grid grid-cols-12 gap-4 items-center mt-4">
        {/* Label Periode */}
        <label className="col-span-2 text-sm font-semibold text-black">Periode</label>
        <div className="col-span-10 flex gap-2">
          <select
            className="w-28 px-3 py-1.5 bg-gray-400 text-black rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month}>{month}</option>
            ))}
          </select>
  
          <select
            className="w-28 px-3 py-1.5 bg-gray-400 text-black rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

