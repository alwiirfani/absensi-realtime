"use client";
import Link from "next/link";
import { redirect } from "next/navigation";

// ── Dummy data (ganti dengan fetch dari API/database nanti)
type User = {
  id: string | number;
  name: string;
  email: string;
};

const mockUsers: User[] = [
  { id: 1, name: "Budi Santoso", email: "budi.s@gmail.com" },
  { id: 2, name: "Ani Wijaya", email: "ani.wijaya@ymail.co.id" },
  { id: 3, name: "Citra Lestari", email: "citra.lestari@gmail.com" },
  { id: 4, name: "Doni Pratama", email: "donipratama@outlook.com" },
];

export default function UsersPage() {
  // const users = await getUsersFromDatabase(); // nanti ganti dengan fetch/db

  const users = mockUsers; // sementara pakai mock

  // Server Action untuk hapus user
  //   async function deleteUser(formData: FormData) {
  //     "use server";

  //     const id = formData.get("userId") as string;

  //     // TODO: panggil API / database delete
  //     console.log("Menghapus user dengan id:", id);

  //     // Contoh redirect setelah hapus (opsional)
  //     redirect("/users");
  //   }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manajemen User</h1>
        <Link
          href="/users/new"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Tambah User Baru
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-gray-500">
                  Belum ada data user
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/users/${user.id}/edit`}
                        className="rounded bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-200">
                        Edit
                      </Link>

                      <form>
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200"
                          onClick={(e) => {
                            if (!confirm("Yakin ingin menghapus user ini?")) {
                              e.preventDefault();
                            }
                          }}>
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Total user: {users.length}
      </p>
    </main>
  );
}
