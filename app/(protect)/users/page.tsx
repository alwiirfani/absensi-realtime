// app/users/page.tsx
import { Pencil, Trash2, UserPlus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  position: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function getUsers(): Promise<SafeUser[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/users`, {
      cache: "no-store",
      next: { tags: ["users"] },
    });

    if (!res.ok) throw new Error("Gagal memuat data");

    const json: ApiResponse<SafeUser[]> = await res.json();
    return json.success && json.data ? json.data : [];
  } catch (err) {
    console.error("Fetch users error:", err);
    return [];
  }
}

// Server Action - Hapus user
async function deleteUserAction(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  if (!id) {
    return { error: "ID pengguna tidak valid" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return { error: "Gagal menghapus pengguna" };
  }

  redirect("/users?status=deleted");
}

export default async function UsersManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const users = await getUsers();

  return (
    <div className="min-h-screen bg-gray-50 pb-12 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Header + Toast */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Manajemen Pengguna
              </h1>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                Kelola akun pengguna sistem absensi
              </p>
            </div>

            <Link
              href="/users/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950">
              <UserPlus size={18} />
              Tambah Pengguna
            </Link>
          </div>

          {status === "deleted" && (
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950/40 dark:text-green-300">
              <AlertCircle size={18} />
              Pengguna berhasil dihapus
            </div>
          )}
        </div>

        <Suspense fallback={<UserTableSkeleton />}>
          <UserTable users={users} />
        </Suspense>
      </div>
    </div>
  );
}

// ── Komponen Table (Client Component)
("use client");

import { useTransition } from "react";

function UserTable({ users }: { users: SafeUser[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Anda yakin ingin menghapus pengguna ini secara permanen?"))
      return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", id);
      await deleteUserAction(formData);
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50/80 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nama
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Jabatan
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Role
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-20 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-medium">Belum ada data pengguna</p>
                  <p className="mt-2 text-sm">
                    Tambahkan pengguna baru untuk memulai
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="group transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.position}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
                          : "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/users/${user.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-900/40">
                        <Pencil size={16} />
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                          isPending
                            ? "bg-red-100 text-red-400 cursor-not-allowed dark:bg-red-950/20"
                            : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/40"
                        }`}>
                        <Trash2 size={16} />
                        {isPending ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-right text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
        Total pengguna:{" "}
        <span className="font-semibold text-gray-900 dark:text-gray-200">
          {users.length}
        </span>
      </div>
    </div>
  );
}

function UserTableSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="mt-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 rounded bg-gray-100 dark:bg-gray-800"></div>
        ))}
      </div>
    </div>
  );
}
