import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "SmallDataRegime.ai is the platform where a small set of your preferences becomes a reasoning system, model agnostic, with ownership and privacy.",
};

export default function ContactPage() {
  return (
    <Interior
      eyebrow="Contact"
      title="Ready to create a reasoning system based on your data."
      lede="SmallDataRegime.ai is the platform where a small set of your preferences becomes a reasoning system, model agnostic, with ownership and privacy."
    >
      <ContactForm />
    </Interior>
  );
}
