"use client";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { usePetContext } from "@/lib/hooks";
import PetFormButton from "./pet-form-button";
import { FieldError, useForm, UseFormRegister } from "react-hook-form";
import { PetEssentials } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PET_PLACEHOLDER } from "@/lib/constants";
import { petFormSchema, TPetForm } from "@/lib/validations";

type PetInput = {
  label: string;
  id: keyof PetEssentials;
  type?: "input" | "textarea";
  register: UseFormRegister<PetEssentials>;
  error: FieldError | undefined;
};

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission?: () => void;
};

export default function PetForm({ actionType, onFormSubmission }: PetFormProps) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: actionType === "edit" ? selectedPet?.name : "",
      ownerName: actionType === "edit" ? selectedPet?.ownerName : "",
      imageUrl: actionType === "edit" ? selectedPet?.imageUrl : "",
      age: actionType === "edit" ? selectedPet?.age : undefined,
      notes: actionType === "edit" ? selectedPet?.notes : "",
    },
  });

  return (
    <form
      action={async () => {
        const result = await trigger();
        if (!result) return;

        const petData = getValues();
        petData.imageUrl = petData.imageUrl || DEFAULT_PET_PLACEHOLDER;

        onFormSubmission?.();
        if (actionType === "add") {
          await handleAddPet(petData);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
      className="flex flex-col items-end space-y-3">
      <PetInput label="Name" id="name" register={register} error={errors.name} />
      <PetInput label="Owner Name" id="ownerName" register={register} error={errors.ownerName} />
      <PetInput label="Image Url" id="imageUrl" register={register} error={errors.imageUrl} />
      <PetInput label="Age" register={register} error={errors.age} id="age" />
      <PetInput register={register} error={errors.notes} label="Notes" id="notes" type="textarea" />
      <PetFormButton actionType={actionType} />
    </form>
  );
}

function PetInput({ label, id, type = "input", register, error }: PetInput) {
  return (
    <div className="space-y-1 w-full">
      <Label htmlFor={id}>{label}</Label>
      {type === "input" ? <Input {...register(id, {})} /> : <Textarea {...register(id, {})} />}
      {error && <div className="h-6 text-red-500 text-sm">{error.message}</div>}
    </div>
  );
}
