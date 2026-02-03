import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { User } from "@prisma/client";

// Type response user (tanpa password)
type SafeUser = Omit<User, "password">;

export async function GET(req: NextRequest) {
  try {
    const users: SafeUser[] = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data user" },
      { status: 500 },
    );
  }
}
