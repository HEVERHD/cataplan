"use client";

import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";

interface Props {
  experience: CartItem & { slug: string };
}

export function ExperienceActions({ experience }: Props) {
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(experience.experienceId);

  function handleCartToggle() {
    if (inCart) {
      removeItem(experience.experienceId);
    } else {
      addItem(experience);
    }
  }

  return (
    <div className="space-y-3">
      <Link
        href={`/reservar/${experience.slug}`}
        className="block w-full text-center bg-[var(--brand-coral)] hover:bg-[var(--brand-coral-dark)] text-white font-bold py-4 rounded-xl transition-colors text-lg"
      >
        Reservar ahora
      </Link>

      <button
        onClick={handleCartToggle}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all text-sm border-2 ${
          inCart
            ? "border-[var(--brand-teal)] bg-[var(--accent)] text-[var(--brand-teal)]"
            : "border-[var(--brand-teal)] text-[var(--brand-teal)] hover:bg-[var(--brand-teal)] hover:text-white"
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

      <a
        href={`https://wa.me/573001234567?text=${encodeURIComponent(
          `Hola CataPlan, quiero información sobre: ${experience.name}`,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold py-3 rounded-xl transition-all text-sm"
      >
        Consultar por WhatsApp
      </a>
    </div>
  );
}
