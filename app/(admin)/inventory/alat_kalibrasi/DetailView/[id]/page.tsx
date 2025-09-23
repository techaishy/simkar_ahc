import AlatDetailView from "@/module/inventory/alat_kalibrasi/AlatDetailView";

interface PageProps {
  params: { id: string }; 
}

export default function Page({ params }: PageProps) {
  return <AlatDetailView alatId={params.id} />;
}
