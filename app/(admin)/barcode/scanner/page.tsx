"use client"

import QRCodeScanner from "@/module/Barcode/Scanner/scan";
import Breadcrumbs from "@/components/ui/breadcrumb"

export default function BarcodePage() {
    return (
        <div className="p-6 text-black space-y-4">
            <Breadcrumbs  />
            <QRCodeScanner />
        </div>
    );
}