"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, openDrawer } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/cataplansinfondo.png"
              alt="CataPlan"
              width={140}
              height={48}
              className={cn(
                "h-10 w-auto object-contain transition-all duration-300",
                scrolled ? "brightness-100" : "brightness-0 invert"
              )}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[var(--brand-coral)]",
                  scrolled ? "text-slate-700" : "text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/experiencias"
              className="bg-[var(--brand-coral)] hover:bg-[var(--brand-coral-dark)] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Ver Experiencias
            </Link>

            {/* Cart icon */}
            <button
              onClick={openDrawer}
              aria-label="Abrir carrito"
              className={cn(
                "relative p-2 rounded-full transition-colors",
                scrolled
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/20"
              )}
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--brand-coral)] text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile: cart + menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={openDrawer}
              aria-label="Abrir carrito"
              className={cn(
                "relative p-2 rounded-full transition-colors",
                scrolled ? "text-slate-700" : "text-white"
              )}
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--brand-coral)] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </button>
            <button
              className={cn(
                "p-2 rounded-lg",
                scrolled ? "text-slate-700" : "text-white"
              )}
              onClick={() => setOpen(!open)}
              aria-label="Menú"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-1">
            <div className="pb-3 mb-2 border-b border-slate-100">
              <Image
                src="/cataplansinfondo.png"
                alt="CataPlan"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 py-2.5 font-medium hover:text-[var(--brand-teal)] transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/experiencias"
              className="mt-2 bg-[var(--brand-coral)] text-white text-center py-3 rounded-full font-semibold"
              onClick={() => setOpen(false)}
            >
              Ver Experiencias
            </Link>
            <button
              onClick={() => { setOpen(false); openDrawer(); }}
              className="mt-1 border-2 border-[var(--brand-teal)] text-[var(--brand-teal)] py-2.5 rounded-full font-semibold flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Mi carrito{count > 0 && ` (${count})`}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Experiencias", href: "/experiencias" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#contacto" },
];
