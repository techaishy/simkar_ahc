"use client";

import React from "react";

type Props = {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({ name, onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-sm p-6">
        <h3 className="text-lg font-medium mb-2">Hapus Data</h3>
        <p className="text-sm text-gray-600">Apakah kamu yakin ingin menghapus <strong>{name}</strong> ?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-2 rounded-md border">Batal</button>
          <button onClick={() => { onConfirm(); }} className="px-3 py-2 rounded-md bg-red-600 text-white">Hapus</button>
        </div>
      </div>
    </div>
  );
}
