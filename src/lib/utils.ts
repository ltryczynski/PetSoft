import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import prisma from "./db";
import { Pet } from "@prisma/client";
import { auth } from "./auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}


export async function getUserServerSession(): Promise<TuserServerSession> {
  const session = await auth();
  console.log(session);
  if (!session) {
    return {
      status: 'error',
      message: 'No session found',
    }
  }
  if (!session.user) {
    return {
      status: 'error',
      message: 'No user found',
    }
  }

  return {
    status: 'success',
    session
  };
}

// Fetch
type getPetListProps = {
  userId: string;
}

export async function getPetList({ userId }: getPetListProps): Promise<Pet[]> {
  if (!userId) {
    throw new Error("User userId not found");
  }
  const petList = await prisma.pet.findMany({
    where: {
      id: userId
    },
  });
  return petList;
}



