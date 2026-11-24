import type { Metadata } from "next";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to SmallDataRegime.",
};

export default function SignInPage() {
  return (
    <article className="flex h-[calc(100dvh-72px)] items-center">
      <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-9">
        <SignInForm />
      </div>
    </article>
  );
}
