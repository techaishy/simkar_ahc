'use client'

import React from "react"
import BarcodeGenerator from "./generateBarcode/formBarcode"

export default function SatuanKerjaPage() {
    return (
        <div className="p-6 text-black space-y-4">
            <BarcodeGenerator />
        </div>
    );
}