"use server";

import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export type UpdateUserState = {
  error?: string;
  fieldErrors?: Partial<
    Record<"name" | "position" | "role" | "password", string>
  >;
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

  const fieldErrors: UpdateUserState["fieldErrors"] = {};

  // Validasi sederhana
  if (!name?.trim()) fieldErrors.name = "Nama wajib diisi";
  if (!position?.trim()) fieldErrors.position = "Jabatan wajib diisi";
  if (!roleRaw) fieldErrors.role = "Role wajib dipilih";

  const role = roleRaw as Role;
  if (roleRaw && !Object.values(Role).includes(role)) {
    fieldErrors.role = "Role tidak valid";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Mohon periksa input Anda", fieldErrors };
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
    const res = await fetch(`${baseUrl}/api/v1/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { error: errData.message || "Gagal memperbarui data pengguna" };
    }

    // Sukses → redirect ke daftar user
    redirect("/users?status=updated");
  } catch (err) {
    console.error("Update user error:", err);
    return { error: "Terjadi kesalahan server. Coba lagi nanti." };
  }
}
