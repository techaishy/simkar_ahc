// generateKodeAlat.ts

// bikin kode dari 3 bagian: inisial nama alat, inisial merk, dan nomor urut
export function generateKodeAlat(nama: string, merek: string, nomorUrut: number) {
 
  const namaInisial = nama.trim().substring(0, 3).toUpperCase();
  const merekInisial = merek.trim().substring(0, 3).toUpperCase();

  const nomor = String(nomorUrut).padStart(3, "0");

  // gabungkan
  return `${namaInisial}-${merekInisial}-${nomor}`;
}
