import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const patchSchema = z.object({
  status: z.enum(["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = patchSchema.parse(body);

    const booking = await db.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ booking });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    }
    return NextResponse.json({ error: "Error actualizando reserva" }, { status: 500 });
  }
}
