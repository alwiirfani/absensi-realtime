// app/users/[id]/edit/page.tsx
import { Role } from "@prisma/client";
import Link from "next/link";
import EditUserForm from "./components/EditUserForm";

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  position: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function getUser(id: string): Promise<SafeUser | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/users/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const json: ApiResponse<SafeUser> = await res.json();
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="rounded-2xl bg-white p-10 text-center shadow-xl dark:bg-gray-900">
          <h1 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
            Pengguna tidak ditemukan
          </h1>
          <Link
            href="/users"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Edit Pengguna
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Mengubah data {user.name} ({user.email})
          </p>
        </div>

        <EditUserForm user={user} />
      </div>
    </div>
  );
}
