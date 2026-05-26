"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/lib/cart-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ShoppingBag,
  Trash2,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { formatCOP } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Ingresa tu nombre completo"),
  customerEmail: z.string().email("Correo electrónico inválido"),
  customerPhone: z
    .string()
    .min(10, "Mínimo 10 dígitos")
    .regex(/^[0-9+\s-]+$/, { error: "Solo números y + - espacio" }),
  notes: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

type ItemConfig = { date: string; people: number };

// ─── Wompi Checkout ───────────────────────────────────────────────────────────

function WompiSection({ groupId, total }: { groupId: string; total: number }) {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "pub_test_placeholder";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const wompiUrl = new URL("https://checkout.wompi.co/p/");
  wompiUrl.searchParams.set("public-key", publicKey);
  wompiUrl.searchParams.set("currency", "COP");
  wompiUrl.searchParams.set("amount-in-cents", String(total * 100));
  wompiUrl.searchParams.set("reference", groupId);
  wompiUrl.searchParams.set("redirect-url", `${appUrl}/reservar/confirmacion`);

  return (
    <div className="space-y-5">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={20} className="text-green-600" />
          <p className="font-semibold text-green-800">¡Reservas registradas!</p>
        </div>
        <p className="text-sm text-green-700">
          Completa el pago para confirmar todos tus planes.
        </p>
        <p className="text-xs text-green-600 mt-1 font-mono">Ref: {groupId.slice(0, 18)}...</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
        <p className="font-semibold text-slate-800">Total a pagar</p>
        <p className="text-3xl font-bold text-[var(--brand-coral)]">{formatCOP(total)}</p>
        <p className="text-xs text-slate-400">Acepta PSE, tarjetas débito/crédito y Nequi.</p>
      </div>

      <a
        href={wompiUrl.toString()}
        className="block w-full text-center bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-dark)] text-white font-bold py-4 rounded-xl transition-colors text-lg"
      >
        Pagar con Wompi
      </a>
      <p className="text-xs text-slate-400 text-center">
        Serás redirigido al checkout seguro de Wompi
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarritoPage() {
  const { items, removeItem, clearCart } = useCart();
  const [configs, setConfigs] = useState<Record<string, ItemConfig>>(() =>
    Object.fromEntries(items.map((i) => [i.experienceId, { date: "", people: 1 }])),
  );
  const [paymentData, setPaymentData] = useState<{ groupId: string; total: number } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema) });

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const cfg = configs[item.experienceId];
        return sum + item.price * (cfg?.people ?? 1);
      }, 0),
    [items, configs],
  );

  function updateConfig(experienceId: string, patch: Partial<ItemConfig>) {
    setConfigs((prev) => ({
      ...prev,
      [experienceId]: { ...prev[experienceId], ...patch },
    }));
  }

  async function onSubmit(values: CheckoutValues) {
    // Validate all items have dates
    const missing = items.filter((item) => !configs[item.experienceId]?.date);
    if (missing.length > 0) {
      toast.error(`Selecciona fecha para: ${missing.map((i) => i.name).join(", ")}`);
      return;
    }

    try {
      const res = await fetch("/api/carrito/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            experienceId: item.experienceId,
            date: configs[item.experienceId].date,
            people: configs[item.experienceId].people ?? 1,
          })),
          ...values,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Error al procesar el carrito");
      }

      const data = await res.json();
      setPaymentData(data);
      clearCart();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo salió mal. Inténtalo de nuevo.");
    }
  }

  // ── Payment step ──────────────────────────────────────────────────────────
  if (paymentData) {
    return (
      <div className="min-h-screen bg-[var(--muted)] pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4">
          <WompiSection groupId={paymentData.groupId} total={paymentData.total} />
        </div>
      </div>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--muted)] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto">
            <ShoppingBag size={32} className="text-slate-300" />
          </div>
          <p className="text-lg font-semibold text-slate-700">Tu carrito está vacío</p>
          <p className="text-sm text-slate-400">Agrega experiencias para reservarlas juntas.</p>
          <Link
            href="/experiencias"
            className="inline-flex items-center gap-2 bg-[var(--brand-teal)] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[var(--brand-teal-dark)] transition-colors"
          >
            Explorar experiencias
          </Link>
        </div>
      </div>
    );
  }

  // ── Checkout form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--muted)] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <Link
          href="/experiencias"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[var(--brand-teal)] text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Seguir explorando
        </Link>

        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-slate-800 mb-2">
          Completa tu reserva
        </h1>
        <p className="text-slate-500 mb-8">
          Configura cada plan y añade tus datos para proceder al pago.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-5 gap-8">
            {/* ── Left: plans config ──────────────────────────────────── */}
            <div className="md:col-span-3 space-y-4">
              <h2 className="font-semibold text-slate-700 text-lg">
                Tus planes ({items.length})
              </h2>

              {items.map((item) => {
                const cfg = configs[item.experienceId] ?? { date: "", people: 1 };
                return (
                  <div
                    key={item.experienceId}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4"
                  >
                    {/* Item header */}
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-[var(--brand-teal)] to-[var(--brand-coral)]">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 leading-snug">{item.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {item.duration}
                        </p>
                        <p className="font-bold text-[var(--brand-coral)] text-sm mt-0.5">
                          {formatCOP(item.price)}{" "}
                          <span className="font-normal text-slate-400">/ persona</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.experienceId)}
                        className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-slate-400 shrink-0"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Date + people */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          <Calendar size={12} className="inline mr-1 text-[var(--brand-teal)]" />
                          Fecha
                        </label>
                        <input
                          type="date"
                          min={today}
                          value={cfg.date}
                          onChange={(e) =>
                            updateConfig(item.experienceId, { date: e.target.value })
                          }
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          <Users size={12} className="inline mr-1 text-[var(--brand-teal)]" />
                          Personas
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={cfg.people}
                          onChange={(e) =>
                            updateConfig(item.experienceId, {
                              people: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white"
                        />
                      </div>
                    </div>

                    {/* Subtotal per item */}
                    <div className="text-right text-sm text-slate-500">
                      Subtotal:{" "}
                      <span className="font-bold text-slate-700">
                        {formatCOP(item.price * (cfg.people ?? 1))}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Customer info */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <h2 className="font-semibold text-slate-700 text-lg">Tus datos</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <User size={13} className="inline mr-1.5 text-[var(--brand-teal)]" />
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    placeholder="Juan García"
                    {...register("customerName")}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      <Mail size={13} className="inline mr-1.5 text-[var(--brand-teal)]" />
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="juan@ejemplo.com"
                      {...register("customerEmail")}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white"
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      <Phone size={13} className="inline mr-1.5 text-[var(--brand-teal)]" />
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+57 300 000 0000"
                      {...register("customerPhone")}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <MessageSquare size={13} className="inline mr-1.5 text-[var(--brand-teal)]" />
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Alergias, preferencias, ocasiones especiales..."
                    {...register("notes")}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Right: order summary ────────────────────────────────── */}
            <aside className="md:col-span-2">
              <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-slate-700 text-lg">Resumen del pedido</h2>

                <div className="space-y-3">
                  {items.map((item) => {
                    const cfg = configs[item.experienceId];
                    const people = cfg?.people ?? 1;
                    return (
                      <div
                        key={item.experienceId}
                        className="flex justify-between text-sm text-slate-600"
                      >
                        <span className="flex-1 pr-2 leading-snug line-clamp-1">{item.name}</span>
                        <span className="shrink-0 font-medium text-slate-800">
                          {formatCOP(item.price * people)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-slate-800 text-lg">
                  <span>Total</span>
                  <span className="text-[var(--brand-coral)]">{formatCOP(subtotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--brand-coral)] hover:bg-[var(--brand-coral-dark)] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  {isSubmitting && <Loader2 size={20} className="animate-spin" />}
                  {isSubmitting ? "Procesando..." : "Continuar al pago"}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Pago seguro procesado por Wompi
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
