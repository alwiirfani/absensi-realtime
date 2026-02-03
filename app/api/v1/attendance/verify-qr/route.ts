// import { NextRequest, NextResponse } from "next/server";
// import db from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     // Ambil code dari query param (?code=...)
//     const code = req.nextUrl.searchParams.get("code");

//     if (!code) {
//       return NextResponse.json(
//         { success: false, message: "Code QR tidak ditemukan" },
//         { status: 400 },
//       );
//     }

//     // Cari QR Code di database
//     const qrCode = await db.qRCode.findUnique({
//       where: { code },
//       include: {
//         user: {
//           select: { name: true, position: true },
//         },
//         attendances: {
//           select: {
//             id: true,
//             clockIn: true,
//             photoUrl: true,
//             location: {
//               select: { latitude: true, longitude: true, address: true },
//             },
//           },
//           take: 1,
//         },
//       },
//     });

//     if (!qrCode) {
//       return NextResponse.json(
//         { success: false, message: "QR Code tidak ditemukan" },
//         { status: 404 },
//       );
//     }

//     const now = new Date();

//     // Validasi expired dan used
//     if (qrCode.expiredAt < now) {
//       return NextResponse.json(
//         { success: false, message: "QR Code sudah kadaluarsa" },
//         { status: 400 },
//       );
//     }

//     if (qrCode.isUsed) {
//       return NextResponse.json(
//         { success: false, message: "QR Code sudah pernah digunakan" },
//         { status: 400 },
//       );
//     }

//     // Tandai sebagai used (sekali pakai)
//     await db.qRCode.update({
//       where: { id: qrCode.id },
//       data: { isUsed: true },
//     });

//     // Return hasil verifikasi
//     return NextResponse.json({
//       success: true,
//       message: "Absensi berhasil diverifikasi!",
//       data: {
//         user: {
//           name: qrCode.user.name,
//           position: qrCode.user.position || "Tidak ada posisi",
//         },
//         attendance: qrCode.attendances[0]
//           ? {
//               id: qrCode.attendances[0].id,
//               clockIn: qrCode.attendances[0].clockIn?.toISOString(),
//               photoUrl: qrCode.attendances[0].photoUrl,
//               location: qrCode.attendances[0].location,
//             }
//           : null,
//         qrCode: {
//           code: qrCode.code,
//           verifiedAt: now.toISOString(),
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Error verify QR:", error);
//     return NextResponse.json(
//       { success: false, message: "Gagal verifikasi QR" },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin; // atau gunakan process.env.NEXT_PUBLIC_BASE_URL kalau ada

  try {
    const code = req.nextUrl.searchParams.get("code");

    // Case 1: Tidak ada code → redirect dengan error
    if (!code) {
      const url = new URL("/absensi/qr/verify", origin);
      url.searchParams.set("success", "false");
      url.searchParams.set("message", "Code QR tidak ditemukan");
      return NextResponse.redirect(url, 303); // 303 See Other lebih cocok untuk redirect setelah GET
    }

    // Cari QR Code
    const qrCode = await db.qRCode.findUnique({
      where: { code },
      include: {
        user: {
          select: { name: true, position: true },
        },
        attendances: {
          select: {
            id: true,
            clockIn: true,
            photoUrl: true,
            location: {
              select: { latitude: true, longitude: true, address: true },
            },
          },
          take: 1,
        },
      },
    });

    // Case 2: QR tidak ditemukan
    if (!qrCode) {
      const url = new URL("/absensi/qr/verify", origin);
      url.searchParams.set("success", "false");
      url.searchParams.set("message", "QR Code tidak ditemukan");
      return NextResponse.redirect(url, 303);
    }

    const now = new Date();

    // Case 3: Expired
    if (qrCode.expiredAt < now) {
      const url = new URL("/absensi/qr/verify", origin);
      url.searchParams.set("success", "false");
      url.searchParams.set("message", "QR Code sudah kadaluarsa");
      return NextResponse.redirect(url, 303);
    }

    // Case 4: Sudah digunakan
    if (qrCode.isUsed) {
      const url = new URL("/absensi/qr/verify", origin);
      url.searchParams.set("success", "false");
      url.searchParams.set("message", "QR Code sudah pernah digunakan");
      return NextResponse.redirect(url, 303);
    }

    // Sukses: tandai used
    await db.qRCode.update({
      where: { id: qrCode.id },
      data: { isUsed: true },
    });

    // Case sukses → redirect dengan data minimal lewat query params
    // (atau simpan di session/cookie kalau data terlalu besar)
    const url = new URL("/absensi/qr/verify", origin);
    url.searchParams.set("success", "true");
    url.searchParams.set("message", "Absensi berhasil diverifikasi!");
    url.searchParams.set("name", qrCode.user.name);
    url.searchParams.set(
      "position",
      qrCode.user.position || "Tidak ada posisi",
    );

    if (qrCode.attendances[0]) {
      url.searchParams.set(
        "clockIn",
        qrCode.attendances[0].clockIn?.toISOString() || "",
      );
      url.searchParams.set("photoUrl", qrCode.attendances[0].photoUrl || "");
      if (qrCode.attendances[0].location?.address) {
        url.searchParams.set("address", qrCode.attendances[0].location.address);
      }
    }

    return NextResponse.redirect(url, 303);
  } catch (error) {
    console.error("Error verify QR:", error);

    const url = new URL("/absensi/qr/verify", origin);
    url.searchParams.set("success", "false");
    url.searchParams.set("message", "Gagal verifikasi QR");
    return NextResponse.redirect(url, 303);
  }
}
