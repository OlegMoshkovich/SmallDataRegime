import type { Metadata } from "next";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Inference",
  description: "Model calls through one gateway, on the enterprise's machines.",
};

export default function InferencePage() {
  return (
    <Interior
      eyebrow="Inference"
      title="Inference"
      lede="A model call goes through one gateway. The model proxy is the only path to the models, and a client file stays on the enterprise's machines."
      space=""
    >
      {null}
    </Interior>
  );
}
