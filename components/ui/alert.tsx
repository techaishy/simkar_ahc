// "use client";

// import React, { useEffect } from "react";
// import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface AlertMessageProps {
//   type: "success" | "error" | "info" | "warning";
//   message: string;
//   show: boolean;
//   onClose: () => void;
//   duration?: number;
// }

// const icons = {
//   success: <CheckCircle className="text-green-500 w-20 h-20" />,
//   error: <XCircle className="text-red-500 w-20 h-20" />,
//   info: <Info className="text-blue-500 w-20 h-20" />,
//   warning: <AlertTriangle className="text-yellow-500 w-20 h-20" />,
// };

// const bgColors = {
//   success: "bg-green-100 border-green-400",
//   error: "bg-red-100 border-red-400",
//   info: "bg-blue-100 border-blue-400",
//   warning: "bg-yellow-100 border-yellow-400",
// };

// export default function AlertMessage({
//   type,
//   message,
//   show,
//   onClose,
//   duration = 3000,
// }: AlertMessageProps) {
//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(() => {
//         onClose();
//       }, duration);
//       return () => clearTimeout(timer);
//     }
//   }, [show, duration, onClose]);

//   return (
//     <AnimatePresence>
//       {show && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8, y: -50 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.8, y: -50 }}
//           transition={{ duration: 0.3 }}
//           className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
//         >
//           <div
//             className={`
//               relative flex flex-col items-center justify-center text-center
//               border rounded-2xl shadow-2xl ${bgColors[type]}
//               w-100 h-100  
//               p-10      
//             `}
//           >
        
//             <div className="mb-3">{icons[type]}</div>

//             <p className="font-semibold capitalize text-xl">
//               {type === "success"
//                 ? "Berhasil!"
//                 : type === "error"
//                 ? "Gagal!"
//                 : type === "info"
//                 ? "Informasi"
//                 : "Peringatan!"}
//             </p>

//             <p className="text-lg mt-2">{message}</p>

            
//             <button
//               onClick={onClose}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react"

interface AlertMessageProps {
  type?: "success" | "error" | "info" | "warning"
  message: string
  show: boolean
  onClose?: () => void
  duration?: number
}

const icons = {
  success: <CheckCircle className="w-16 h-16 text-green-600" />,
  error: <XCircle className="w-16 h-16 text-red-600" />,
  info: <Info className="w-16 h-16 text-blue-600" />,
  warning: <AlertCircle className="w-16 h-16 text-yellow-600" />,
}

const titles = {
  success: "Berhasil!",
  error: "Gagal!",
  info: "Informasi",
  warning: "Peringatan!",
}

export default function AlertMessage({
  type = "info",
  message,
  show,
  onClose,
  duration = 3000,
}: AlertMessageProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay hitam muncul SETELAH alert muncul */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            onClick={onClose}
          />

          {/* Kotak Alert */}
          <motion.div
            key="alert"
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div
              className={`relative flex flex-col items-center gap-4 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border ${
                type === "success"
                  ? "bg-green-100 border-green-300 text-green-700"
                  : type === "error"
                  ? "bg-red-100 border-red-300 text-red-700"
                  : type === "warning"
                  ? "bg-yellow-100 border-yellow-300 text-yellow-700"
                  : "bg-blue-100 border-blue-300 text-blue-700"
              }`}
            >
              {icons[type]}
              <h2 className="text-xl font-bold">{titles[type]}</h2>
              <p className="text-sm">{message}</p>

              {/* Tombol close */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
