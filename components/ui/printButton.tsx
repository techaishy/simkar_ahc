"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export type PrintButtonProps = {
  /** Ref elemen yang mau dicetak */
  printRef?: React.RefObject<HTMLElement> | null;
  /** Judul dokumen saat print */
  title?: string;
  /** Variasi ukuran button */
  size?: "sm" | "default" | "lg";
  /** Text tombol */
  label?: string;
};

export default function PrintButton({
  printRef,
  title = "Cetak Data",
  size = "default",
  label = "Cetak",
}: PrintButtonProps) {
  const handlePrint = () => {
    if (printRef?.current) {
      printElement(printRef.current, title);
      return;
    }
    window.print(); // fallback: print seluruh halaman
  };

  return (
    <Button
      size={size}
      variant="ghost"
      className="rounded-2xl shadow-sm"
      onClick={handlePrint}
    >
      <Printer className="mr-2 h-4 w-4" /> {label}
    </Button>
  );
}

// -------------------- helpers --------------------

function printElement(element: HTMLElement, title?: string) {
  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title || "Cetak")}</title>
  <style>
    @media print { @page { margin: 16mm; } }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 16px; }
  </style>
</head>
<body>${element.outerHTML}</body>
</html>`;
  printHtml(html);
}

function printHtml(html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 1000);
  };
}

function escapeHtml(s: string) {
  return s
    .replaceAll(/&/g, "&amp;")
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;")
    .replaceAll(/\"/g, "&quot;")
    .replaceAll(/'/g, "&#039;");
}
