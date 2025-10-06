"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { UserInfoCard } from "@/module/absen/components/common/UserInfoCard";
import AbsensiClient from "@/module/absen/AbsenPage";

export default function AbsenPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        const data = await res.json();
        setUserId(data.id); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="p-4 space-y-6">
     <div className="p4 font-semibold"> 
      <Breadcrumbs />
      </div>
      <UserInfoCard />
      {loading ? (
        <div>Loading user...</div>
      ) : userId ? (
        <AbsensiClient userId={userId} />
      ) : (
        <div>Gagal memuat user</div>
      )}
    </div>
  );
}
