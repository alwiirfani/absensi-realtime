// app/users/[id]/edit/EditUserForm.tsx
"use client";

import { useActionState } from "react";

import Link from "next/link";
import { updateUserAction, UpdateUserState } from "./UserAction";

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  position: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function EditUserForm({ user }: { user: SafeUser }) {
  const [state, formAction, isPending] = useActionState<
    UpdateUserState,
    FormData
  >(
    updateUserAction,
    {}, // initial state
  );

  return (
    <form
      action={formAction}
      className="space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900/80">
      <input type="hidden" name="id" value={user.id} />

      {/* Tampilkan error umum */}
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
              state.fieldErrors?.name
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        {/* sisanya sama seperti kode kamu, hanya copy-paste field lain */}
        {/* ... position, email, role, password, buttons ... */}
      </div>

      {/* tombol submit */}
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
