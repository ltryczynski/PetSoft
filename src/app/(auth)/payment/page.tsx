import H1 from "@/components/h1";
import PaymentButton from "@/components/payment-button";
import PaymentNotification from "@/components/payment-notification";
import PaymentUpdateJWT from "@/components/payment-update-jwt";
import React from "react";

type TSearchParams = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function PaymentPage({ searchParams }: TSearchParams) {
  const success = searchParams.success === "true";
  return (
    <main className="flex flex-col gap-y-10 items-center">
      <H1 className="">PetSoft access requires payment</H1>
      {!success ? (
        <PaymentButton>Buy lifetime access for $299</PaymentButton>
      ) : (
        <PaymentUpdateJWT />
      )}
      <PaymentNotification
        successMessage="Payment successful!"
        canceledMessage="Payment canceled."
      />
    </main>
  );
}
