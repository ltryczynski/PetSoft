"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LoginInputProps } from "@/lib/types";
import { loginFormSchema, TLoginForm } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { logIn, signUp } from "@/actions/actions";
import AuthFormButton from "./auth-form-button";
import { useFormState } from "react-dom";

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

  const [signUpError, dispatchSignUp] = useFormState(signUp, undefined);
  const [logInError, dispatchLogIn] = useFormState(logIn, undefined);

  return (
    <form
      className="flex flex-col gap-5"
      action={type === "logIn" ? dispatchLogIn : dispatchSignUp}>
      <AuthInput type="email" label="Email" id="email" register={register} error={errors.email} />
      <AuthInput
        type="password"
        label="Password"
        id="password"
        register={register}
        error={errors.password}
      />
      {/* <Button className="w-max">{type === "logIn" ? "Login" : "Sign up"}</Button> */}
      <AuthFormButton type={type} />
      {signUpError && <p className="h-6 text-red-500 text-sm">{signUpError.message}</p>}
      {logInError && <p className="h-6 text-red-500 text-sm">{logInError.message}</p>}
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
