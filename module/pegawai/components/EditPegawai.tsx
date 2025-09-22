"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Karyawan } from "../../../lib/types/karyawan";
import PegawaiForm from "./PegawaiForm";

type Props = {
  open: boolean;
  onClose: () => void;
  karyawan?: Karyawan;
  onSave: (karyawan: Karyawan) => void;
};

export default function EditPegawaiDialog({ open, onClose, karyawan, onSave }: Props) {
  const [data, setData] = useState<Karyawan | undefined>(karyawan);

  useEffect(() => {
    console.log("EditPegawai karyawan:", karyawan);
    setData(karyawan);
  }, [karyawan]);
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Pegawai</DialogTitle>
        </DialogHeader>

        {data && (
          <PegawaiForm
            initialData={data}
            onSave={(KaryawanBaru) => {
              onSave(KaryawanBaru);
              onClose(); 
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
