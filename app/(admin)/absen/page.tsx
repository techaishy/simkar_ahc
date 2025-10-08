"use client";
import dynamic from "next/dynamic";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { UserInfoCard } from "@/module/absen/components/common/UserInfoCard";

const AbsensiClient = dynamic(() => import("@/module/absen/AbsenPage"), {
  ssr: false,
});

export default function AbsenPage() {
  return (
    <div className="p-4 space-y-6">
      <Breadcrumbs />
      <UserInfoCard />
      <AbsensiClient />
    </div>
  );
}
