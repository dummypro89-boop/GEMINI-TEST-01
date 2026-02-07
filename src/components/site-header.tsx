"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type SiteHeaderProps = {
  brand: string;
};

const mainMenu = [
  { label: "ABOUT", href: "/about" },
  { label: "PROGRAM", href: "/program" },
  { label: "INSTRUCTORS", href: "/instructors" },
  { label: "ACADEMY", href: "/academy" },
  { label: "CONTACT", href: "/contact" }
];

const subMenu = [
  { label: "SCHEDULE", href: "/schedule" },
  { label: "PRICING", href: "/pricing" },
  { label: "JOURNAL", href: "/journal" }
];

export function SiteHeader({ brand }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-sand-200 bg-[#fbf8f2]/90 backdrop-blur">
        <nav className="site-wrap flex items-center justify-between py-4">
          <Link href="/" className="font-serif text-3xl tracking-[0.12em] text-sand-900">
            {brand}
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <div className="flex items-center gap-6 text-xs tracking-[0.1em] text-sand-700 xl:text-sm">
              {mainMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition ${
                    pathname === item.href ? "text-sand-900 underline underline-offset-8" : "hover:text-sand-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="h-5 w-px bg-sand-200" />

            <div className="flex items-center gap-4 text-[11px] tracking-[0.08em] text-sand-600 xl:text-xs">
              {subMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition ${
                    pathname === item.href ? "text-sand-900" : "hover:text-sand-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="btn-secondary px-4 py-2 lg:hidden"
            aria-label="메뉴 열기"
            aria-expanded={open}
          >
            MENU
          </button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] bg-[#fbf8f2]">
          <div className="site-wrap flex h-full flex-col py-6">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <p className="font-serif text-2xl tracking-[0.12em] text-sand-900">{brand}</p>
              <button type="button" onClick={() => setOpen(false)} className="btn-secondary px-4 py-2">
                CLOSE
              </button>
            </div>

            <div className="mt-8 space-y-5">
              {mainMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block text-xl tracking-[0.08em] ${
                    pathname === item.href ? "text-sand-900" : "text-sand-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 border-t border-sand-200 pt-6">
              <p className="text-xs tracking-[0.1em] text-sand-600">EXPLORE</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-sand-700">
                {subMenu.map((item) => (
                  <Link key={item.href} href={item.href} className="btn-secondary px-4 py-2">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-sand-200 pt-6">
              <Link href="/contact" className="btn-primary w-full">
                상담 예약 문의
              </Link>
              <div className="mt-4 space-y-1 text-sm text-sand-700">
                <p>02-0000-0000</p>
                <p>trulypilates@example.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
