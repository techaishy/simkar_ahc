"use client";

import { useState } from "react";

type Props = {
  onChange: (month: string, year: string) => void;
};

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const years = ["2022", "2023", "2024", "2025"];

export default function MonthYearDropdown({ onChange }: Props) {
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  const [selectedYear, setSelectedYear] = useState("2025");

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);
    onChange(newMonth, selectedYear);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    onChange(selectedMonth, newYear);
  };

  return (
    <div className="block md:hidden space-y-3 px-4 py-3 bg-white mb-3 rounded-lg shadow-md">
  <select
    className="w-full rounded-lg border border-gray-300 bg-black text-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
    value={selectedMonth}
    onChange={handleMonthChange}
  >
    {months.map((month) => (
      <option key={month} value={month}>
        {month}
      </option>
    ))}
  </select>

  <select
    className="w-full rounded-lg border border-gray-300 bg-black text-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
    value={selectedYear}
    onChange={handleYearChange}
  >
    {years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
</div>

    // <div className="block md:hidden items-center gap-2">
    //   <select
    //     className="border rounded-md px-3 py-1 focus:outline-none bg-black text-amber-50"
    //     value={selectedMonth}
    //     onChange={handleMonthChange}
    //   >
    //     {months.map((month) => (
    //       <option key={month} value={month}>
    //         {month}
    //       </option>
    //     ))}
    //   </select>

    //   <select
    //     className="border rounded-md px-3 py-1 focus:outline-none bg-black text-amber-50"
    //     value={selectedYear}
    //     onChange={handleYearChange}
    //   >
    //     {years.map((year) => (
    //       <option key={year} value={year}>
    //         {year}
    //       </option>
    //     ))}
    //   </select>
    // </div>
  );
}
