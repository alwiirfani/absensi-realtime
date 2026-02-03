"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateUserAction } from "./UserAction";

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  position: string;
  createdAt: Date;
  updatedAt: Date;
};

type UpdateUserState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};

export default function EditUserForm({ user }: { user: SafeUser }) {
  const [state, formAction, isPending] = useActionState<
    UpdateUserState,
    FormData
  >(updateUserAction, {});

  return (
    <form
      action={formAction}
      className="space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900/80">
      <input type="hidden" name="id" value={user.id} />

      {state.error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nama Lengkap
          </label>
          <input
            name="name"
            defaultValue={user.name}
            required
            className={`mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ${
              state.fieldErrors?.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Jabatan / Posisi
          </label>
          <input
            name="position"
            defaultValue={user.position}
            required
            className={`mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ${
              state.fieldErrors?.position ? "border-red-500" : "border-gray-300"
            }`}
          />
          {state.fieldErrors?.position && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.position}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <div className="mt-1.5 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
          {user.email} (tidak dapat diubah)
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Role / Hak Akses
        </label>
        <select
          name="role"
          defaultValue={user.role}
          required
          className={`mt-1.5 block w-full rounded-lg border px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ${
            state.fieldErrors?.role ? "border-red-500" : "border-gray-300"
          }`}>
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        {state.fieldErrors?.role && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {state.fieldErrors.role}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password Baru
        </label>
        <input
          type="password"
          name="password"
          placeholder="Kosongkan jika tidak ingin mengubah"
          autoComplete="new-password"
          className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          Minimal 6 karakter. Biarkan kosong jika tidak ingin mengganti.
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/users"
          className="rounded-xl border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          Batal
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className={`rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${
            isPending ? "opacity-70 cursor-not-allowed" : ""
          }`}>
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
