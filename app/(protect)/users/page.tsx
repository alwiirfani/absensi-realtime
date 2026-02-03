"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/v1/users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error("GET /api/users error:", err);
        setError("Gagal memuat data users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

    try {
      const res = await fetch(`/api/v1/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((user) => user.id !== id));
        alert("User berhasil dihapus");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("DELETE /api/users/[id] error:", err);
      alert("Gagal menghapus user");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">Memuat...</div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manajemen User (Admin)</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                ID
              </th> */}
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Posisi
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Dibuat Pada
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                {/* <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td> */}
                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.position}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    href={`/users/${user.id}/edit`}
                    className="text-blue-600 hover:underline mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:underline">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <p className="text-center mt-4 text-gray-500">
          Tidak ada user ditemukan.
        </p>
      )}
    </div>
  );
}
