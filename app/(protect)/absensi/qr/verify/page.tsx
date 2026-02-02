export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const code = resolvedSearchParams.code;

  if (!code) {
    return <div className="p-8 text-center">Code QR tidak ditemukan</div>;
  }

  const res = await fetch(
    `http://localhost:3000/api/verify-qr?code=${encodeURIComponent(code)}`,
  );
  const data = await res.json();

  if (!data.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Verifikasi Gagal
          </h1>
          <p>{data.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
        <h1 className="text-3xl font-black text-green-600 mb-6">
          Absensi Terverifikasi!
        </h1>
        <p className="text-lg mb-4">Nama: {data.data.user.name}</p>
        <p className="text-lg mb-4">
          Waktu: {new Date(data.data.attendance.clockIn).toLocaleString()}
        </p>
        {data.data.attendance.location?.address && (
          <p className="text-md text-gray-600">
            Lokasi: {data.data.attendance.location.address}
          </p>
        )}
        <p className="mt-6 text-green-700 font-medium">
          Terima kasih telah absen!
        </p>
      </div>
    </div>
  );
}
