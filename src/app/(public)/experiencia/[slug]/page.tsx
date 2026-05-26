import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCOP } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExperienceActions } from "@/components/public/experience-actions";
import { Clock, Users, CheckCircle2, ArrowLeft, Star } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const experiences = await db.experience.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = await db.experience.findUnique({ where: { slug } });
  if (!exp) return {};
  return {
    title: exp.name,
    description: exp.description.slice(0, 160),
  };
}

export default async function ExperienciaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exp = await db.experience.findUnique({ where: { slug, active: true } });
  if (!exp) notFound();

  const coverImage = exp.images[0] ?? null;

  return (
    <div className="min-h-screen bg-[var(--muted)]">
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt={exp.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full gradient-brand" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 max-w-5xl mx-auto w-full">
          <Link
            href="/experiencias"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={15} /> Volver al catálogo
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {exp.types.map((t) => (
              <Badge key={t} className="bg-white/20 text-white border-0 backdrop-blur-sm">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-white leading-tight">
            {exp.name}
          </h1>
        </div>
      </div>

      {/* ── CONTENIDO ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="md:col-span-2 space-y-8">
          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-slate-600">
            <span className="flex items-center gap-2">
              <Clock size={18} className="text-[var(--brand-teal)]" />
              <strong>Duración:</strong> {exp.duration}
            </span>
            <span className="flex items-center gap-2">
              <Users size={18} className="text-[var(--brand-teal)]" />
              <strong>Formato:</strong> Grupos pequeños
            </span>
            <span className="flex items-center gap-2">
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
              <strong>Valoración:</strong> 4.9 / 5
            </span>
          </div>

          {/* Descripción */}
          <div>
            <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-slate-800 mb-3">
              La experiencia
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">{exp.description}</p>
          </div>

          {/* Qué incluye */}
          <div>
            <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-slate-800 mb-4">
              ¿Qué incluye?
            </h2>
            <ul className="space-y-3">
              {exp.includes.map((item) => (
                <li key={item} className="flex gap-3 text-slate-600">
                  <CheckCircle2
                    size={20}
                    className="text-[var(--brand-teal)] shrink-0 mt-0.5"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Galería de imágenes */}
          {exp.images.length > 1 && (
            <div>
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-slate-800 mb-4">
                Galería
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {exp.images.slice(1).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${exp.name} ${i + 2}`}
                    className="w-full h-36 object-cover rounded-xl"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── SIDEBAR DE RESERVA ─────────────────────────────────── */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-5">
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-medium">
                Precio por persona
              </p>
              <p className="font-[var(--font-playfair)] text-4xl font-bold text-[var(--brand-coral)] mt-1">
                {formatCOP(exp.price)}
              </p>
            </div>

            <div className="space-y-2 text-sm text-slate-500 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Duración</span>
                <span className="font-medium text-slate-700">{exp.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Código</span>
                <span className="font-medium text-slate-700">{exp.code}</span>
              </div>
            </div>

            <ExperienceActions
              experience={{
                experienceId: exp.id,
                slug: exp.slug,
                name: exp.name,
                price: exp.price,
                duration: exp.duration,
                image: exp.images[0] ?? "",
              }}
            />

            <p className="text-xs text-slate-400 text-center">
              Reserva 100% segura · Cancelación flexible
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
