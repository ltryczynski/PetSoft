"use client";
import { createCheckoutSession } from "@/actions/actions";
import React, { useTransition } from "react";
import { Button } from "./ui/button";

type PaymentButtonProps = {
  children: React.ReactNode;
};

export default function PaymentButton({ children }: PaymentButtonProps) {
  const [inPending, startTransition] = useTransition();

  const handlePaymentClick = async () => {
    startTransition(async () => {
      await createCheckoutSession();
    });
  };
  return (
    <Button onClick={handlePaymentClick} disabled={inPending}>
      {children}
    </Button>
  );
}
