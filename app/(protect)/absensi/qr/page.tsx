import { Suspense } from "react";
import QRContent from "../components/QrContent";

export default function QRPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-teal-950">
      <Suspense
        fallback={
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md">
            <h1 className="text-3xl font-bold mb-4">Memuat QR...</h1>
            <p>Sedang menyiapkan kode verifikasi...</p>
          </div>
        }>
        <QRContent />
      </Suspense>
    </div>
  );
}
