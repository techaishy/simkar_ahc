"use client";

import { useEffect, useState } from "react";
import {
  IdentificationIcon,
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  const [waktu, setWaktu] = useState(() => new Date().toISOString().slice(0, 16));
  const [lokasi, setLokasi] = useState("Mengambil lokasi...");
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isClient, setIsClient] = useState(false);

  const filteredPegawai = pegawaiList.filter((p) =>
    p.nama.toLowerCase().includes(nama.toLowerCase())
  );

  const [position, setPosition] = useState<[number, number]>([-6.2, 106.816666]);

  // Set client-only state & geolocation
  useEffect(() => {
    setIsClient(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lon = pos.coords.longitude.toFixed(6);
          setLokasi(`${lat}, ${lon}`);
          setPosition([parseFloat(lat), parseFloat(lon)]);
        },
        () => setLokasi("Gagal mendapatkan lokasi")
      );
    }
  }, []);

  const handleSelectPegawai = (pegawai: Pegawai) => {
    setNama(pegawai.nama);
    setJabatan(pegawai.jabatan);
    setShowDropdown(false);
    setHighlightIndex(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama harus diisi.");
      return;
    }
    try {
      await onSubmit?.({ nama, jabatan, lokasi, waktu, keterangan });
      alert(`✅ Presensi ${tipe} berhasil`);
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal submit presensi");
    }
  };

  const customMarker = new L.Icon({
    iconUrl: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=location|ff0000",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Marker klik di map
  function LocationMarker({ setLokasi }: { setLokasi: (value: string) => void }) {
    const [pos, setPos] = useState<L.LatLng | null>(null);
    if (!isClient) return null;

    useMapEvents({
      click(e) {
        setPos(e.latlng);
        setLokasi(`${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return pos ? <Marker position={pos} icon={customMarker}><Popup>Lokasi yang dipilih</Popup></Marker> : null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white border border-gray-300 rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-white hover:bg-red-600 transition p-1 rounded"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <IdentificationIcon className="h-6 w-6 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800 text-center">
            Absen {tipe === "masuk" ? "Masuk" : "Pulang"} (Manual)
          </h2>
        </div>

        <ScrollArea className="h-[500px] pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Pegawai */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pegawai
              </label>
              <input
                type="text"
                placeholder="Ketik nama pegawai..."
                value={nama}
                onChange={(e) => { setNama(e.target.value); setShowDropdown(true); setHighlightIndex(-1); setError(null); }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIndex(prev => prev < filteredPegawai.length - 1 ? prev + 1 : 0); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIndex(prev => prev > 0 ? prev - 1 : filteredPegawai.length - 1); }
                  else if (e.key === "Enter") {
                    if (showDropdown && filteredPegawai.length > 0) {
                      e.preventDefault();
                      const indexToUse = highlightIndex >= 0 ? highlightIndex : 0;
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
                        className={`px-3 py-2 cursor-pointer ${idx === highlightIndex ? "bg-blue-100" : "hover:bg-blue-50"}`}
                      >
                        {p.nama}
                      </li>
                    ))
                  ) : (<li className="px-3 py-2 text-gray-500">Tidak ditemukan</li>)}
                </ul>
              )}
            </div>

            {/* Jabatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
              <input type="text" placeholder="Masukkan jabatan" value={jabatan} onChange={e => setJabatan(e.target.value)} className="w-full p-2 border border-gray-900 text-black rounded text-sm" />
            </div>

            {/* Waktu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Absen</label>
              <input type="datetime-local" value={waktu} onChange={e => setWaktu(e.target.value)} className="w-full p-2 border border-gray-900 text-black rounded text-sm" />
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <textarea placeholder="Tambahkan keterangan Kendala absen" value={keterangan} onChange={e => setKeterangan(e.target.value)} className="w-full p-2 border border-gray-900 text-black rounded text-sm" rows={3} />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-100 border border-red-300 rounded-md p-2">{error}</div>}

            {/* Lokasi & Map */}
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

              {isClient && (
                <div className="relative rounded-lg overflow-hidden border border-gray-200" style={{ height: 250 }}>
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <LocationMarker setLokasi={setLokasi} />
                  </MapContainer>
                </div>
              )}
            </div>

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
