'use server';

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { loginFormSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcrypt';
import { UserEssentials } from "@/lib/types";
import { redirect } from "next/navigation";


// ---- User Actions ----

export async function logIn(formData: FormData) {
    const userData = Object.fromEntries(formData.entries());
    const validateData = loginFormSchema.safeParse(userData);
    if (!validateData.success) {
        return {
            message: 'Invalid login data',
        }
    }
    console.log(validateData.data);
    try {
        await signIn('credentials', validateData.data);
    } catch (err) {
        return {
            message: 'Failed to login',
        }
    }
}

export async function logout() {
    console.log('logging out');
    await signOut({
        redirectTo: '/',
    });
}

export async function signUp(formData: FormData) {
    const userData = Object.fromEntries(formData.entries());
    const validateData = loginFormSchema.safeParse(userData);
    console.log(validateData);
    if (!validateData.success) {
        return {
            message: 'Invalid data' + validateData.error,
        }
    }
    await createUser({
        email: validateData.data.email,
        hashedPassword: await bcrypt.hash(validateData.data.password, 10),
        id: validateData.data.email.replace('@', '-_').replace('.', '_-'),
    });
    await signIn('credentials', validateData.data);
}

async function createUser(data: UserEssentials) {

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (user) {
            return {
                message: 'User already exists',
            }
        }
        const newUser = await prisma.user.create({
            data
        })
        return {
            user: newUser
        };
    } catch (err) {
        return {
            message: 'Failed to create user',
        }
    }
}
type TgetUser = {
    email: string;
}

export async function getUser({ email }: TgetUser) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        return {
            user: user
        }
    } catch (err) {
        return {
            message: 'Failed to get user',
        }
    }
}

// ---- Pet Actions ----

export async function addPet(petData: unknown) {
    const validateData = petFormSchema.safeParse(petData);
    if (!validateData.success) {
        return {
            message: 'Invalid pet data',
        }
    }

    try {
        await prisma.pet.create({
            data: validateData.data,
        });
    } catch (err) {
        return {
            message: "Failed to add pet",
        }
    }
    revalidatePath('/app', 'layout')
}


export async function editPet(petId: unknown, newPetData: unknown) {
    const validateId = petIdSchema.safeParse(petId);
    const validateData = petFormSchema.safeParse(newPetData);
    if (!validateData.success || !validateId.success) {
        return {
            message: 'Invalid pet data',
        }
    }

    try {
        await prisma.pet.update({
            where: {
                id: validateId.data
            },
            data: validateData.data,
        });
    } catch (err) {
        return {
            message: "Failed to edit pet",
        }
    }

    revalidatePath('/app', 'layout')
}

export async function deletePet(petId: unknown) {

    const validateId = petIdSchema.safeParse(petId);
    if (!validateId.success) {
        return {
            message: 'Invalid pet id',
        }
    }

    try {
        await prisma.pet.delete({
            where: {
                id: validateId.data,
            },
        });
    } catch (err) {
        return {
            message: "Failed to delete pet",
        }
    }

    revalidatePath('/app', 'layout')
}