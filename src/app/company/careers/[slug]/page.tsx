import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Button } from "@/components/button";
import { Interior } from "@/components/interior";
import { roleBySlug, roles } from "@/lib/roles";

export function generateStaticParams() {
  return roles.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = roleBySlug(slug);
  if (!role) return { title: "Careers" };
  return {
    title: role.title,
    description: role.lede,
  };
}

export default async function RolePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = roleBySlug(slug);
  if (!role) notFound();

  return (
    <Interior eyebrow={role.tag} title={role.title} lede={role.lede}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[0.75rem] text-muted uppercase">{role.type}</p>
        <Button href="/contact">
          Apply <ArrowRight />
        </Button>
      </div>
      <div className="mt-12 grid max-w-3xl gap-12">
        <section>
          <h2 className="text-2xl tracking-[-0.04em]">The role</h2>
          <p className="mt-4 text-base leading-relaxed text-faint">{role.about}</p>
        </section>
        <section>
          <h2 className="text-2xl tracking-[-0.04em]">What you will do</h2>
          <ul className="mt-4 space-y-3 text-base leading-relaxed text-faint">
            {role.duties.map((duty) => (
              <li key={duty}>{duty}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl tracking-[-0.04em]">Qualifications</h2>
          <ul className="mt-4 space-y-3 text-base leading-relaxed text-faint">
            {role.qualifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
      <p className="mt-12">
        <Link href="/company#careers" className="text-sm hover:underline">
          All roles
        </Link>
      </p>
    </Interior>
  );
}
