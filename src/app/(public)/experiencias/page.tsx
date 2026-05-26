import { db } from "@/lib/db";
import { ExperienciasFilters } from "@/components/public/experiencias-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiencias",
  description:
    "Explora nuestro catálogo completo de experiencias gastronómicas, culturales y de aventura en Cartagena.",
};

export const revalidate = 3600;

export default async function ExperienciasPage() {
  const experiences = await db.experience.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      code: true,
      slug: true,
      name: true,
      types: true,
      price: true,
      duration: true,
      description: true,
      images: true,
      featured: true,
      order: true,
    },
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[var(--brand-coral)] font-semibold text-sm uppercase tracking-widest">
            Catálogo completo
          </span>
          <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold text-slate-800 mt-2">
            Todas las Experiencias
          </h1>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            {experiences.length} experiencias únicas en Cartagena. Busca, filtra y encuentra
            la que más te llama.
          </p>
        </div>

        <ExperienciasFilters experiences={experiences} />
      </div>
    </div>
  );
}
