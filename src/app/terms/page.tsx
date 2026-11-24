import type { Metadata } from "next";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using the SmallDataRegime preview site.",
};

export default function TermsPage() {
  return (
    <Interior
      eyebrow="Terms"
      title="This site is a product preview."
      lede="The pages describe how a small-data post-training platform is meant to work. They are not an offer of compute, model weights, or a support contract."
    >
      <div className="max-w-2xl space-y-4 text-base leading-relaxed text-faint">
        <p>
          Commands shown in the docs are illustrative. Submitting the contact
          form in this preview does not create an account or retain the message.
        </p>
      </div>
    </Interior>
  );
}
