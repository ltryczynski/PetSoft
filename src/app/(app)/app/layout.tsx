import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import { Toaster } from "@/components/ui/sonner";
import { PetContextProvider } from "@/context/pet-context-provider";
import { SearchContextProvider } from "@/context/search-context-provider";
import { checkAuth, getPetsByUserId } from "@/lib/server-utils";
export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await checkAuth();
  const pets = (await getPetsByUserId(session.user.id)) || [];
  return (
    <>
      <BackgroundPattern />
      <div className="max-w-[1050px] mx-auto flex flex-col min-h-screen px-4">
        <AppHeader />
        <SearchContextProvider>
          <PetContextProvider petList={pets}>{children}</PetContextProvider>
        </SearchContextProvider>
        <AppFooter />
      </div>
      <Toaster position="top-right" />
    </>
  );
}
