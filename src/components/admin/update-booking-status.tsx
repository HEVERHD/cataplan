"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TRANSITIONS: Record<string, string[]> = {
  PENDIENTE: ["CONFIRMADA", "CANCELADA"],
  CONFIRMADA: ["COMPLETADA", "CANCELADA"],
  COMPLETADA: [],
  CANCELADA: [],
};

export function UpdateBookingStatus({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const options = TRANSITIONS[currentStatus] ?? [];

  if (options.length === 0) return <span className="text-xs text-slate-400">—</span>;

  async function update(newStatus: string) {
    const res = await fetch(`/api/reservas/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      toast.success(`Reserva marcada como ${newStatus}`);
      router.refresh();
    } else {
      toast.error("No se pudo actualizar el estado");
    }
  }

  return (
    <select
      defaultValue=""
      onChange={(e) => e.target.value && update(e.target.value)}
      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-[var(--brand-teal)]"
    >
      <option value="" disabled>
        Cambiar...
      </option>
      {options.map((s) => (
        <option key={s} value={s}>
          → {s}
        </option>
      ))}
    </select>
  );
}
