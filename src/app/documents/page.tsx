import type { Metadata } from "next";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Documents",
  description: "Questions over the documents the company already keeps.",
};

export default function DocumentsPage() {
  return (
    <Interior
      eyebrow="Documents"
      title="Documents"
      lede="A question cites the passages that already exist. The files stay where they live, and the answer does not file a new record."
      space=""
    >
      {null}
    </Interior>
  );
}
