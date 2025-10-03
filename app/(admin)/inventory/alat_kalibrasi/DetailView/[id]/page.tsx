import AlatDetailView from "@/module/inventory/alat_kalibrasi/AlatDetailView";
import type { Alat } from "@/lib/types/alat";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/inventory/alat-kalibrator/${id}`, {
    cache: "no-store", 
  });

  if (!res.ok) {
    return <p>Alat tidak ditemukan</p>;
  }

  const alat: Alat = await res.json();

  return <AlatDetailView open={true} onClose={() => {}} alat={alat} />;
}
