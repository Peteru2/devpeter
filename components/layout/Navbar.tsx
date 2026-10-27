"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { navItems, site } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "border-line" : "border-transparent"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 bg-bg/85 backdrop-blur-md transition-opacity duration-300 ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-2.5" aria-label={`${site.name}, home`}>
          <span className="font-serif text-2xl leading-none">{site.name}</span>
          <span className="font-mono text-xs text-muted">{site.handle}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  className={`inline-flex min-h-11 items-center text-sm transition-colors hover:text-ink ${
                    active === item.id ? "text-ink" : "text-muted"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {site.availableForWork && (
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
              <span className="size-[7px] rounded-full bg-live" />
              Available
            </span>
          )}
          {/* <ThemeToggle /> */}
          <a
            href="/#contact"
            className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm font-medium transition-colors hover:border-ink"
          >
            Let’s talk
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* <ThemeToggle /> */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line"
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-bg md:hidden"
          >
            <nav aria-label="Mobile" className="wrap py-6">
              <ul>
                {navItems.map((item) => (
                  <li key={item.id} className="border-b border-line">
                    <a href={`/#${item.id}`} onClick={() => setOpen(false)} className="block py-5 font-serif text-4xl">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              {site.availableForWork && (
                <p className="mt-8 inline-flex items-center gap-2 font-mono text-xs text-muted">
                  <span className="size-[7px] rounded-full bg-live" />
                  Available for roles and freelance
                </p>
              )}
              <a
                href="/#contact"
                onClick={() => setOpen(false)}
                className="mt-6 flex min-h-12 w-fit items-center rounded-full bg-ink px-6 text-[15px] font-medium text-bg"
              >
                Let’s talk
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}