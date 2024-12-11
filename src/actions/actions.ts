'use server';

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { loginFormSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcrypt';
import { checkAuth, getPetByPetId } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";


// ---- User Actions ----

export async function logIn(prevState: unknown, formData: unknown) {
    if (!(formData instanceof FormData)) {
        return {
            message: 'Invalid login data',
        }
    }
    const userData = Object.fromEntries(formData.entries());
    const validateData = loginFormSchema.safeParse(userData);
    if (!validateData.success) {
        return {
            message: 'Invalid login data',
        }
    }
    try {
        await signIn('credentials', validateData.data);
    } catch (err) {
        if (err instanceof AuthError) {
            switch (err.type) {
                case "CredentialsSignin": {
                    return {
                        message: "Invalid credentials",
                    }
                }
                default: {
                    return {
                        message: "Failed to log in",
                    }
                }
            }
        }
        throw err;
    }
}

export async function logout() {
    await signOut({
        redirectTo: '/',
    });
}

export async function signUp(prevState: unknown, formData: unknown) {
    if (!(formData instanceof FormData)) {
        return {
            message: "Invalid form data.",
        };
    }

    const formDataEntries = Object.fromEntries(formData.entries());

    const validatedFormData = loginFormSchema.safeParse(formDataEntries);
    if (!validatedFormData.success) {
        return {
            message: "Invalid form data.",
        };
    }

    const { email, password } = validatedFormData.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await prisma.user.create({
            data: {
                email,
                hashedPassword,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return {
                    message: "Email already exists.",
                };
            }
        }

        return {
            message: "Could not create user.",
        };
    }

    await signIn("credentials", formData);
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
            message: 'Failed to get user' + err,
        }
    }
}

// ---- Pet Actions ----

export async function addPet(pet: unknown) {
    const session = await checkAuth();

    const validatedPet = petFormSchema.safeParse(pet);
    if (!validatedPet.success) {
        return {
            message: "Invalid pet data.",
        };
    }

    try {
        await prisma.pet.create({
            data: {
                ...validatedPet.data,
                user: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
        });
    } catch (error) {
        console.log(error);
        return {
            message: "Could not add pet.",
        };
    }

    revalidatePath("/app", "layout");

}


export async function editPet(petId: unknown, newPetData: unknown) {
    const session = await checkAuth();

    const validateId = petIdSchema.safeParse(petId);
    const validateData = petFormSchema.safeParse(newPetData);
    if (!validateData.success || !validateId.success) {
        return {
            message: 'Invalid pet data',
        }
    }


    try {
        const pet = await getPetByPetId(validateId.data);
        if (!pet) {
            return {
                message: 'Pet not found',
            }
        }
        if (pet.userId !== session.user.id) {
            return {
                message: 'You are not authorized to edit this pet',
            }
        }
    } catch (e) {
        return {
            message: 'Failed to edit pet' + e,
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
            message: "Failed to edit pet" + err,
        }
    }

    revalidatePath('/app', 'layout')
}

export async function deletePet(petId: unknown) {
    const session = await checkAuth();

    const validateId = petIdSchema.safeParse(petId);
    if (!validateId.success) {
        return {
            message: 'Invalid pet id',
        }
    }

    try {
        const pet = await getPetByPetId(validateId.data);
        if (!pet) {
            return {
                message: 'Pet not found',
            }
        }
        if (pet.userId !== session.user.id) {
            return {
                message: 'You are not authorized to delete this pet',
            }
        }
    } catch (err) {
        return {
            message: 'Failed to delete pet' + err,
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
            message: "Failed to delete pet" + err,
        }
    }

    revalidatePath('/app', 'layout')
}


// Payment Actions
export async function createCheckoutSession() {

    const session = await checkAuth();

    const checkoutSession = await stripe.checkout.sessions.create({
        customer_email: session.user.email!,
        payment_method_types: ['card'],
        line_items: [
            {
                price: process.env.PRODUCT_ID,
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
        cancel_url: `${process.env.CANONICAL_URL}/payment?canceled=true`,
    });
    checkoutSession.url && redirect(checkoutSession.url);
}

