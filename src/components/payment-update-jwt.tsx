"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function PaymentUpdateJWT() {
  const router = useRouter();

  const { data: session, update, status } = useSession();

  const handleClick = async () => {
    await update(true);
    router.push("/app/dashboard/");
  };

  return (
    <Button onClick={handleClick} disabled={status === "loading" || session?.user.hasAccess}>
      Access PetSoft
    </Button>
  );
}
