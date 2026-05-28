"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/research", label: "Research" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper-white/80 backdrop-blur-md border-b border-paper-warm">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg text-ink tracking-tight hover:text-accent transition-colors"
        >
          Dr. Sudheendra Huddar
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/book"
              className="text-sm bg-accent text-white px-4 py-1.5 rounded-full hover:bg-accent-dark transition-colors"
            >
              Book appointment
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-ink-muted"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {open ? (
              <path
                d="M5 5l12 12M17 5L5 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <>
                <path
                  d="M4 7h14M4 11h14M4 15h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-paper-white border-t border-paper-warm px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="text-sm bg-accent text-white px-4 py-2 rounded-full text-center"
            onClick={() => setOpen(false)}
          >
            Book appointment
          </Link>
        </div>
      )}
    </header>
  );
}
