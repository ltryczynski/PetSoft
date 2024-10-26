import { Pet, User } from "@prisma/client";
import { FieldError, UseFormRegister } from "react-hook-form";
import { TLoginForm } from "./validations";


export type PetEssentials = Omit<Pet, "id" | "createdAt" | "updatedAt">;
export type UserEssentials = Omit<User, "createdAt" | "updatedAt">;


export type PetInputProps = {
    label: string;
    id: keyof PetEssentials;
    type?: "input" | "textarea";
    register: UseFormRegister<PetEssentials>;
    error: FieldError | undefined;
};


export type LoginInputProps = {
    label: string;
    id: keyof TLoginForm;
    register: UseFormRegister<TLoginForm>
    error: FieldError | undefined;
    type: "email" | "password";
};

export type TuserServerSession = Pick<User, 'email' | 'id'> & { status: 'success' } | {
    status: 'error';
    message: string;
}