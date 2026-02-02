// app/api/verify-qr/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Ambil code dari query param (?code=...)
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Code QR tidak ditemukan" },
        { status: 400 },
      );
    }

    // Cari QR Code di database
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

    if (!qrCode) {
      return NextResponse.json(
        { success: false, message: "QR Code tidak ditemukan" },
        { status: 404 },
      );
    }

    const now = new Date();

    // Validasi expired dan used
    if (qrCode.expiredAt < now) {
      return NextResponse.json(
        { success: false, message: "QR Code sudah kadaluarsa" },
        { status: 400 },
      );
    }

    if (qrCode.isUsed) {
      return NextResponse.json(
        { success: false, message: "QR Code sudah pernah digunakan" },
        { status: 400 },
      );
    }

    // Tandai sebagai used (sekali pakai)
    await db.qRCode.update({
      where: { id: qrCode.id },
      data: { isUsed: true },
    });

    // Return hasil verifikasi (bisa untuk halaman web atau app lain)
    return NextResponse.json({
      success: true,
      message: "Absensi berhasil diverifikasi!",
      data: {
        user: {
          name: qrCode.user.name,
          position: qrCode.user.position || "Tidak ada posisi",
        },
        attendance: qrCode.attendances[0]
          ? {
              id: qrCode.attendances[0].id,
              clockIn: qrCode.attendances[0].clockIn?.toISOString(),
              photoUrl: qrCode.attendances[0].photoUrl,
              location: qrCode.attendances[0].location,
            }
          : null,
        qrCode: {
          code: qrCode.code,
          verifiedAt: now.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Error verify QR:", error);
    return NextResponse.json(
      { success: false, message: "Gagal verifikasi QR" },
      { status: 500 },
    );
  }
}
