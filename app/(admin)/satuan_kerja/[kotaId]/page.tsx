import WilayahKerja from "@/module/satuan-kerja/Wilayah Kerja/FasilitasKesehatan";
import Breadcrumbs from "@/components/ui/breadcrumb";

export default function Page({ params }: { params: { kotaId: string } }) {
    return (
        <div className="p-0">
                <div className="p-4 pl-10 font-semibold">
      <Breadcrumbs />
    </div>
            <WilayahKerja kotaId={params.kotaId} />
        </div>
    );
}