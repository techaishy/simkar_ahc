"use client";

import React from "react";
import DataAlatTable from "./alat_kalibrasi/AlatKalibrasiTable";
import Breadcrumbs from "@/components/ui/breadcrumb";

export default function InventoryPage() {
  return (
    <div className="p-4 text-black space-y-4">
      <div className="p-4 font-semibold">
        <Breadcrumbs />
      </div>

      <DataAlatTable />
    </div>
  );
}