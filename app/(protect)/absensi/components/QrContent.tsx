"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";
import { useRef } from "react";

export default function QRContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const attendanceId = searchParams.get("id");
  const name = searchParams.get("name");
  const timestamp = searchParams.get("timestamp");
  const qrCodeValue = searchParams.get("qrCodeValue");

  const verifyUrl = qrCodeValue
    ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/v1/attendance/verify-qr?code=${encodeURIComponent(qrCodeValue)}`
    : "Absensi berhasil!";

  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `qr-absensi-${attendanceId || "success"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  if (!qrCodeValue || !attendanceId) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">QR Code Tidak Ditemukan</h1>
        <p className="mb-6">Silakan lakukan absensi terlebih dahulu.</p>
        <button
          onClick={() => router.push("/absensi")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
          Kembali ke Absensi
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">
      <h1 className="text-3xl font-black mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
        Absensi Berhasil!
      </h1>
      <p className="text-lg mb-4">Scan QR ini untuk verifikasi kehadiran</p>

      <div className="mb-8 flex justify-center" ref={qrRef}>
        <QRCodeSVG
          value={verifyUrl}
          size={256}
          level="H"
          fgColor="#000000"
          bgColor="#ffffff"
        />
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Nama: {name || "User"} • Waktu:{" "}
        {timestamp ? new Date(Number(timestamp)).toLocaleString() : "-"}
      </p>

      <p className="text-xs text-gray-500 mb-6">
        Scan akan langsung memverifikasi absensi Anda
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={downloadQR}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">
          <Download className="w-5 h-5" />
          Download QR
        </button>

        <button
          onClick={() => router.push("/absensi")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300">
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>
      </div>
    </motion.div>
  );
}
