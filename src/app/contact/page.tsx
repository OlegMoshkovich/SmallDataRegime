import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a small-data post-training run.",
};

export default function ContactPage() {
  return (
    <Interior
      eyebrow="Contact"
      title="Tell us the behavior that is still wrong."
      lede="Bring the task, the size of the labeled set you can actually produce, and the eval that has to pass. We will say whether it belongs in the small-data regime."
    >
      <ContactForm />
    </Interior>
  );
}
