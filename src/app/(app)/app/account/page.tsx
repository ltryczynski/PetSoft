import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import React from "react";
import SignoutButton from "@/components/signout-button";
import { checkAuth } from "@/lib/server-utils";

export default async function Page() {
  const session = await checkAuth();
  return (
    <main>
      <div className="flex justify-between items-center text-white py-8">
        <H1 className="mb-7">Account</H1>
      </div>
      <ContentBlock className="min-h-[600px] flex justify-center flex-col gap-3 items-center">
        Logged in as {session.user.email}
        <SignoutButton />
      </ContentBlock>
    </main>
  );
}
