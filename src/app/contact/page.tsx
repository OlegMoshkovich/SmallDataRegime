import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Our platform turns a small set of your preferences into a reasoning system, model agnostic, with ownership and privacy.",
};

export default function ContactPage() {
  return (
    <article className="flex min-h-[calc(100dvh-72px)] items-center">
      <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-9">
        <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
          Contact
        </p>
        <div className="mt-5">
          <ContactForm />
        </div>
      </div>
    </article>
  );
}
