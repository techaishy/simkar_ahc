"use client"

import DataPegawaiTable from "./components/DataPegawaiTabel"
import Breadcrumbs from "@/components/ui/breadcrumb"


export default function PegawaiPage() {
    const handleEdit = (id: string) => {
        console.log("Edit data dengan id:", id);
        alert("Edit data ID: " + id);
      };
    
      // fungsi untuk hapus
      const handleDelete = (id: string) => {
        console.log("Hapus data dengan id:", id);
        alert("Hapus data ID: " + id);
      };
  return (
    <div className="p-4 text-black space-y-4">
       <div className="p-4 font-semibold">
      <Breadcrumbs />
    </div>
      
  
        <DataPegawaiTable onEdit={handleEdit} onDelete={handleDelete}/>

    </div>
  )
}
