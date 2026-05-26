"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, X, ImagePlus, GripVertical } from "lucide-react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";

interface Experience {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  types: string[];
  includes: string[];
  images: string[];
  featured: boolean;
  active: boolean;
}

export function ExperienceForm({ experience }: { experience: Experience }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: experience.name,
    price: String(experience.price),
    duration: experience.duration,
    description: experience.description,
    types: experience.types.join(", "),
    featured: experience.featured,
    active: experience.active,
  });
  const [includes, setIncludes] = useState<string[]>(experience.includes);
  const [newInclude, setNewInclude] = useState("");
  const [images, setImages] = useState<string[]>(experience.images);


  function addInclude() {
    if (newInclude.trim()) {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude("");
    }
  }

  function removeInclude(i: number) {
    setIncludes(includes.filter((_, idx) => idx !== i));
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  function handleUploadSuccess(result: CloudinaryUploadWidgetResults) {
    const info = result?.info;
    if (info && typeof info === "object" && "secure_url" in info) {
      setImages((prev) => [...prev, info.secure_url as string]);
      toast.success("Imagen subida correctamente");
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch(`/api/experiencias/${experience.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          duration: form.duration,
          description: form.description,
          types: form.types
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          includes,
          images,
          featured: form.featured,
          active: form.active,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar");
      toast.success("Experiencia actualizada");
      router.push("/admin/experiencias");
      router.refresh();
    } catch {
      toast.error("No se pudo guardar la experiencia");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
      {/* Campos principales */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
          <input
            className={field}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio (COP)</label>
          <input
            type="number"
            className={field}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Duración</label>
          <input
            className={field}
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="3 Horas"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Tipos (separados por coma)
          </label>
          <input
            className={field}
            value={form.types}
            onChange={(e) => setForm({ ...form, types: e.target.value })}
            placeholder="Gastronómica, Cultural"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
        <textarea
          rows={5}
          className={field + " resize-none"}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* ── Imágenes ──────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Imágenes</label>
            <p className="text-xs text-slate-400 mt-0.5">
              La primera imagen es la portada. Máx. 10 fotos.
            </p>
          </div>
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{
              maxFiles: 10,
              resourceType: "image",
              sources: ["local", "camera"],
              folder: "cataplan/experiences",
              cropping: false,
              multiple: true,
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
              maxFileSize: 8000000,
            }}
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                disabled={images.length >= 10}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-dark)] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <ImagePlus size={16} />
                Subir imagen
              </button>
            )}
          </CldUploadWidget>
        </div>

        {images.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <ImagePlus size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">
              Aún no hay imágenes. Sube fotos de la experiencia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, i) => (
              <div key={url} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100">
                <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />

                {/* Portada badge */}
                {i === 0 && (
                  <span className="absolute top-2 left-2 bg-[var(--brand-teal)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Portada
                  </span>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  aria-label="Eliminar imagen"
                >
                  <X size={12} />
                </button>

                {/* Move up (make cover) */}
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => {
                        const next = [...prev];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        return next;
                      })
                    }
                    title="Mover a portada"
                    className="absolute bottom-2 left-2 w-6 h-6 bg-white/90 text-slate-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <GripVertical size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Incluye ────────────────────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">¿Qué incluye?</label>
        <div className="space-y-2 mb-3">
          {includes.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
              <span className="text-sm text-slate-700 flex-1">{item}</span>
              <button
                onClick={() => removeInclude(i)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={field}
            placeholder="Agregar ítem incluido..."
            value={newInclude}
            onChange={(e) => setNewInclude(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())}
          />
          <button
            type="button"
            onClick={addInclude}
            className="px-4 py-2 bg-[var(--brand-teal)] text-white rounded-xl hover:bg-[var(--brand-teal-dark)] transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* ── Toggles ────────────────────────────────────────────────────────── */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium text-slate-700">Activa</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium text-slate-700">Destacada</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-dark)] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Guardar cambios
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-semibold"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
