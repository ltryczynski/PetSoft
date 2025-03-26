"use client";
import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useMemo } from "react";

export default function PetList() {
  const { pets, handleChangeSelectedPet, selectedPetId } = usePetContext();
  const { debounceText } = useSearchContext();

  const filteredPets = useMemo(
    () => pets.filter((pet) => pet.name.toLowerCase().includes(debounceText.toLowerCase())),
    [pets, debounceText]
  );
  return (
    <ul className="bg-white border-b border-light">
      {filteredPets.map((item) => (
        <li key={item.id}>
          <button
            className={cn(
              `w-full flex justify-start h-[70px] items-center px-5 cursor-pointer text-base gap-3 hover:bg-[#eff1f2] transition`,
              {
                "bg-[#eff1f2]": selectedPetId === item.id,
              }
            )}
            onClick={() => handleChangeSelectedPet(selectedPetId === item.id ? "0" : item.id)}>
            <Image
              src={item.imageUrl}
              width={45}
              height={45}
              alt="Pet image"
              className="rounded-full object-cover aspect-square"
            />
            <p className="font-semibold">{item.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
