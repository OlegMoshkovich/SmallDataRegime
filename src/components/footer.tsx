import Link from "next/link";
import { ArrowRight, Button } from "@/components/button";

const columns = [
  {
    title: "Resources",
    links: [
      { href: "/research", label: "Research" },
      { href: "/docs", label: "Docs" },
      { href: "/contact", label: "Contact" },
      { href: "/product#review", label: "Pair review" },
      { href: "/platform#security", label: "Security" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About" },
      { href: "/platform", label: "Platform" },
      { href: "/company#careers", label: "Careers" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 lg:grid-cols-12 lg:px-9">
        <div className="lg:col-span-5">
          <p className="max-w-sm text-[1.625rem] leading-none tracking-[-0.03em] lg:text-[2rem]">
            Ready to train on the data you have?
          </p>
          <div className="mt-6">
            <Button href="/contact">
              Start a run <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-line px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between lg:px-9">
        <p>© SmallDataRegime.ai 2026. RL post-training for the small-data regime.</p>
        <p className="font-mono tracking-[-0.01em] uppercase">Sample efficient</p>
      </div>
    </footer>
  );
}
