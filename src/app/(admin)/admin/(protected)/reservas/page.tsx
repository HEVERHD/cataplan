import { db } from "@/lib/db";
import { formatCOP } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { UpdateBookingStatus } from "@/components/admin/update-booking-status";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reservas | Admin" };
export const dynamic = "force-dynamic";

const STATUS_FILTERS = ["TODAS", "PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"] as const;

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");
  const limit = 15;

  const where =
    !status || status === "TODAS"
      ? {}
      : { status: status as "PENDIENTE" | "CONFIRMADA" | "COMPLETADA" | "CANCELADA" };

  const [bookings, total] = await Promise.all([
    db.booking.findMany({
      where,
      include: { experience: { select: { name: true, code: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.booking.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-slate-800">
            Reservas
          </h1>
          <p className="text-slate-500 mt-1">{total} reservas en total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const isActive = (!status && f === "TODAS") || status === f;
          return (
            <a
              key={f}
              href={f === "TODAS" ? "/admin/reservas" : `/admin/reservas?status=${f}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? "bg-[var(--brand-teal)] text-white border-[var(--brand-teal)]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[var(--brand-teal)]"
              }`}
            >
              {f}
            </a>
          );
        })}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Cliente", "Experiencia", "Fecha", "Personas", "Total", "Estado", "Acciones"].map(
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
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{b.customerName}</p>
                    <p className="text-xs text-slate-400">{b.customerEmail}</p>
                    <p className="text-xs text-slate-400">{b.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{b.experience.name}</p>
                    <p className="text-xs text-slate-400">{b.experience.code}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {format(new Date(b.date), "dd MMM yyyy", { locale: es })}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-center">{b.people}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                    {formatCOP(b.total)}
                  </td>
                  <td className="px-4 py-3">
                    <BookingStatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <UpdateBookingStatus bookingId={b.id} currentStatus={b.status} />
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No hay reservas con este filtro
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 px-4 py-4 border-t border-slate-100">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/admin/reservas?${status ? `status=${status}&` : ""}page=${p}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-[var(--brand-teal)] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
