"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type PaymentNotificationProps = {
  successMessage: string;
  canceledMessage: string;
};

export default function PaymentNotification({
  successMessage,
  canceledMessage,
}: PaymentNotificationProps) {
  const [paymentStatus, setPaymentStatus] = useState({
    success: false,
    canceled: false,
  });

  const searchParams = useSearchParams();
  useEffect(() => {
    setPaymentStatus({
      success: searchParams.get("success") === "true",
      canceled: searchParams.get("canceled") === "true",
    });

    if (paymentStatus.success) {
      toast.success(successMessage);
    }
    if (paymentStatus.canceled) {
      toast.success(canceledMessage);
    }
  }, [
    paymentStatus.success,
    paymentStatus.canceled,
    canceledMessage,
    successMessage,
    searchParams,
  ]);

  return null;
}
