"use client";

import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type ExportButtonProps<T> = {
  data: T[];
  fileName?: string;
};

export function ExportButton<T extends Record<string, unknown>>({
  data,
  fileName = "data",
}: ExportButtonProps<T>) {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Data Export", 10, 10);

    let y = 20;
    data.forEach((row, index) => {
      // stringify tiap row biar simpel
      doc.text(`${index + 1}. ${JSON.stringify(row)}`, 10, y);
      y += 10;
    });

    doc.save(`${fileName}.pdf`);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportPDF}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Export PDF
      </button>
      <button
        onClick={handleExportExcel}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Export Excel
      </button>
    </div>
  );
}
