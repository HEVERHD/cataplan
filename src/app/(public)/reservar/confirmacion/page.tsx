import Link from "next/link";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { formatCOP } from "@/lib/utils";
import { sendBookingConfirmation } from "@/lib/email";

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{
    reference?: string;
    status?: string;
    id?: string;
  }>;
}) {
  const { reference, status, id: transactionId } = await searchParams;

  // Buscar reserva individual primero, luego por groupId (carrito)
  const booking = reference
    ? await db.booking.findUnique({
        where: { id: reference },
        include: { experience: { select: { name: true, slug: true } } },
      })
    : null;

  const groupBookings =
    !booking && reference
      ? await db.booking.findMany({
          where: { groupId: reference },
          include: { experience: { select: { name: true, slug: true } } },
          orderBy: { createdAt: "asc" },
        })
      : [];

  const isGroup = groupBookings.length > 0;
  const isApproved = status === "APPROVED";
  const isDeclined = status === "DECLINED" || status === "VOIDED" || status === "ERROR";

  // Actualizar estado — reserva individual
  if (isApproved && booking && booking.status === "PENDIENTE") {
    await db.booking.update({
      where: { id: reference },
      data: { status: "CONFIRMADA", wompiRef: transactionId ?? null },
    });

    try {
      await sendBookingConfirmation({
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        experienceName: booking.experience.name,
        date: booking.date,
        people: booking.people,
        total: booking.total,
        bookingId: booking.id,
      });
    } catch (emailErr) {
      console.error("[Confirmación] Error enviando email:", emailErr);
    }
  }

  // Actualizar estado — carrito (múltiples reservas)
  if (isApproved && isGroup && groupBookings.some((b) => b.status === "PENDIENTE")) {
    await db.booking.updateMany({
      where: { groupId: reference! },
      data: { status: "CONFIRMADA", wompiRef: transactionId ?? null },
    });

    // Email con el total del carrito
    const first = groupBookings[0];
    const totalGroup = groupBookings.reduce((s, b) => s + b.total, 0);
    try {
      await sendBookingConfirmation({
        customerName: first.customerName,
        customerEmail: first.customerEmail,
        experienceName:
          groupBookings.length === 1
            ? first.experience.name
            : `${groupBookings.length} experiencias en Cartagena`,
        date: first.date,
        people: groupBookings.reduce((s, b) => s + b.people, 0),
        total: totalGroup,
        bookingId: reference!,
      });
    } catch (emailErr) {
      console.error("[Confirmación carrito] Error enviando email:", emailErr);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--muted)] flex items-center justify-center pt-20 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center space-y-6">
        {isApproved ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 size={44} className="text-green-500" />
            </div>
            <div>
              <h1 className="font-[var(--font-playfair)] text-2xl font-bold text-slate-800">
                ¡Pago confirmado!
              </h1>
              <p className="text-slate-500 mt-2">
                Tu reserva está confirmada. Te esperamos en{" "}
                <strong>{booking?.experience.name}</strong>.
              </p>
            </div>

            {booking && (
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reserva</span>
                  <span className="font-mono text-xs text-slate-600">{booking.id.slice(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total pagado</span>
                  <span className="font-bold text-slate-800">{formatCOP(booking.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cliente</span>
                  <span className="text-slate-700">{booking.customerName}</span>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400">
              Recibirás un correo de confirmación. Para cualquier consulta escríbenos por WhatsApp.
            </p>

            <a
              href={`https://wa.me/573001234567?text=${encodeURIComponent(
                `Hola, confirmé mi reserva (ID: ${reference}). ¿Qué debo saber para el día de la experiencia?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Contactar por WhatsApp
            </a>
          </>
        ) : isDeclined ? (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <XCircle size={44} className="text-red-500" />
            </div>
            <div>
              <h1 className="font-[var(--font-playfair)] text-2xl font-bold text-slate-800">
                Pago rechazado
              </h1>
              <p className="text-slate-500 mt-2">
                No se pudo procesar tu pago. Puedes intentarlo de nuevo o contactarnos.
              </p>
            </div>
            {booking && (
              <Link
                href={`/reservar/${booking.experience.slug}`}
                className="flex items-center justify-center gap-2 w-full bg-[var(--brand-coral)] text-white font-semibold py-3 rounded-xl"
              >
                Intentar de nuevo <ArrowRight size={16} />
              </Link>
            )}
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
              <AlertCircle size={44} className="text-yellow-500" />
            </div>
            <div>
              <h1 className="font-[var(--font-playfair)] text-2xl font-bold text-slate-800">
                Estado desconocido
              </h1>
              <p className="text-slate-500 mt-2">
                No pudimos verificar el estado de tu pago. Contáctanos con tu referencia.
              </p>
            </div>
            {reference && (
              <p className="font-mono text-sm bg-slate-50 p-3 rounded-xl break-all">{reference}</p>
            )}
          </>
        )}

        <Link href="/experiencias" className="block text-sm text-[var(--brand-teal)] hover:underline">
          Ver más experiencias
        </Link>
      </div>
    </div>
  );
}
