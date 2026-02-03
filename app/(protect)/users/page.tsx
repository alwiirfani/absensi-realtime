"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Trash2, Pencil } from "lucide-react";

// ── Type definition
type User = {
  id: number | string;
  name: string;
  email: string;
};

const mockUsers: User[] = [
  { id: 1, name: "Budi Santoso", email: "budi.s@gmail.com" },
  { id: 2, name: "Ani Wijaya", email: "ani.wijaya@ymail.co.id" },
  { id: 3, name: "Citra Lestari", email: "citra.lestari@gmail.com" },
  { id: 4, name: "Doni Pratama", email: "donipratama@outlook.com" },
];

// ── Komponen tombol hapus (client-side confirm + pending state)
function DeleteButton({ userId }: { userId: number | string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!confirm("Yakin ingin menghapus user ini?")) {
      return;
    }

    startTransition(() => {
      // Di sini nanti panggil server action
      // contoh: deleteUserAction(new FormData().set("userId", String(userId)))
      console.log("Menghapus user ID:", userId);
      // redirect("/users") bisa dilakukan di server action
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={`
        inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium
        transition-colors
        ${
          isPending
            ? "bg-red-100 text-red-400 cursor-not-allowed"
            : "bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200"
        }
      `}>
      <Trash2 size={16} />
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}

export default function UsersPage() {
  const users = mockUsers; // nanti ganti dengan data dari server / api

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Manajemen Pengguna
            </h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Kelola semua akun pengguna di sistem
            </p>
          </div>

          <Link
            href="/users/new"
            className={`
              inline-flex items-center justify-center gap-2 rounded-lg 
              bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white 
              shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              active:bg-indigo-800
            `}>
            <span>Tambah Pengguna</span>
          </Link>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-16 text-center text-sm text-gray-500 dark:text-gray-400">
                      Belum ada data pengguna
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/users/${user.id}/edit`}
                            className={`
                              inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium
                              text-amber-700 transition-colors
                              hover:bg-amber-50 hover:text-amber-800
                              dark:text-amber-400 dark:hover:bg-amber-950/30 dark:hover:text-amber-300
                            `}>
                            <Pencil size={16} />
                            Edit
                          </Link>

                          <DeleteButton userId={user.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer info */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
            Total pengguna: <span className="font-medium">{users.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
