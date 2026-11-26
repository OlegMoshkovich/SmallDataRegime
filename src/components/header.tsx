"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Wordmark } from "@/components/logo";
import { nav } from "@/lib/site";

type Item = (typeof nav)[number];

function itemsOf(item: Item) {
  return "items" in item ? item.items : null;
}

function quiet(item: { quiet?: boolean }) {
  return Boolean(item.quiet);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const platform = useRef<HTMLLIElement>(null);

  function current(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function selected(item: Item) {
    const items = itemsOf(item);
    if (items) return items.some((child) => current(child.href));
    return current(item.href);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setMenu(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function outside(event: MouseEvent) {
      if (!platform.current?.contains(event.target as Node)) setMenu(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenu(false);
    }
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const linkClass =
    "relative text-[0.75rem] leading-none after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-current after:transition-all after:duration-300 hover:after:w-full";

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
            {nav.map((item) => {
              const items = itemsOf(item);
              const on = selected(item);
              if (!items) {
                return (
                  <li
                    key={item.href}
                    className="opacity-100 transition-opacity duration-200 group-hover/menu:opacity-50 hover:opacity-100"
                  >
                    <Link
                      href={item.href}
                      aria-current={on ? "page" : undefined}
                      className={`${linkClass} ${on ? "after:w-full" : "after:w-0"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li
                  key={item.label}
                  ref={platform}
                  className="relative opacity-100 transition-opacity duration-200 group-hover/menu:opacity-50 hover:opacity-100"
                  onMouseEnter={() => setMenu(true)}
                  onMouseLeave={() => setMenu(false)}
                >
                  <button
                    type="button"
                    aria-expanded={menu}
                    aria-haspopup="true"
                    aria-current={on ? "page" : undefined}
                    onClick={() => setMenu((value) => !value)}
                    className={`${linkClass} ${on ? "after:w-full" : "after:w-0"}`}
                  >
                    {item.label}
                  </button>
                  <div className={`absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3 ${menu ? "" : "hidden"}`}>
                    <ul className="min-w-36 border border-line bg-surface py-1">
                      {items.map((child) => {
                        const childOn = current(child.href);
                        if (quiet(child)) {
                          return (
                            <li key={child.href}>
                              <span className="block cursor-default px-3 py-2 text-[0.75rem] leading-none text-muted" aria-disabled="true">
                                {child.label}
                              </span>
                            </li>
                          );
                        }
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={childOn ? "page" : undefined}
                              className={`block px-3 py-2 text-[0.75rem] leading-none ${
                                childOn ? "text-foreground" : "text-faint hover:text-foreground"
                              }`}
                              onClick={() => setMenu(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
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
              {nav.map((item) => {
                const items = itemsOf(item);
                if (!items) {
                  const on = current(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={on ? "page" : undefined}
                        className={`block py-3 text-lg ${on ? "text-foreground underline underline-offset-4" : "text-faint"}`}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <p className="pt-3 pb-1 text-lg text-foreground">{item.label}</p>
                    <ul>
                      {items.map((child) => {
                        const childOn = current(child.href);
                        if (quiet(child)) {
                          return (
                            <li key={child.href}>
                              <span className="block cursor-default py-2 pl-4 text-lg text-muted" aria-disabled="true">
                                {child.label}
                              </span>
                            </li>
                          );
                        }
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={childOn ? "page" : undefined}
                              className={`block py-2 pl-4 text-lg ${childOn ? "text-foreground underline underline-offset-4" : "text-faint"}`}
                              onClick={() => setOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
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
