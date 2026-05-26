import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCOP } from "@/lib/utils";
import { BookingForm } from "@/components/public/booking-form";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reservar experiencia" };

export default async function ReservarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exp = await db.experience.findUnique({ where: { slug, active: true } });
  if (!exp) notFound();

  return (
    <div className="min-h-screen bg-[var(--muted)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href={`/experiencia/${exp.slug}`}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[var(--brand-teal)] text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Volver a la experiencia
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Formulario */}
          <div className="md:col-span-3">
            <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-slate-800 mb-2">
              Completa tu reserva
            </h1>
            <p className="text-slate-500 mb-8">
              Rellena el formulario y procede al pago. Es rápido y seguro.
            </p>
            <BookingForm experience={exp} />
          </div>

          {/* Resumen */}
          <aside className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 sticky top-24">
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[var(--brand-teal)] to-[var(--brand-coral)]">
                {exp.images[0] && (
                  <img src={exp.images[0]} alt={exp.name} className="w-full h-full object-cover" />
                )}
              </div>

              <h2 className="font-[var(--font-playfair)] text-xl font-bold text-slate-800 leading-snug">
                {exp.name}
              </h2>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={15} className="text-[var(--brand-teal)]" />
                {exp.duration}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                {exp.includes.slice(0, 3).map((item) => (
                  <div key={item} className="flex gap-2 text-xs text-slate-500">
                    <CheckCircle2 size={14} className="text-[var(--brand-teal)] shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
                {exp.includes.length > 3 && (
                  <p className="text-xs text-slate-400">
                    +{exp.includes.length - 3} más incluidos
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-sm text-slate-500">Por persona</span>
                <span className="font-[var(--font-playfair)] text-2xl font-bold text-[var(--brand-coral)]">
                  {formatCOP(exp.price)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
