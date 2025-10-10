import WilayahKerja from "@/module/satuan-kerja/Wilayah Kerja/WilayahKerjaTable";

export default function Page({ params }: { params: { kotaId: string } }) {
    return (
        <div className="p-0">
            <WilayahKerja kotaId={params.kotaId} />
        </div>
    );
}