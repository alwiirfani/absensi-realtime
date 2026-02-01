"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          role: "EMPLOYEE", // default role
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text:
            data.message ||
            Object.values(data.errors || {})
              .flat()
              .join(", "),
        });
        setLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: "Registrasi berhasil! Mengarahkan ke login...",
      });

      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.log(err);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan, coba lagi.",
      });
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-muted-foreground text-sm">
            Create your new account below
          </p>
        </div>

        {message.type && (
          <Alert
            variant={message.type === "success" ? "default" : "destructive"}>
            <AlertTitle>
              {message.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            id="name"
            placeholder="your full name"
            value={form.name}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <FieldLabel>Position</FieldLabel>
          <Input
            id="position"
            placeholder="Staff / Manager"
            value={form.position}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="******"
            value={form.password}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <FieldLabel>Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="******"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </Button>
        </Field>

        <FieldSeparator />

        <Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Sign In
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
