"use server";

import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

type UpdateUserState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};

export async function updateUserAction(
  prevState: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const roleRaw = formData.get("role") as string;
  const password = formData.get("password") as string;

  const fieldErrors: Record<string, string> = {};

  if (!id) fieldErrors.id = "ID tidak valid";
  if (!name?.trim()) fieldErrors.name = "Nama wajib diisi";
  if (!position?.trim()) fieldErrors.position = "Posisi wajib diisi";
  if (!roleRaw) fieldErrors.role = "Role wajib dipilih";

  const role = roleRaw as Role;
  if (roleRaw && !Object.values(Role).includes(role)) {
    fieldErrors.role = "Role tidak valid";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Validasi gagal", fieldErrors };
  }

  const payload: Record<string, unknown> = {
    name: name.trim(),
    position: position.trim(),
    role,
  };

  if (password?.trim()) {
    payload.password = password.trim();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.message || "Gagal memperbarui data" };
    }

    // Sukses → redirect
    redirect("/users?status=updated");
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Terjadi kesalahan server",
    };
  }
}
