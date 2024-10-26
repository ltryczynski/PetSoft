"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LoginInputProps } from "@/lib/types";
import { loginFormSchema, TLoginForm } from "@/lib/validations";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { logIn, signUp } from "@/actions/actions";

type AuthFormProps = {
  type: "logIn" | "signUp";
};

export default function AuthForm({ type }: AuthFormProps) {
  const {
    register,
    formState: { errors },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginFormSchema),
  });

  return (
    <form
      className="flex flex-col gap-5"
      action={async (formData) => {
        type === "logIn" ? await logIn(formData) : await signUp(formData);
      }}>
      <AuthInput type="email" label="Email" id="email" register={register} error={errors.email} />
      <AuthInput
        type="password"
        label="Password"
        id="password"
        register={register}
        error={errors.password}
      />
      <Button className="w-max">{type === "logIn" ? "Login" : "Sign up"}</Button>
    </form>
  );
}

export function AuthInput({ label, id, register, error, type }: LoginInputProps) {
  return (
    <div className="space-y-1 w-full">
      <Label htmlFor={id}>{label}</Label>
      <Input type={type} className="border-gray-950/40" {...register(id, {})} />
      {error && <div className="h-6 text-red-500 text-sm">{error.message}</div>}
    </div>
  );
}
