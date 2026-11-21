import Link from "next/link";
import { ArrowRight, Button } from "@/components/button";

const columns = [
  {
    title: "Resources",
    links: [
      { href: "/research", label: "Research" },
      { href: "/docs", label: "Docs" },
      { href: "/contact", label: "Contact" },
      { href: "/product#security", label: "Security" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About" },
      { href: "/product", label: "Product" },
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
          <Button href="/contact">
            Contact us <ArrowRight />
          </Button>
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
        <p>
          <span className="sm:hidden">© MIResearch Lab 2026</span>
          <span className="hidden sm:inline">
            © MIResearch Lab 2026. RL post-training for the small-data regime.
          </span>
        </p>
        <p className="hidden font-mono tracking-[-0.01em] uppercase sm:block">Sample efficient</p>
      </div>
    </footer>
  );
}
