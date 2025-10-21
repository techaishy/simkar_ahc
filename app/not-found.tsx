import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-600/20 p-6 rounded-full mb-6">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-4xl font-bold mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-300 text-lg max-w-md mb-8">
          Maaf, halaman yang Anda cari tidak tersedia atau mungkin sudah
          dipindahkan.
        </p>

        <Link
          href="/admin"
          className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold transition"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
