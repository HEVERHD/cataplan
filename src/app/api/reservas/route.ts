import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  experienceId: z.string().min(1),
  date: z.string().min(1),
  people: z.coerce.number().min(1).max(20),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  total: z.number().min(0),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Verificar que la experiencia existe y está activa
    const experience = await db.experience.findUnique({
      where: { id: data.experienceId, active: true },
    });

    if (!experience) {
      return NextResponse.json({ error: "Experiencia no disponible" }, { status: 404 });
    }

    // Validar precio (evita manipulación del cliente)
    const expectedTotal = experience.price * data.people;
    if (data.total !== expectedTotal) {
      return NextResponse.json({ error: "El total no corresponde al precio" }, { status: 400 });
    }

    const booking = await db.booking.create({
      data: {
        experienceId: data.experienceId,
        date: new Date(data.date),
        people: data.people,
        total: data.total,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        notes: data.notes ?? null,
        status: "PENDIENTE",
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    }
    console.error("[POST /api/reservas]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Solo accesible desde el admin (el middleware lo protege)
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = Number(searchParams.get("page") ?? "1");
  const limit = 20;

  const where = status ? { status: status as "PENDIENTE" | "CONFIRMADA" | "COMPLETADA" | "CANCELADA" } : {};

  const [reservas, total] = await Promise.all([
    db.booking.findMany({
      where,
      include: { experience: { select: { name: true, code: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.booking.count({ where }),
  ]);

  return NextResponse.json({ reservas, total, page, pages: Math.ceil(total / limit) });
}
