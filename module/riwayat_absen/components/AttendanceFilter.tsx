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
    <div className="p-4 bg-gray-100 rounded-md space-y-4">
      <h2 className="font-semibold">Filter Absensi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tanggal Awal */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Awal
          </label>
          <input
            type="date"
            name="tanggalAwal"
            value={values.tanggalAwal}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>

        {/* Tanggal Akhir */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Akhir
          </label>
          <input
            type="date"
            name="tanggalAkhir"
            value={values.tanggalAkhir}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>

        {/* Metode Presensi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Metode
          </label>
          <select
            name="metode"
            value={values.metode}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">Semua</option>
            <option value="barcode">Barcode</option>
            <option value="lokasi">Lokasi</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Nama Pegawai */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pegawai
          </label>
          <input
            type="text"
            name="pegawai"
            value={values.pegawai}
            onChange={handleChange}
            placeholder="Cari nama pegawai"
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>

        {/* Status Absensi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">Semua</option>
            <option value="hadir">Hadir</option>
            <option value="terlambat">Terlambat</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
            <option value="alpha">Alpha</option>
          </select>
        </div>
      </div>
    </div>
  );
}