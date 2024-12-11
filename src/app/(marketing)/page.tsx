import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#5ccaa7] min-h-screen flex justify-center items-center">
      <section className="flex flex-col xl:flex-row items-center justify-center gap-10 max-w-[1050px]">
        <Image
          src="https://static.ltmedia.pl/assets/img/petsoft-preview.png"
          width={519}
          height={472}
          alt="PetSoft software image"
        />
        <div className="flex flex-col gap-y-6 h-full">
          <Logo />
          <h1 className="text-5xl font-semibold tracking-tighter">
            Manage your <span className="font-extrabold">pet daycare</span> with ease
          </h1>
          <p className="text-2xl xl:text-2xl font-medium">
            Use PetSoft to easly keep track of pets under your care. Get lifetime access for $299
          </p>
          <div className="mt-6 space-x-3">
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
