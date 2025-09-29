"use client";

import React from "react";
import MenuSuratKeluar from "./components/SuratKeluarTabs";
// import Breadcrumbs from "@/components/ui/breadcrumb";

export default function InventoryPage() {
  return (
    <div className="p-6 text-black space-y-4">
      <MenuSuratKeluar/>
    </div>
  );
}