import { z } from "zod";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, { message: "Name should be atleast 3 characters" })
        .max(20, { message: "Name should not exceed 20 characters" }),
    ownerName: z
        .string()
        .trim()
        .min(3, { message: "Owner name should be atleast 20 characters" })
        .max(20, { message: "Owner name should not exceed 20 characters" }),
    imageUrl: z.union([z.literal(""), z.string().trim().url()]),
    age: z.coerce
        .number()
        .int()
        .positive({ message: "Age should be a positive number" })
        .max(30, { message: "Age should not exceed 30" }),
    notes: z.union([
        z.literal(""),
        z.string().trim().max(1000, { message: "Notes should not exceed 1000 characters" }),
    ]),
});
export type TPetForm = z.infer<typeof petFormSchema>;


export const loginFormSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password should be atleast 6 characters"),
})
export type TLoginForm = z.infer<typeof loginFormSchema>;