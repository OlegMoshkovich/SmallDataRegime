import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Our platform turns a small set of your preferences into a reasoning system, model agnostic, with ownership and privacy.",
};

export default function ContactPage() {
  return (
    <Interior
      eyebrow="Contact"
      lede="Our platform turns a small set of your preferences into a reasoning system, model agnostic, with ownership and privacy."
      space="mt-5"
    >
      <ContactForm />
    </Interior>
  );
}
