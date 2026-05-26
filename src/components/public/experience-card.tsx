"use client";

import Link from "next/link";
import { Clock, Users, ShoppingBag, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

interface ExperienceCardProps {
  id: string;
  code: string;
  slug: string;
  name: string;
  types: string[];
  price: number;
  duration: string;
  description: string;
  images: string[];
  featured?: boolean;
}

export function ExperienceCard({
  id,
  slug,
  name,
  types,
  price,
  duration,
  description,
  images,
  featured,
}: ExperienceCardProps) {
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(id);
  const coverImage = images[0] ?? "";

  function handleCartToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (inCart) {
      removeItem(id);
    } else {
      addItem({ experienceId: id, slug, name, price, duration, image: coverImage });
    }
  }

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Card body — links to detail page */}
      <Link href={`/experiencia/${slug}`} className="flex flex-col flex-1">
        {/* Imagen */}
        <div className="relative h-52 bg-gradient-to-br from-[var(--brand-teal)] to-[var(--brand-coral)] overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="text-white text-7xl font-[var(--font-playfair)]">C</span>
            </div>
          )}

          {featured && (
            <span className="absolute top-3 left-3 bg-[var(--brand-coral)] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Destacada
            </span>
          )}

          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[var(--brand-coral)] font-bold text-lg px-3 py-1 rounded-xl shadow">
            {formatCOP(price)}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Tipos */}
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="text-xs bg-[var(--accent)] text-[var(--brand-teal-dark)] border-0"
              >
                {t}
              </Badge>
            ))}
          </div>

          {/* Nombre */}
          <h3 className="font-[var(--font-playfair)] text-lg font-bold text-slate-800 leading-snug group-hover:text-[var(--brand-teal)] transition-colors">
            {name}
          </h3>

          {/* Descripción */}
          <p className="text-sm text-slate-500 line-clamp-2 flex-1">{description}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[var(--brand-teal)]" />
              {duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-[var(--brand-teal)]" />
              Grupos pequeños
            </span>
          </div>
        </div>
      </Link>

      {/* Add to cart — outside the Link */}
      <div className="px-5 pb-5">
        <button
          onClick={handleCartToggle}
          className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-all ${
            inCart
              ? "bg-[var(--accent)] text-[var(--brand-teal)] border border-[var(--brand-teal)]"
              : "bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-dark)]"
          }`}
        >
          {inCart ? (
            <>
              <Check size={16} />
              En el carrito
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Agregar al carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
}
