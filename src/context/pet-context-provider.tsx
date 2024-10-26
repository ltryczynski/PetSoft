"use client";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import {
  createContext,
  startTransition,
  useCallback,
  useMemo,
  useOptimistic,
  useState,
} from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  children: React.ReactNode;
  petList: Pet[];
};

type PetContextProps = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPet: (petId: Pet["id"]) => void;
  selectedPet: Pet | null;
  numberOfPets: number;
  handleCheckoutPet: (petId: Pet["id"]) => Promise<void>;
  handleAddPet: (petParams: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet["id"], newPetData: PetEssentials) => Promise<void>;
};

export const PetContext = createContext<PetContextProps | null>(null);

export function PetContextProvider({ petList: pets, children }: PetContextProviderProps) {
  const [selectedPetId, setSelectedPetId] = useState<null | string>(null);

  const [optimisticPets, setOptimisticPets] = useOptimistic(pets, (state, { action, payload }) => {
    switch (action) {
      case "add": {
        return [...state, { ...payload, id: Math.random().toString() }];
      }
      case "edit": {
        return state.map((pet) => {
          if (pet.id === payload.id) {
            return { ...pet, ...payload.newPetData };
          }
          return pet;
        });
      }
      case "delete": {
        return state.filter((pet) => pet.id !== payload);
      }
      default: {
        return state;
      }
    }
  });

  const selectedPet = useMemo(
    () => optimisticPets.find((pet) => pet.id === selectedPetId) || null,
    [optimisticPets, selectedPetId]
  );

  const numberOfPets = pets.length;

  const handleCheckoutPet = useCallback(
    async (id: string) => {
      startTransition(() => {
        setOptimisticPets({ action: "delete", payload: id });
      });

      const error = await deletePet(id);
      if (error) {
        toast.warning(error.message);
        return;
      }
      setSelectedPetId(null);
    },
    [setOptimisticPets]
  );

  const handleChangeSelectedPet = useCallback((petId: string) => {
    setSelectedPetId(petId);
  }, []);

  const handleAddPet = useCallback(
    async (newPet: PetEssentials) => {
      setOptimisticPets({ action: "add", payload: newPet });
      const err = await addPet(newPet);
      if (err) {
        toast.warning(err.message);
        return;
      }
    },
    [setOptimisticPets]
  );

  const handleEditPet = useCallback(
    async (id: string, newPetData: PetEssentials) => {
      setOptimisticPets({ action: "edit", payload: { id, newPetData } });
      const err = await editPet(id, newPetData);
      if (err) {
        toast.warning(err.message);
        return;
      }
    },
    [setOptimisticPets]
  );

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        numberOfPets,
        selectedPetId,
        handleChangeSelectedPet,
        selectedPet,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}>
      {children}
    </PetContext.Provider>
  );
}
