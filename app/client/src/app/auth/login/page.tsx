"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Login failed");
      }

      const result = await res.json();
      localStorage.setItem("token", result.token); // optional: use cookie instead
      return result;
    },
    onSuccess: () => router.push("/dashboard"),
    onError: (err) => setError(err.message),
  });

  const onSubmit = (data: LoginInput) => {
    setError("");
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input {...form.register("email")} placeholder="Email" />
        <Input
          {...form.register("password")}
          type="password"
          placeholder="Password"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
