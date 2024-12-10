import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type AuthFormButtonProps = {
  type: "logIn" | "signUp";
};

export default function AuthFormButton({ type }: AuthFormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-max " disabled={pending}>
      {type === "logIn" ? "Login" : "Sign up"}
    </Button>
  );
}
