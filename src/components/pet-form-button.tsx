import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type PetFormButtonProps = {
  actionType: "add" | "edit";
};

export default function PetFormButton({ actionType }: PetFormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-5">
      {actionType === "add" ? "Add new pet" : "Edit pet"}
    </Button>
  );
}
