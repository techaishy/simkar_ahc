export function generateKodeAlat(nama: string, merek: string, nomorUrut: number) {
 
  const namaInisial = nama.trim().substring(0, 3).toUpperCase();
  const merekInisial = merek.trim().substring(0, 3).toUpperCase();
  const nomor = String(nomorUrut).padStart(3, "0");
  return `${namaInisial}-${merekInisial}-${nomor}`;
}
