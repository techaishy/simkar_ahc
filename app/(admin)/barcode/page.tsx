"use client"

import BarcodeGenerator from "@/module/Barcode/generateBarcode/formBarcode"
import Breadcrumbs from "@/components/ui/breadcrumb"

export default function BarcodePage() {
    return (
        <div className="p-6 text-black space-y-4">
            <Breadcrumbs  />
            <BarcodeGenerator />
        </div>
    );
}