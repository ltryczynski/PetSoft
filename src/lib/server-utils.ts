import 'server-only';

import { redirect } from "next/navigation";
import { auth } from "./auth";
import { Pet, User } from '@prisma/client';
import prisma from './db';


export async function checkAuth() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    return session;
}


export async function getPetByPetId(petId: Pet['id']) {
    try {
        return await prisma.pet.findUnique({
            where: {
                id: petId
            }
        })
    } catch (e) {
        return null;
    }
}

export async function getPetsByUserId(userId: User['id']) {
    try {
        return await prisma.pet.findMany({
            where: {
                userId
            }
        })
    } catch (e) {
        return null;
    }
}

export async function getUserByEmail(email: User['email']) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        return user;

    } catch (e) {
        return null;
    }
}