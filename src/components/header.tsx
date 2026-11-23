"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Wordmark } from "@/components/logo";
import { nav } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background text-foreground lg:bg-transparent">
      <div aria-hidden className="absolute inset-x-0 bottom-full h-screen bg-background lg:hidden" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-6 hidden h-28 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,black_0%,black_40%,transparent_100%)] lg:block"
      />
      <div className="relative z-50 mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 lg:px-6">
        <Link href="/" aria-label="MIResearchLab home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
          aria-label="Main"
        >
          <ul className="group/menu flex items-center gap-8">
            {nav.map((item) => (
              <li
                key={item.href}
                className="opacity-100 transition-opacity duration-200 group-hover/menu:opacity-50 hover:opacity-100"
              >
                <Link
                  href={item.href}
                  className="relative text-[0.75rem] leading-none after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/signin"
              className="font-mono text-[0.75rem] tracking-[-0.015rem] capitalize"
            >
              Sign in
            </Link>
            <Button href="/contact">Contact</Button>
          </div>
          <button
            type="button"
            className="relative -m-1 p-1 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="block h-px w-6 bg-foreground" />
            <span className="mt-1.5 block h-px w-6 bg-foreground" />
            <span className="mt-1.5 block h-px w-6 bg-foreground" />
          </button>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 bg-background lg:hidden">
          <div className="flex h-full flex-col px-4 pt-24 pb-6">
            <ul className="flex flex-1 flex-col gap-1 overflow-auto">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-3 text-lg text-faint"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <Button href="/signin" variant="ghost" className="w-full">
                Sign in
              </Button>
              <Button href="/contact" className="w-full">
                Contact
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
