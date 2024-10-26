import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <H1 className="mb-5 text-center">Sign Up</H1>

      <AuthForm type="register" />

      <p className="mt-6 text-sm text-zinc-500">
        No account yet?{" "}
        <Link href="/login" className="font-medium">
          Sign in
        </Link>
      </p>
    </main>
  );
}
