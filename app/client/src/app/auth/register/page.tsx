"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { REGISTER } from "@/constants/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await fetch(REGISTER, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Register failed");
      }
      const result = await res.json();

      const expires = new Date();
      expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      document.cookie = `token=${result.token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;

      return result;
    },
    onSuccess: () => router.push("/dashboard"),
    onError: (err) => setError(err.message),
  });

  const onSubmit = (data: RegisterInput) => {
    setError("");
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...form.register("email")}
                autoComplete="email"
                type="email"
                placeholder="Email"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...form.register("password")}
                type="password"
                autoComplete="new-password"
                placeholder="Password"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending || !form.formState.isValid}
            >
              {mutation.isPending ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
