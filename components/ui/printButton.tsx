"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export type PrintButtonProps = {
  printRef?: React.RefObject<HTMLElement | null>;
  title?: string;
  size?: "sm" | "default" | "lg";
  label?: string;
  className?: string;
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
      className="text-white border-1 font-semibold bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black  transition-all duration-300 shadow-md"
      onClick={handlePrint}
    >
      <Printer className="mr-0 h-4 w-4" /> {label}
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
  .no-print {
    display: none !important;
  }

  table { 
    width: 100%; 
    border-collapse: collapse; 
  }
  th, td { 
    border: 1px solid #000; 
    padding: 6px; 
    text-align: left; 
  }
  th {
    background: #f0f0f0;
  }
    @media print { @page { margin: 16mm; } }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 16px;  font-size: 12px; }
  </style>
</head>
<h2 style="text-align:center; margin-bottom:16px;">${escapeHtml(title || "Cetak")}</h2>
${element.outerHTML}
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
