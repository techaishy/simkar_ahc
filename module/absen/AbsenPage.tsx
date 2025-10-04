"use client";

import { useEffect, useState } from "react";
import MetodeAbsensiModal from "./components/common/MetodeAbsenModal";
import AbsensiCamera from "./components/camera/AbsenCamera";
import AbsensiBarcode from "./components/barcode/BarcodeScanner";
import AbsensiManual from "./components/manual/AbsenFormManual";
import { AbsensiButtons } from "./components/common/AbsenButton";

type Lokasi = {
  id: string;
  nama: string;
  latitude: number;
  longitude: number;
  radiusMeter: number;
  enableClockIn: boolean;
  enableClockOut: boolean;
};

type Props = {
  userId: string;
};

export default function AbsensiClient({ userId }: Props) {
  const [tipeAbsen, setTipeAbsen] = useState<"masuk" | "pulang" | null>(null);
  const [showMetode, setShowMetode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [selectedLokasi, setSelectedLokasi] = useState<Lokasi | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [currentMetode, setCurrentMetode] = useState<"selfie" | "barcode" | "manual">("manual");

  
  const getDistanceMeter = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; 
    const toRad = (deg: number) => deg * (Math.PI / 180);
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    console.log("AbsensiClient mounted. userId:", userId);

    if (!userId) {
      console.warn("userId kosong, hentikan fetch izin lokasi");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/user/${userId}/izin-lokasi`);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();

        setLokasiList(data.lokasi);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const userPos = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
              setUserLocation(userPos);

              let closest: Lokasi | null = null;
              let minDistance = Infinity;

              data.lokasi.forEach((loc: Lokasi) => {
                const d = getDistanceMeter(
                  userPos.latitude,
                  userPos.longitude,
                  loc.latitude,
                  loc.longitude
                );
                if (d <= loc.radiusMeter && d < minDistance) {
                  closest = loc;
                  minDistance = d;
                }
              });

              if (closest) {
                setSelectedLokasi(closest);
                setDistance(minDistance);
              } else {
                const fallback = data.lokasi[0];
                setSelectedLokasi(fallback);
                setDistance(
                  getDistanceMeter(
                    userPos.latitude,
                    userPos.longitude,
                    fallback.latitude,
                    fallback.longitude
                  )
                );
              }
            },
            () => {
              const fallback = data.lokasi[0];
              setSelectedLokasi(fallback);
              setDistance(null);
            },
            { enableHighAccuracy: true }
          );
        } else {
          const fallback = data.lokasi[0];
          setSelectedLokasi(fallback);
          setDistance(null);
        }
      } catch (err) {
        console.error("Gagal ambil izin lokasi:", err);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!selectedLokasi) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const userPos = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(userPos);

        const d = getDistanceMeter(
          userPos.latitude,
          userPos.longitude,
          selectedLokasi.latitude,
          selectedLokasi.longitude
        );
        setDistance(d);
      },
      (err) => {
        console.warn("Gagal update lokasi realtime:", err);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [selectedLokasi]);


  const handleAbsenClick = (tipe: "masuk" | "pulang") => {
    console.log("Klik tombol absen:", tipe);
    setTipeAbsen(tipe);
    setShowMetode(true);
  };

  const handleSelectMetode = (metode: "selfie" | "barcode" | "manual") => {
    console.log("Metode absensi dipilih:", metode);
    setShowMetode(false);
    setShowModal(true);
    setCurrentMetode(metode);
  };

  const handleCloseModal = () => {
    console.log("Menutup modal absensi");
    setShowModal(false);
    setTipeAbsen(null);
  };

  const handleSubmitAttendance = async (fotoOrData?: any) => {
    console.log("Submit attendance, data foto/data:", fotoOrData);
    if (!userId || !userLocation || !selectedLokasi || !tipeAbsen) {
      console.warn("Data belum lengkap, submit dibatalkan");
      return;
    }

    const payload = {
      userId,
      date: new Date().toISOString(),
      clockIn: tipeAbsen === "masuk" ? new Date().toISOString() : null,
      clockOut: tipeAbsen === "pulang" ? new Date().toISOString() : null,
      statusMasuk: tipeAbsen === "masuk" ? "HADIR" : undefined,
      statusPulang: tipeAbsen === "pulang" ? "HADIR" : undefined,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      location: selectedLokasi.nama,
      lokasiId: selectedLokasi.id,
      photoIn: tipeAbsen === "masuk" ? fotoOrData?.photo || null : null,
      photoOut: tipeAbsen === "pulang" ? fotoOrData?.photo || null : null,
    };

    console.log("Payload dikirim ke API:", payload);

    try {
      const res = await fetch("/api/presensi/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Response API:", data);

      if (!res.ok) throw new Error(data.error || "Gagal submit presensi");
      alert(`✅ Presensi ${tipeAbsen} berhasil`);

      if (tipeAbsen === "masuk") {
        setSelectedLokasi((prev) =>
          prev ? { ...prev, enableClockIn: false } : prev
        );
      } else if (tipeAbsen === "pulang") {
        setSelectedLokasi((prev) =>
          prev ? { ...prev, enableClockOut: false } : prev
        );
      }

      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal submit presensi");
    }
  };

  const isWithinRadius =
    distance !== null && selectedLokasi
      ? distance <= selectedLokasi.radiusMeter
      : false;

return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
    
    {/* Info jarak dan lokasi */}
    <div className="text-center text-sm text-gray-600">
      {distance !== null && selectedLokasi ? (
        <p>
          Anda berada <b>{Math.round(distance)} m</b> dari{" "}
          <b>{selectedLokasi.nama}</b> (radius {selectedLokasi.radiusMeter} m)
        </p>
      ) : (
        <p>Sedang mengambil lokasi Anda...</p>
      )}
    </div>
    
      {/* Tombol absen */}
      <AbsensiButtons
        onAbsenClick={handleAbsenClick}
        enableClockIn={selectedLokasi?.enableClockIn}
        enableClockOut={selectedLokasi?.enableClockOut}
      />

      {/* Pilih metode */}
      {showMetode && tipeAbsen && (
        <MetodeAbsensiModal
          tipeAbsen={tipeAbsen}
          onSelect={handleSelectMetode}
          onClose={() => setShowMetode(false)}
        />
      )}

      {/* Modal absen */}
      {showModal && tipeAbsen && (
        <>
          {currentMetode === "selfie" && (
            <AbsensiCamera
              onClose={handleCloseModal}
              tipe={tipeAbsen}
              onSubmit={handleSubmitAttendance}
              isWithinRadius={isWithinRadius}
            />
          )}
          {currentMetode === "barcode" && (
            <AbsensiBarcode
              onClose={handleCloseModal}
              tipe={tipeAbsen}
              onSubmit={handleSubmitAttendance}
              // isWithinRadius={isWithinRadius}
            />
          )}
          {currentMetode === "manual" && (
            <AbsensiManual
              onClose={handleCloseModal}
              tipe={tipeAbsen}
              onSubmit={handleSubmitAttendance}
              // isWithinRadius={isWithinRadius}
            />
          )}
        </>
      )}
    </div>
  );
}