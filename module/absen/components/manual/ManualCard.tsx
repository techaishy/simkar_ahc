"use client";

import { useEffect, useState } from "react";
import {
  IdentificationIcon,
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Props = {
  onClose: () => void;
  tipe: "masuk" | "pulang";
  onSubmit?: (data: {
    nama: string;
    jabatan: string;
    lokasi: string;
    waktu: string;
    keterangan: string;
  }) => void;
};

interface Pegawai {
  id: number;
  nama: string;
  jabatan: string;
}

const pegawaiList: Pegawai[] = [
  { id: 1, nama: "Andi Saputra", jabatan: "Teknisi" },
  { id: 2, nama: "Budi Santoso", jabatan: "Admin" },
  { id: 3, nama: "Citra Dewi", jabatan: "Manajer" },
  { id: 4, nama: "Dian Pratama", jabatan: "Staff Gudang" },
];

export default function ManualCard({ onClose, tipe, onSubmit }: Props) {
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [waktu, setWaktu] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [lokasi, setLokasi] = useState("Mengambil lokasi...");
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const filteredPegawai = pegawaiList.filter((p) =>
    p.nama.toLowerCase().includes(nama.toLowerCase())
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        setLokasi(`${lat}, ${lon}`);
      },
      () => {
        setLokasi("Gagal mendapatkan lokasi");
      }
    );
  }, []);

  const handleSelectPegawai = (pegawai: Pegawai) => {
    setNama(pegawai.nama);
    setJabatan(pegawai.jabatan);
    setShowDropdown(false);
    setHighlightIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama atau kode harus diisi.");
      return;
    }
    onSubmit?.({
      nama,
      jabatan,
      lokasi,
      waktu,
      keterangan,
    });
  };

  interface LocationMarkerProps {
    setLokasi: (value: string) => void;
  }

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  
  function LocationMarker({ setLokasi }: LocationMarkerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(null);
  
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setLokasi(`${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
      },
    });
  
    return position ? <Marker position={position} icon={markerIcon} /> : null;
  }


  const customMarker = new L.Icon({
    iconUrl:
      "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=location|ff0000", 
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const [position, setPosition] = useState<[number, number]>([-6.2, 106.816666]);

  return (

    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
   
      <div className="relative bg-white border border-gray-300 rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-white hover:bg-red-600 transition p-1 rounded"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <IdentificationIcon className="h-6 w-6 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800 text-center">
            Absen {tipe === "masuk" ? "Masuk" : "Pulang"} (Manual)
          </h2>
        </div>

        {/* Form */}
        <ScrollArea className="h-[400px] pr-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Autocomplete Nama Pegawai */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pegawai
            </label>
            <input
  type="text"
  placeholder="Ketik nama pegawai..."
  value={nama}
  onChange={(e) => {
    setNama(e.target.value);
    setShowDropdown(true);
    setHighlightIndex(-1);
    setError(null);
  }}
  onFocus={() => setShowDropdown(true)}
  onKeyDown={(e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredPegawai.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredPegawai.length - 1
      );
    } else if (e.key === "Enter") {
      if (showDropdown && filteredPegawai.length > 0) {
        e.preventDefault();
        const indexToUse =
          highlightIndex >= 0 ? highlightIndex : 0; // default pilih pertama
        handleSelectPegawai(filteredPegawai[indexToUse]);
      }
    }
  }}
         
              className="w-full p-2 border border-gray-900 text-black rounded text-sm"
            />
            {showDropdown && nama && (
  <ul className="absolute z-10 w-full bg-white border text-gray-700 border-gray-300 rounded-lg shadow max-h-40 overflow-y-auto mt-1">
    {filteredPegawai.length > 0 ? (
      filteredPegawai.map((p, idx) => (
        <li
          key={p.id}
          onClick={() => handleSelectPegawai(p)}
          className={`px-3 py-2 cursor-pointer ${
            idx === highlightIndex
              ? "bg-blue-100"
              : "hover:bg-blue-50"
          }`}
        >
          {p.nama}
        </li>
      ))
    ) : (
      <li className="px-3 py-2 text-gray-500">Tidak ditemukan</li>
    )}
  </ul>
)}
          </div>

          {/* Jabatan otomatis terisi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jabatan
            </label>
            <input
              type="text"
              placeholder="Masukkan jabatan"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              className="w-full p-2 border border-gray-900 text-black rounded text-sm"
            />
          </div>

          {/* Waktu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Absen
            </label>
            <input
              type="datetime-local"
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
              className="w-full p-2 border border-gray-900 text-black rounded text-sm"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <textarea
              placeholder="Tambahkan keterangan (opsional)"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full p-2 border border-gray-900 text-black rounded text-sm"
              rows={3}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-100 border border-red-300 rounded-md p-2">
              {error}
            </div>
          )}

          {/* Lokasi */}
          <div className="space-y-2">
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <MapPinIcon className="h-5 w-5" />
    {lokasi.startsWith("Gagal") ? (
      <span>Lokasi: {lokasi}</span>
    ) : (
      <a
        href={`https://www.google.com/maps?q=${lokasi}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Lihat di Google Maps
      </a>
    )}
  </div>

  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lon = pos.coords.longitude.toFixed(6);
            setLokasi(`${lat}, ${lon}`);
          },
          () => {
            setLokasi("Gagal mendapatkan lokasi");
          }
        );
      }}
      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm"
    >
      Gunakan Lokasi Saat Ini
    </button>

    <button
      type="button"
      onClick={() => {
        // reset tampilan sementara lalu meminta ulang posisi
        setLokasi("Mengambil lokasi...");
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lon = pos.coords.longitude.toFixed(6);
            setLokasi(`${lat}, ${lon}`);
          },
          () => setLokasi("Gagal mendapatkan lokasi")
        );
      }}
      className="px-3 py-1 rounded bg-gray-100 text-gray-700 border text-sm"
    >
      Refresh Lokasi
    </button>
  </div>

  {/* Peta: rounded + overlay instruksi */}
  <div className="relative rounded-lg overflow-hidden border border-gray-200" style={{ height: 250 }}>
    {/* overlay instruksi (pointer-events-none biar tidak menghalangi klik ke peta) */}
    <div className="absolute top-2 left-2 z-20 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-700 pointer-events-none">
      Klik pada peta untuk memilih lokasi
    </div>

    <MapContainer
      center={[-6.2, 106.8]} // default Jakarta
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      // optional: attributionControl={false} jika mau sembunyikan
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* LocationMarker sudah ada di atas file dan akan meng-set lokasi saat peta diklik */}
      <LocationMarker setLokasi={setLokasi} />
      <Marker position={position} icon={customMarker}>
        <Popup>Lokasi yang kamu pilih</Popup>
      </Marker>
    </MapContainer>
  </div>

  {/* Panel info koordinat + aksi */}
  <div className="flex items-center justify-between gap-2 mt-2">
    <div className="text-sm text-gray-700">
      <div className="font-medium">Koordinat pilihan:</div>
      <div className="text-xs text-gray-500 break-words">{lokasi}</div>
    </div>

    <div className="flex gap-2">
      {/* <button
        type="button"
        onClick={() => {
          const valid = /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(lokasi);
          if (!valid) return;
          navigator.clipboard
            ?.writeText(lokasi)
            .catch(() => {
              
            });
        }}
        disabled={!/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(lokasi)}
        className="px-3 py-1 rounded bg-green-500 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Salin koordinat"
      >
        Salin
      </button> */}

      <button
        type="button"
        onClick={() => setLokasi("Mengambil lokasi...")}
        className="px-3 py-1 rounded bg-red-600 border text-sm"
      >
        Reset
      </button>
    </div>
  </div>
</div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-5 py-2 rounded-md text-white font-semibold bg-black hover:bg-gray-800 transition"
          >
            Kirim Absen Manual
          </button>
        </form>
        </ScrollArea>
      </div>
    </div>
    
  );
}

