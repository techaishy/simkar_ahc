"use client";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="relative">
    <Image
      src="/asset/logo_ahc.png"
      alt="Logo"
      width={60}
      height={60}
      priority
      style={{
        objectFit: "contain" 
      }}
    />
    </div>
  );
}
