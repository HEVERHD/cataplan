import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ExperienceForm } from "@/components/admin/experience-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editar experiencia | Admin" };

export default async function EditarExperienciaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = await db.experience.findUnique({ where: { id } });
  if (!exp) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/admin/experiencias"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[var(--brand-teal)] text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Volver
        </Link>
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-slate-800">
          Editar experiencia
        </h1>
        <p className="text-slate-500 mt-1">{exp.code} · {exp.name}</p>
      </div>

      <ExperienceForm experience={exp} />
    </div>
  );
}
