import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const patchSchema = z.object({
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  name: z.string().min(2).optional(),
  price: z.number().positive().optional(),
  duration: z.string().min(1).optional(),
  description: z.string().min(10).optional(),
  types: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  order: z.number().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = patchSchema.parse(body);

    const experience = await db.experience.update({
      where: { id },
      data,
    });

    return NextResponse.json({ experience });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    }
    return NextResponse.json({ error: "Error actualizando experiencia" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Soft delete: desactivar en lugar de eliminar
  await db.experience.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
