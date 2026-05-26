const STYLES: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMADA: "bg-green-100 text-green-700",
  COMPLETADA: "bg-blue-100 text-blue-700",
  CANCELADA: "bg-red-100 text-red-700",
};

export function BookingStatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STYLES[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}
