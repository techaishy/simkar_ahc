"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDeleteModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  namaPegawai?: string
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  namaPegawai,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-red-600 font-semibold text-lg">
            Konfirmasi Hapus
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-700">
          Apakah Anda yakin ingin menghapus{" "}
          <span className="font-semibold">{namaPegawai ?? "pegawai ini"}</span>?
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="font-semibold bg-gradient-to-br from-black to-gray-900 
                       hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black"
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            className="font-semibold bg-gradient-to-br from-black to-gray-900 
                       hover:from-[#f87171] hover:to-[#fca5a5] hover:text-black"
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}