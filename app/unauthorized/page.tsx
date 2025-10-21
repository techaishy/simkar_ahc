import Link from 'next/link';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
          <ShieldExclamationIcon className="w-12 h-12 text-orange-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Akses Ditolak
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        
        <Link 
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}