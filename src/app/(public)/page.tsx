import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Shield, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { ExperienceCard } from "@/components/public/experience-card";
import { formatCOP } from "@/lib/utils";

export const revalidate = 3600; // ISR cada hora

async function getFeaturedExperiences() {
  return db.experience.findMany({
    where: { active: true, featured: true },
    orderBy: { order: "asc" },
    take: 6,
  });
}

export default async function HomePage() {
  const featured = await getFeaturedExperiences();

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Fondo degradado */}
        <div className="absolute inset-0 gradient-hero z-10" />

        {/* Imagen de fondo (Cartagena) */}
        <Image
          src="/cartagenatarde.jpg"
          alt="Cartagena de Indias al atardecer"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Contenido hero */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star size={14} className="text-yellow-300 fill-yellow-300" />
            La forma más auténtica de vivir Cartagena
          </div>

          <h1 className="font-[var(--font-playfair)] text-5xl md:text-7xl font-bold leading-tight mb-6">
            Experiencias que{" "}
            <span className="text-[var(--brand-coral-light)]">rompen</span>{" "}
            la burbuja turística
          </h1>

          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Gastronomía, cultura, aventura y vida nocturna curadas por locales.
            Vive Cartagena desde adentro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/experiencias"
              className="inline-flex items-center gap-2 bg-[var(--brand-coral)] hover:bg-[var(--brand-coral-dark)] text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors shadow-lg"
            >
              Ver todas las experiencias
              <ArrowRight size={20} />
            </Link>
            <a
              href="#nosotros"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              ¿Quiénes somos?
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60 text-xs">
          <span>Explora</span>
          <div className="w-px h-10 bg-white/30 animate-pulse" />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--brand-teal)] text-white py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10+", label: "Experiencias únicas" },
            { value: "500+", label: "Viajeros satisfechos" },
            { value: "4.9★", label: "Calificación promedio" },
            { value: "100%", label: "Guías locales" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl md:text-4xl font-[var(--font-playfair)] font-bold">
                {value}
              </p>
              <p className="text-sm text-white/75 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCIAS DESTACADAS ───────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[var(--brand-coral)] font-semibold text-sm uppercase tracking-widest">
              Catálogo
            </span>
            <h2 className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold text-slate-800 mt-2">
              Experiencias destacadas
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">
              Cada plan está diseñado para llevarte más allá de lo turístico.
              Auténtico, seguro y memorable.
            </p>
          </div>

          {featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((exp) => (
                <ExperienceCard key={exp.id} {...exp} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <p>Cargando experiencias...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/experiencias"
              className="inline-flex items-center gap-2 border-2 border-[var(--brand-teal)] text-[var(--brand-teal)] hover:bg-[var(--brand-teal)] hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all"
            >
              Ver todas las experiencias
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ CATAPLAN ─────────────────────────────────────────────── */}
      <section id="nosotros" className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[var(--brand-coral)] font-semibold text-sm uppercase tracking-widest">
              Nuestra promesa
            </span>
            <h2 className="font-[var(--font-playfair)] text-4xl font-bold text-slate-800 mt-2 mb-6 leading-snug">
              No somos un tour operator.
              <br />
              Somos tus amigos en Cartagena.
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              CataPlan nació para conectar a los viajeros con la Cartagena real: sus
              mercados, su música, su cocina y su gente. Cada experiencia es curada
              por locales que aman su ciudad y quieren compartirla contigo.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: <Shield size={20} />,
                  title: "100% Seguro",
                  desc: "Todos nuestros anfitriones son verificados y conocen cada rincón.",
                },
                {
                  icon: <Star size={20} />,
                  title: "Autenticidad garantizada",
                  desc: "Cero trampas turísticas. Experiencias donde van los locales.",
                },
                {
                  icon: <Clock size={20} />,
                  title: "Flexibilidad total",
                  desc: "Grupos pequeños y horarios adaptables a tu itinerario.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--brand-teal)] shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{title}</p>
                    <p className="text-sm text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual decorativo */}
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/cartagenatarde.jpg"
              alt="Cartagena de Indias"
              fill
              className="object-cover object-center scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 gradient-brand opacity-80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8 gap-4">
              <Image
                src="/cataplansinfondo.png"
                alt="CataPlan"
                width={200}
                height={70}
                className="h-16 w-auto object-contain brightness-0 invert"
              />
              <p className="text-xl font-semibold">10 Experiencias únicas</p>
              <p className="text-white/80 text-sm max-w-xs">
                Desde {formatCOP(50000)} hasta {formatCOP(200000)} por persona.
                Para todos los gustos y presupuestos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section id="contacto" className="py-20 px-4 gradient-brand text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-[var(--font-playfair)] text-4xl md:text-5xl font-bold mb-4">
            ¿Listo para vivir Cartagena?
          </h2>
          <p className="text-white/85 text-lg mb-10">
            Escríbenos por WhatsApp y en minutos tendrás tu experiencia reservada.
          </p>
          <a
            href="https://wa.me/573001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-[var(--brand-teal)] hover:bg-white/90 font-bold px-10 py-4 rounded-full text-lg transition-colors shadow-lg"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#25D366]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Reservar por WhatsApp
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <Image
            src="/cataplansinfondo.png"
            alt="CataPlan"
            width={120}
            height={42}
            className="h-9 w-auto object-contain brightness-0 invert"
          />
          <p>© {new Date().getFullYear()} CataPlan. Todos los derechos reservados.</p>
          <p>Cartagena de Indias, Colombia 🇨🇴</p>
        </div>
      </footer>
    </>
  );
}
