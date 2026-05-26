import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

const schema = z.object({
  items: z
    .array(
      z.object({
        experienceId: z.string().min(1),
        date: z.string().min(1),
        people: z.coerce.number().min(1).max(20),
      }),
    )
    .min(1)
    .max(10),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Verificar todas las experiencias y calcular total
    const experienceIds = data.items.map((i) => i.experienceId);
    const experiences = await db.experience.findMany({
      where: { id: { in: experienceIds }, active: true },
      select: { id: true, price: true },
    });

    if (experiences.length !== data.items.length) {
      return NextResponse.json(
        { error: "Una o más experiencias no están disponibles" },
        { status: 400 },
      );
    }

    const priceMap = new Map(experiences.map((e) => [e.id, e.price]));

    // Calcular total validado en servidor
    let total = 0;
    for (const item of data.items) {
      const price = priceMap.get(item.experienceId);
      if (!price) {
        return NextResponse.json({ error: "Experiencia no encontrada" }, { status: 400 });
      }
      total += price * item.people;
    }

    // groupId = referencia única para el pago de Wompi
    const groupId = randomUUID();

    // Crear todas las reservas en una transacción
    await db.$transaction(
      data.items.map((item) =>
        db.booking.create({
          data: {
            experienceId: item.experienceId,
            date: new Date(item.date),
            people: item.people,
            total: priceMap.get(item.experienceId)! * item.people,
            status: "PENDIENTE",
            groupId,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            notes: data.notes ?? null,
          },
        }),
      ),
    );

    return NextResponse.json({ groupId, total }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    }
    console.error("[POST /api/carrito/checkout]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
