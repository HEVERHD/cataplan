"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ToggleLeft, ToggleRight } from "lucide-react";

export function ToggleExperience({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();

  async function toggle() {
    const res = await fetch(`/api/experiencias/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });

    if (res.ok) {
      toast.success(active ? "Experiencia desactivada" : "Experiencia activada");
      router.refresh();
    } else {
      toast.error("No se pudo actualizar");
    }
  }

  return (
    <button
      onClick={toggle}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? "hover:bg-red-50 text-green-500 hover:text-red-500"
          : "hover:bg-green-50 text-slate-400 hover:text-green-500"
      }`}
      title={active ? "Desactivar" : "Activar"}
    >
      {active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
    </button>
  );
}
