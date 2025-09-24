
export function generateKodeUnit(merek: string, totalUnits: number): string {
    // ambil 3 huruf depan merk, uppercase
    const prefix = merek.substring(0, 3).toUpperCase();
  
    // nomor urut 3 digit, misal 001, 002, dst
    const nomor = String(totalUnits + 1).padStart(3, "0");
  
    return `${prefix}-${nomor}`;
  }