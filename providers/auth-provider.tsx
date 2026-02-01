"use client";

import { UserAuth } from "@/types/auth";
import axios from "axios";
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

type AuthContextType = {
  user: UserAuth | null;
  isLoading: boolean;
  refetchUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔥 Fetch user
const fetchUserMe = async (): Promise<UserAuth | null> => {
  const res = await axios.get("/api/v1/auth/me", {
    withCredentials: true, // penting kalau pakai cookie auth
  });

  return res.data?.user ?? null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user = null,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchUserMe,

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,

    retry: false, // auth tidak perlu retry
    refetchOnWindowFocus: false,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        refetchUser: refetch,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook aman
export const useUser = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useUser harus digunakan dalam AuthProvider");
  }

  return ctx;
};
