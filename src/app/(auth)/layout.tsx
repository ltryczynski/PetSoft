import Logo from "@/components/logo";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center max-w-[260px] mx-auto gap-y-5">
      <Logo />
      {children}
    </div>
  );
}
