import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { db } from "@/lib/db";

// Wompi firma sus eventos con HMAC-SHA256
function verifyWompiSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHash("sha256")
    .update(`${payload}${secret}`)
    .digest("hex");
  return expected === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-wompi-signature") ?? "";
    const secret = process.env.WOMPI_EVENTS_SECRET ?? "";

    // Verificar firma solo en producción
    if (process.env.NODE_ENV === "production" && secret) {
      if (!verifyWompiSignature(rawBody, signature, secret)) {
        return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const transaction = event?.data?.transaction;

    if (!transaction) {
      return NextResponse.json({ ok: true });
    }

    const { reference, status, id: wompiRef } = transaction;

    const newStatus =
      status === "APPROVED"
        ? "CONFIRMADA"
        : status === "VOIDED" || status === "DECLINED" || status === "ERROR"
        ? "CANCELADA"
        : null;

    if (!newStatus) return NextResponse.json({ ok: true });

    // Intentar como reserva individual primero, luego como grupo (carrito)
    const booking = await db.booking.findUnique({ where: { id: reference } });

    if (booking) {
      await db.booking.update({
        where: { id: reference },
        data: { status: newStatus, wompiRef },
      });
    } else {
      // Carrito: actualizar todas las reservas del grupo
      await db.booking.updateMany({
        where: { groupId: reference },
        data: { status: newStatus, wompiRef },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Wompi webhook]", err);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}
