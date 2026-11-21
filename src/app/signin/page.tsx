import type { Metadata } from "next";
import { Interior } from "@/components/interior";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to SmallDataRegime.ai.",
};

export default function SignInPage() {
  return (
    <Interior
      eyebrow="Sign in"
      title="Open an existing lab."
      lede="Use the email on the lab. New to SmallDataRegime.ai? Request a run and we will open a workspace around your first reward spec."
    >
      <SignInForm />
    </Interior>
  );
}
