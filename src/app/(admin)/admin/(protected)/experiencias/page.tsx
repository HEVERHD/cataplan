import { db } from "@/lib/db";
import { formatCOP } from "@/lib/utils";
import Link from "next/link";
import { Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { ToggleExperience } from "@/components/admin/toggle-experience";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Experiencias | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminExperienciasPage() {
  const experiences = await db.experience.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-slate-800">
            Experiencias
          </h1>
          <p className="text-slate-500 mt-1">{experiences.length} experiencias en total</p>
        </div>
        <Link
          href="/admin/experiencias/nueva"
          className="inline-flex items-center gap-2 bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-dark)] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus size={16} />
          Nueva experiencia
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Código", "Nombre", "Tipo", "Precio", "Reservas", "Estado", "Acciones"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {experiences.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{exp.code}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{exp.name}</p>
                    <p className="text-xs text-slate-400">{exp.duration}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {exp.types.join(", ")}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {formatCOP(exp.price)}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">
                    {exp._count.bookings}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        exp.active
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {exp.active ? "Activa" : "Inactiva"}
                    </span>
                    {exp.featured && (
                      <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
                        Destacada
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/experiencias/${exp.id}/editar`}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[var(--brand-teal)] transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </Link>
                      <ToggleExperience id={exp.id} active={exp.active} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
