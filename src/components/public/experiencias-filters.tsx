"use client";

import { useState, useMemo } from "react";
import { Search, X, Compass } from "lucide-react";
import { ExperienceCard } from "@/components/public/experience-card";
import { formatCOP } from "@/lib/utils";

interface ExperienceItem {
  id: string;
  code: string;
  slug: string;
  name: string;
  types: string[];
  price: number;
  duration: string;
  description: string;
  images: string[];
  featured: boolean;
  order: number;
}

interface Props {
  experiences: ExperienceItem[];
}

const ALL_TYPES = [
  "Todos",
  "Gastronómica",
  "Cultural",
  "Bienestar",
  "Aventura",
  "Naturaleza",
  "Vida Nocturna",
  "Experiencia VIP",
  "Danza",
];

type SortKey = "order" | "price-asc" | "price-desc" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "order", label: "Recomendados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name", label: "A-Z" },
];

export function ExperienciasFilters({ experiences }: Props) {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [sortBy, setSortBy] = useState<SortKey>("order");
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);

  // Compute price tiers dynamically from actual data
  const priceTiers = useMemo(() => {
    if (!experiences.length) return [];
    const prices = experiences.map((e) => e.price).sort((a, b) => a - b);
    const max = prices[prices.length - 1];
    // Round to nearest 50k
    const r = (n: number) => Math.ceil(n / 50000) * 50000;
    const t1 = r(max * 0.4);
    const t2 = r(max * 0.75);
    const tiers = [
      { label: "Todos los precios", max: Infinity },
      { label: `Hasta ${formatCOP(t1)}`, max: t1 },
      { label: `Hasta ${formatCOP(t2)}`, max: t2 },
      { label: `Hasta ${formatCOP(max)}`, max: max },
    ];
    // Deduplicate tiers with same max
    return tiers.filter((t, i, arr) => i === 0 || t.max !== arr[i - 1].max);
  }, [experiences]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return experiences
      .filter((e) => {
        if (tipo !== "Todos" && !e.types.some((t) => t.toLowerCase().includes(tipo.toLowerCase()))) {
          return false;
        }
        if (q && !e.name.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) {
          return false;
        }
        if (maxPrice !== Infinity && e.price > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name, "es");
        return a.order - b.order;
      });
  }, [experiences, search, tipo, sortBy, maxPrice]);

  const hasActiveFilters =
    search.trim() !== "" || tipo !== "Todos" || maxPrice !== Infinity || sortBy !== "order";

  function clearFilters() {
    setSearch("");
    setTipo("Todos");
    setSortBy("order");
    setMaxPrice(Infinity);
  }

  return (
    <>
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar experiencias..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] focus:border-[var(--brand-teal)] transition-colors"
          />
        </div>

        {/* Price filter */}
        {priceTiers.length > 1 && (
          <select
            value={maxPrice === Infinity ? "Infinity" : String(maxPrice)}
            onChange={(e) =>
              setMaxPrice(e.target.value === "Infinity" ? Infinity : Number(e.target.value))
            }
            className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] text-slate-600 cursor-pointer"
          >
            {priceTiers.map((t) => (
              <option key={t.max} value={t.max === Infinity ? "Infinity" : t.max}>
                {t.label}
              </option>
            ))}
          </select>
        )}

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] text-slate-600 cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {ALL_TYPES.map((t) => {
          const isActive = tipo === t;
          return (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                isActive
                  ? "bg-[var(--brand-teal)] text-white border-[var(--brand-teal)]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Active filters bar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "resultado" : "resultados"}
            {search && (
              <>
                {" para "}
                <span className="font-medium text-slate-700">&ldquo;{search}&rdquo;</span>
              </>
            )}
          </p>
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-[var(--brand-teal)] hover:text-[var(--brand-teal-dark)] font-medium transition-colors"
          >
            <X size={14} />
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp) => {
            const { order, ...cardProps } = exp;
            return <ExperienceCard key={exp.id} {...cardProps} />;
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-24 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <Compass size={28} className="text-slate-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">
              {search
                ? `Sin resultados para "${search}"`
                : "Sin experiencias en esta categoría"}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Prueba con otros filtros o explora todas las experiencias.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--brand-teal-dark)] transition-colors"
          >
            Ver todas las experiencias
          </button>
        </div>
      )}
    </>
  );
}
