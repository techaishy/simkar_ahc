
"use client";

import { useState, useEffect } from "react";
import { DateRange, Range } from "react-date-range";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export type FilterValues = {
  tanggalAwal: string;
  tanggalAkhir: string;
  pegawai: string;
  status: string;
  metode: string;
  jabatan: string;
};

type Props = {
  onFilter: (filters: FilterValues) => void;
};

const employees = ["Semua", "Alam Alfarizi", "Budi Santoso", "Cici Rahmawati"];
const statuses = ["Semua", "Tepat Waktu", "Terlambat", "Izin", "Alpha"];
const methods = ["Semua", "Selfie", "Barcode", "Manual"];
const positions = ["Semua", "QA", "Frontend", "Backend"];

export default function AttendanceFilter({ onFilter }: Props) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [monthsToShow, setMonthsToShow] = useState(2);

  const [selectedRange, setSelectedRange] = useState<Range>({
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-08-05"),
    key: "selection",
  });

  const [employee, setEmployee] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [method, setMethod] = useState("Semua");
  const [position, setPosition] = useState("Semua");

  useEffect(() => {
    const handleResize = () => {
      setMonthsToShow(window.innerWidth < 640 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toYMD = (d: Date | undefined) => (d ? format(d, "yyyy-MM-dd") : "");

  const applyFilters = () => {
    onFilter({
      tanggalAwal: toYMD(selectedRange.startDate),
      tanggalAkhir: toYMD(selectedRange.endDate),
      pegawai: employee === "Semua" ? "" : employee,
      status: status === "Semua" ? "" : status,
      metode: method === "Semua" ? "" : method,
      jabatan: position === "Semua" ? "" : position,
    });
    setShowCalendar(false);
  };

  const resetFilters = () => {
    const defaultRange = {
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-08-05"),
      key: "selection",
    };

    setSelectedRange(defaultRange);
    setEmployee("Semua");
    setStatus("Semua");
    setMethod("Semua");
    setPosition("Semua");

    onFilter({
      tanggalAwal: toYMD(defaultRange.startDate),
      tanggalAkhir: toYMD(defaultRange.endDate),
      pegawai: "",
      status: "",
      metode: "",
      jabatan: "",
    });
  };

  return (
    <div className="bg-white text-gray-700 p-5 mt-0 rounded-2xl w-full max-w-lg space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Tanggal */}
        <div className="relative w-full md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Tanggal</label>
          <input
            readOnly
            onClick={() => setShowCalendar(!showCalendar)}
            value={`${format(selectedRange.startDate!, "dd-MM-yyyy", {
              locale: id,
            })} s.d. ${format(selectedRange.endDate!, "dd-MM-yyyy", {
              locale: id,
            })}`}
            className="w-full min-w-[220px] border border-gray-300 px-4 py-2 rounded-md cursor-pointer bg-gray-50 hover:border-indigo-500 transition duration-200"
          />
          {showCalendar && (
            <div className="absolute z-50 mt-2 shadow-lg border rounded-md bg-white p-4">
              <DateRange
                ranges={[selectedRange]}
                onChange={(ranges) => setSelectedRange(ranges.selection)}
                locale={id}
                moveRangeOnFirstSelection={false}
                months={monthsToShow}
                direction="horizontal"
                rangeColors={["#4f46e5"]}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Oke
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pegawai */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1">
            Nama Pegawai
          </label>
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 hover:border-indigo-500 transition duration-200"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
          >
            {employees.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1">Status</label>
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 hover:border-indigo-500 transition duration-200"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map((statusItem) => (
              <option key={statusItem} value={statusItem}>
                {statusItem}
              </option>
            ))}
          </select>
        </div>

        {/* Metode Absen */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1">
            Metode Absen
          </label>
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 hover:border-indigo-500 transition duration-200"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {methods.map((methodItem) => (
              <option key={methodItem} value={methodItem}>
                {methodItem}
              </option>
            ))}
          </select>
        </div>

        {/* Jabatan */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1">Jabatan</label>
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 hover:border-indigo-500 transition duration-200"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {positions.map((positionItem) => (
              <option key={positionItem} value={positionItem}>
                {positionItem}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between mt-4 md:col-span-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-red-700 hover:text-white transition duration-200"
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
