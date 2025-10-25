"use client";

import React from "react";
import { Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({ name, onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-black via-gray-950 to-gray-800 rounded-lg w-full max-w-md p-6 border border-gray-700 shadow-2xl relative"
      >
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-600/20 rounded-full">
            <Trash2 className="text-red-500" size={22} />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Hapus Data</h3>
        </div>

        {/* Isi */}
        <p className="text-sm text-gray-300 leading-relaxed">
          Apakah kamu yakin ingin menghapus{" "}
          <strong className="text-red-400">{name}</strong>?  
          <br />
          <span className="text-gray-400">Tindakan ini tidak dapat dibatalkan.</span>
        </p>

        {/* Tombol aksi */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm()}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition shadow-md"
          >
            Hapus
          </button>
        </div>
      </motion.div>
    </div>
  );
}
