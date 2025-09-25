
export function generateKodeUnit(merek: string, totalUnits: number): string {
    const prefix = merek.substring(0, 3).toUpperCase();
    const nomor = String(totalUnits + 1).padStart(3, "0");
    return `${prefix}-${nomor}`;
  }