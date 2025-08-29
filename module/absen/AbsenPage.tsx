"use client";

import { useState } from "react";
import { AbsensiButtons } from "./components/common/AbsenButton";
import MetodeAbsensiModal from "./components/common/MetodeAbsenModal";
import AbsensiManual from "./components/manual/AbsenFormManual";
import dynamic from "next/dynamic";

const AbsensiCamera = dynamic(() => import("./components/camera/AbsenCamera"), {
  ssr: false,
});
const AbsensiBarcode = dynamic(
  () => import("./components/barcode/BarcodeScanner"),
  { ssr: false }
);

export default function AbsensiClient() {
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
    <>
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
      {method === "selfie" && (
        <AbsensiCamera tipe={tipeAbsen} onClose={() => setMethod(null)} />
      )}
      {method === "barcode" && (
        <AbsensiBarcode tipe={tipeAbsen} onClose={() => setMethod(null)} />
      )}
      {method === "manual" && tipeAbsen && (
        <AbsensiManual tipe={tipeAbsen} onClose={() => setMethod(null)} />
      )}
    </>
  );
}
