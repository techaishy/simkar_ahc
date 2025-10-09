"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import clsx from "clsx";

interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  message: string;
  title?: string;
}

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
  error: <XCircle className="w-5 h-5 text-red-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  info: <Info className="w-5 h-5 text-blue-600" />,
};

const Alert: React.FC<AlertProps> = ({ type = "info", title, message }) => {
  return (
    <div
      className={clsx(
        "flex items-start gap-3 p-4 rounded-xl shadow-md border",
        {
          "bg-green-50 border-green-200": type === "success",
          "bg-red-50 border-red-200": type === "error",
          "bg-yellow-50 border-yellow-200": type === "warning",
          "bg-blue-50 border-blue-200": type === "info",
        }
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div>
        {title && <h4 className="font-semibold text-gray-800">{title}</h4>}
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Alert;
