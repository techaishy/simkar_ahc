"use client";

import { useState } from "react";
import { UserInfoCard } from "./components/common/UserInfoCard";
import { RingkasanHariIni } from "./components/common/Ringkasan";
import { AbsensiButtons } from "./components/common/AbsenButton";
import MetodeAbsensiModal from "./components/common/MetodeAbsenModal";
import AbsensiCamera from "./components/camera/AbsenCamera";
import AbsensiBarcode from "./components/barcode/BarcodeScanner";
import AbsensiManual from "./components/manual/AbsenFormManual";

export default function AbsensiPage() {
  const [showModal, setShowModal] = useState(false);
  const [tipeAbsen, setTipeAbsen] = useState<"masuk" | "pulang" | null>(null);
  const [method, setMethod] = useState<"selfie" | "barcode" | "manual" | null>(
    null
  );

  const handleAbsenClick = (tipe: "masuk" | "pulang") => {
    setTipeAbsen(tipe);
    setShowModal(true);
  };

  const handleMethodSelect = (metode: "selfie" | "barcode" | "manual") => {
    setMethod(metode);
    setShowModal(false);
  };

  return (
    <div className="w-full h-full mx-auto p-4 space-y-6 bg-white min-h-screen">
          <div className=" top-0 z-20 bg-white shadow-sm px-0 py-1">
          <h2 className="text-xl font-bold text-gray-800"> Presensi / Absen</h2>
    </div>
      <UserInfoCard />

      {/* Tombol Absen */}
      <AbsensiButtons onAbsenClick={handleAbsenClick} />

      {/* Modal Pilih Metode */}
      {showModal && (
        <MetodeAbsensiModal
          tipeAbsen={tipeAbsen}
          onClose={() => setShowModal(false)}
          onSelect={handleMethodSelect}
        />
      )}

      {/* Form berdasarkan metode */}
      {method === "selfie" && <AbsensiCamera tipe={tipeAbsen} onClose={() => setMethod(null)} />}
      {method === "barcode" && <AbsensiBarcode tipe={tipeAbsen} onClose={() => setMethod(null)}/>}
      {method === "manual" && tipeAbsen !== null && (
  <AbsensiManual tipe={tipeAbsen} onClose={() => setMethod(null)} />
)}

      <RingkasanHariIni />
    </div>
  );
}

