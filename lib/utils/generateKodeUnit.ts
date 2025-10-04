export function generateKodeUnit(
  nama: string,
  merek: string,
  id: string,
  totalUnits: number
): string {

  const namaPrefix =
    nama.trim().substring(0, 3).toUpperCase() || "RDN";

  const merekPrefix =
    merek.trim()
      ? merek.trim().substring(0, 3).toUpperCase()
      : "NON"; 

  const idPrefix = id.replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase();
  const nomor = String(totalUnits + 1).padStart(3, "0");

  return `${namaPrefix}-${merekPrefix}-${idPrefix}-${nomor}`;
}
