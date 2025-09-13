"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pegawai } from "../types/pegawai";
import PegawaiForm from "./PegawaiForm";

type Props = {
  open: boolean;
  onClose: () => void;
  pegawai?: Pegawai;
  onSave: (pegawai: Pegawai) => void;
};

export default function EditPegawaiDialog({ open, onClose, pegawai, onSave }: Props) {
  const [data, setData] = useState<Pegawai | undefined>(pegawai);

  useEffect(() => {
    setData(pegawai);
  }, [pegawai]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Pegawai</DialogTitle>
        </DialogHeader>

        {data && (
          <PegawaiForm
            initialData={data}
            onSave={(pegawaiBaru) => {
              onSave(pegawaiBaru);
              onClose(); // tutup modal setelah simpan
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
