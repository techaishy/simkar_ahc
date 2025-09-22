"use client";

import DataPegawaiTable from "./components/DataPegawaiTabel";
import Breadcrumbs from "@/components/ui/breadcrumb";

export default function PegawaiPage() {
  return (
    <div className="p-4 text-black space-y-4">
      <div className="p-4 font-semibold">
        <Breadcrumbs />
      </div>

      <DataPegawaiTable />
    </div>
  );
}
