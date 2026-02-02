import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { attendanceId } = await req.json();

  const updated = await db.attendance.update({
    where: { id: attendanceId },
    data: {
      clockOut: new Date(),
    },
  });

  return NextResponse.json(updated);
}
