import { db } from "@/lib/db";
import { formatCOP } from "@/lib/utils";
import { CalendarCheck, Compass, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    totalBookings,
    pendientes,
    confirmadas,
    completadas,
    canceladas,
    totalExperiences,
    recentBookings,
    revenue,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { status: "PENDIENTE" } }),
    db.booking.count({ where: { status: "CONFIRMADA" } }),
    db.booking.count({ where: { status: "COMPLETADA" } }),
    db.booking.count({ where: { status: "CANCELADA" } }),
    db.experience.count({ where: { active: true } }),
    db.booking.findMany({
      where: { status: { in: ["CONFIRMADA", "COMPLETADA"] } },
      include: { experience: { select: { name: true, code: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.booking.aggregate({
      where: { status: { in: ["CONFIRMADA", "COMPLETADA"] } },
      _sum: { total: true },
    }),
  ]);

  return {
    totalBookings,
    pendientes,
    confirmadas,
    completadas,
    canceladas,
    totalExperiences,
    recentBookings,
    revenue: revenue._sum.total ?? 0,
  };
}

const STATUS_STYLES: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMADA: "bg-green-100 text-green-700",
  COMPLETADA: "bg-blue-100 text-blue-700",
  CANCELADA: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
        </p>
      </div>

      {/* ── STAT CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ingresos totales"
          value={formatCOP(stats.revenue)}
          icon={<TrendingUp size={20} />}
          color="teal"
        />
        <StatCard
          title="Total reservas"
          value={String(stats.totalBookings)}
          icon={<CalendarCheck size={20} />}
          color="coral"
        />
        <StatCard
          title="Experiencias activas"
          value={String(stats.totalExperiences)}
          icon={<Compass size={20} />}
          color="blue"
        />
        <StatCard
          title="Reservas pendientes"
          value={String(stats.pendientes)}
          icon={<Clock size={20} />}
          color="yellow"
        />
      </div>

      {/* ── STATUS BREAKDOWN ───────────────────────────────────────── */}
      <div className="grid sm:grid-cols-4 gap-3">
        {[
          { label: "Pendientes", count: stats.pendientes, style: "bg-yellow-50 border-yellow-200 text-yellow-800" },
          { label: "Confirmadas", count: stats.confirmadas, style: "bg-green-50 border-green-200 text-green-800" },
          { label: "Completadas", count: stats.completadas, style: "bg-blue-50 border-blue-200 text-blue-800" },
          { label: "Canceladas", count: stats.canceladas, style: "bg-red-50 border-red-200 text-red-800" },
        ].map(({ label, count, style }) => (
          <div key={label} className={`rounded-xl border px-4 py-3 ${style}`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* ── RESERVAS RECIENTES ────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800 text-lg">Reservas recientes</h2>
          <Link
            href="/admin/reservas"
            className="text-sm text-[var(--brand-teal)] hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Cliente", "Experiencia", "Fecha", "Total", "Estado"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{b.customerName}</p>
                      <p className="text-xs text-slate-400">{b.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <p>{b.experience.name}</p>
                      <p className="text-xs text-slate-400">{b.experience.code}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {format(new Date(b.date), "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {formatCOP(b.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          STATUS_STYLES[b.status] ?? ""
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                      No hay reservas aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "teal" | "coral" | "blue" | "yellow";
}) {
  const colors = {
    teal: "bg-[var(--accent)] text-[var(--brand-teal)]",
    coral: "bg-orange-50 text-[var(--brand-coral)]",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
