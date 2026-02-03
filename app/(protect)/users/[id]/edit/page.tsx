"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string; // Assuming Role is a string enum
  position: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateUserInput {
  name?: string;
  position?: string;
  role?: string;
  password?: string;
}

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [user, setUser] = useState<SafeUser | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Assuming possible roles from your Prisma enum, adjust as needed
  const roles = ["ADMIN", "USER", "MANAGER"]; // Ganti dengan enum Role yang sebenarnya

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
          setName(data.data.name);
          setPosition(data.data.position);
          setRole(data.data.role);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Gagal memuat data user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const updateData: UpdateUserInput = {};
    if (name !== user?.name) updateData.name = name;
    if (position !== user?.position) updateData.position = position;
    if (role !== user?.role) updateData.role = role;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      setError("Tidak ada perubahan yang dilakukan");
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("User berhasil diupdate");
        setTimeout(() => router.push("/users"), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Gagal mengupdate user");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">Memuat...</div>
    );
  if (error && !user)
    return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Edit User</h1>
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700">
            Nama
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700">
            Email (Tidak Dapat Diubah)
          </label>
          <input
            type="email"
            id="email"
            value={user?.email || ""}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700">
            Posisi
          </label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700">
            Password Baru (Opsional)
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
