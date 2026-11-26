"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/button";
import { Wordmark } from "@/components/logo";
import { applyFontSize, FONT_DEFAULT, FONT_MAX, FONT_MIN, readFontSize } from "@/lib/font-size";
import { nav } from "@/lib/site";

type Item = (typeof nav)[number];

function itemsOf(item: Item) {
  return "items" in item ? item.items : null;
}

function quiet(item: object) {
  return "quiet" in item && Boolean(item.quiet);
}

function FontSlider({
  size,
  onSize,
}: {
  size: number;
  onSize: (px: number) => void;
}) {
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = field.current;
    if (!input || input.getClientRects().length === 0) return;
    input.focus();
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    onSize(size + (event.key === "ArrowRight" ? 1 : -1));
  }

  return (
    <div>
      <p className="font-mono text-[0.65rem] tracking-[-0.015rem] text-muted">use ← →</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[0.7rem] leading-none text-faint" aria-hidden>
          A
        </span>
        <input
          ref={field}
          type="range"
          min={FONT_MIN}
          max={FONT_MAX}
          step={1}
          value={size}
          aria-label="Font size. Use the left and right arrow keys."
          aria-valuemin={FONT_MIN}
          aria-valuemax={FONT_MAX}
          aria-valuenow={size}
          aria-valuetext={`${size} pixels`}
          aria-keyshortcuts="ArrowLeft ArrowRight"
          onKeyDown={onKeyDown}
          onChange={(event) => onSize(Number(event.target.value))}
          className="font-size-slider w-full"
        />
        <span className="text-[1.05rem] leading-none" aria-hidden>
          A
        </span>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [settings, setSettings] = useState(false);
  const [fontSize, setFontSize] = useState(FONT_DEFAULT);
  const platform = useRef<HTMLLIElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

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
    setFontSize(readFontSize());
  }, []);

  function changeFont(px: number) {
    setFontSize(applyFontSize(px));
  }

  useEffect(() => {
    setMenu(false);
    setSettings(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function outside(event: MouseEvent) {
      const target = event.target as Node;
      if (!platform.current?.contains(target)) setMenu(false);
      if (!open && !settingsRef.current?.contains(target)) setSettings(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenu(false);
        setSettings(false);
      }
    }
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

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
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                aria-expanded={settings}
                aria-haspopup="dialog"
                onClick={() => setSettings((value) => !value)}
                className="font-mono text-[0.75rem] tracking-[-0.015rem] capitalize"
              >
                Settings
              </button>
              {settings ? (
                <div
                  role="dialog"
                  aria-label="Settings"
                  className="absolute top-full right-0 z-50 mt-3 w-56 border border-line bg-surface p-3"
                >
                  <p className="font-mono text-[0.65rem] tracking-[-0.015rem] text-muted uppercase">
                    Font size
                  </p>
                  <div className="mt-3">
                    <FontSlider size={fontSize} onSize={changeFont} />
                  </div>
                </div>
              ) : null}
            </div>
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
              <button
                type="button"
                aria-expanded={settings}
                onClick={() => setSettings((value) => !value)}
                className="inline-flex h-[31px] w-full items-center justify-center border border-line-strong bg-background font-mono text-[0.8125rem] leading-none tracking-[-0.0175rem] capitalize"
              >
                Settings
              </button>
              {settings ? (
                <div className="border border-line bg-surface p-3">
                  <p className="font-mono text-[0.65rem] tracking-[-0.015rem] text-muted uppercase">
                    Font size
                  </p>
                  <div className="mt-3">
                    <FontSlider size={fontSize} onSize={changeFont} />
                  </div>
                </div>
              ) : null}
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
