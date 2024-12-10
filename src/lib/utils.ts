import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import prisma from "./db";
import { Pet } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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



