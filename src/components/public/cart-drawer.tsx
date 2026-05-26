"use client";

import { useCart } from "@/lib/cart-context";
import { formatCOP } from "@/lib/utils";
import { X, ShoppingBag, Trash2, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, count } = useCart();

  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[var(--brand-teal)]" />
            <h2 className="font-semibold text-slate-800">
              Tu carrito{" "}
              {count > 0 && (
                <span className="text-sm font-normal text-slate-400">({count} plan{count !== 1 ? "es" : ""})</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <ShoppingBag size={28} className="text-slate-300" />
              </div>
              <div>
                <p className="font-medium text-slate-600">Tu carrito está vacío</p>
                <p className="text-sm text-slate-400 mt-1">
                  Agrega experiencias para reservarlas juntas.
                </p>
              </div>
              <Link
                href="/experiencias"
                onClick={closeDrawer}
                className="text-sm font-semibold text-[var(--brand-teal)] hover:underline"
              >
                Explorar experiencias →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.experienceId}
                className="flex gap-3 bg-slate-50 rounded-xl p-3"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[var(--brand-teal)] to-[var(--brand-coral)]">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock size={11} />
                    {item.duration}
                  </p>
                  <p className="font-bold text-[var(--brand-coral)] text-sm mt-1">
                    {formatCOP(item.price)}
                    <span className="font-normal text-slate-400 text-xs"> / persona</span>
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.experienceId)}
                  className="shrink-0 p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-slate-400"
                  aria-label={`Eliminar ${item.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Precio base (1 persona c/u)</span>
              <span className="font-bold text-slate-800">{formatCOP(total)}</span>
            </div>
            <p className="text-xs text-slate-400">
              El total final se calcula según el número de personas por plan.
            </p>
            <Link
              href="/carrito"
              onClick={closeDrawer}
              className="flex items-center justify-center gap-2 w-full bg-[var(--brand-coral)] hover:bg-[var(--brand-coral-dark)] text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Configurar y pagar
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={closeDrawer}
              className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Seguir explorando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
