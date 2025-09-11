"use client";

import { useEffect, useState } from "react";

export interface FilterValues {
  tanggalAwal?: string;
  tanggalAkhir?: string;
  metode?: string;
  pegawai?: string;
  status?: string;
}

interface AttendanceFilterProps {
  onChange: (filters: FilterValues) => void;
}

export default function AttendanceFilter({ onChange }: AttendanceFilterProps) {
  const [values, setValues] = useState<FilterValues>({
    tanggalAwal: "",
    tanggalAkhir: "",
    metode: "",
    pegawai: "",
    status: "",
  });

  useEffect(() => {
    onChange(values);
  }, [values]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 return (
    <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Filter Absensi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tanggal Awal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Awal
          </label>
          <input
            type="date"
            name="tanggalAwal"
            value={values.tanggalAwal}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Tanggal Akhir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Akhir
          </label>
          <input
            type="date"
            name="tanggalAkhir"
            value={values.tanggalAkhir}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Metode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Metode
          </label>
          <select
            name="metode"
            value={values.metode}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua</option>
            <option value="barcode">Barcode</option>
            <option value="selfie">Selfie</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Pegawai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pegawai
          </label>
          <input
            type="text"
            name="pegawai"
            value={values.pegawai}
            onChange={handleChange}
            placeholder="Cari nama pegawai"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua</option>
            {/* StatusMasuk */}
            <option value="HADIR">Hadir</option>
            <option value="TERLAMBAT">Terlambat</option>
            {/* Keterangan */}
            <option value="IZIN">Izin</option>
            <option value="SAKIT">Sakit</option>
            <option value="ALPHA">Alpha</option>
          </select>
        </div>
      </div>
    </div>
  );
}