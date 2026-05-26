"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn, formatCOP } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────

const bookingSchema = z.object({
  date: z.string().min(1, "Selecciona una fecha"),
  people: z.number().min(1, "Mínimo 1 persona").max(20, "Máximo 20 personas"),
  customerName: z.string().min(2, "Ingresa tu nombre completo"),
  customerEmail: z.string().email("Correo electrónico inválido"),
  customerPhone: z
    .string()
    .min(10, "Mínimo 10 dígitos")
    .regex(/^[0-9+\s-]+$/, { error: "Solo números y + - espacio" }),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface Experience {
  id: string;
  slug: string;
  name: string;
  price: number;
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: "form" | "payment" }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {/* Step 1 */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[var(--brand-teal)] text-white">
          {step === "payment" ? <CheckCircle2 size={16} /> : "1"}
        </div>
        <span
          className={cn(
            "text-sm font-medium hidden sm:block",
            step === "form" ? "text-slate-800" : "text-slate-400",
          )}
        >
          Tus datos
        </span>
      </div>

      {/* Connector */}
      <div className="flex-1 h-px bg-slate-200 relative overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 bg-[var(--brand-teal)] transition-all duration-500",
            step === "payment" ? "w-full" : "w-0",
          )}
        />
      </div>

      {/* Step 2 */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
            step === "payment"
              ? "bg-[var(--brand-teal)] text-white"
              : "bg-slate-200 text-slate-400",
          )}
        >
          2
        </div>
        <span
          className={cn(
            "text-sm font-medium hidden sm:block",
            step === "payment" ? "text-slate-800" : "text-slate-400",
          )}
        >
          Pago
        </span>
      </div>
    </div>
  );
}

// ─── Calendar Picker ─────────────────────────────────────────────────────────

function CalendarPicker({
  value,
  onChange,
  minDate,
  error,
}: {
  value: string;
  onChange: (date: string) => void;
  minDate: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(() =>
    value ? new Date(value + "T12:00:00") : new Date(),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const minDateObj = new Date(minDate + "T00:00:00");
  const todayDate = new Date();

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedDate = value ? new Date(value + "T12:00:00") : null;

  function selectDay(day: Date) {
    onChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
  }

  function isDayDisabled(day: Date) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    const m = new Date(minDateObj);
    m.setHours(0, 0, 0, 0);
    return d < m;
  }

  const displayValue = selectedDate
    ? format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })
    : "Selecciona una fecha";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full border rounded-xl px-4 py-3 text-sm text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white transition-colors",
          error
            ? "border-red-300 focus:ring-red-300"
            : "border-slate-200 hover:border-[var(--brand-teal)]",
          open && !error && "ring-2 ring-[var(--brand-teal)] border-[var(--brand-teal)]",
        )}
      >
        <Calendar size={15} className="text-[var(--brand-teal)] shrink-0" />
        <span className={cn("flex-1", selectedDate ? "text-slate-800" : "text-slate-400")}>
          {displayValue}
        </span>
        <ChevronRight
          size={14}
          className={cn(
            "text-slate-400 transition-transform duration-200 shrink-0",
            open && "rotate-90",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-72">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewMonth(subMonths(viewMonth, 1))}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
            <span className="font-semibold text-slate-800 capitalize text-sm">
              {format(viewMonth, "MMMM yyyy", { locale: es })}
            </span>
            <button
              type="button"
              onClick={() => setViewMonth(addMonths(viewMonth, 1))}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((d) => (
              <span
                key={d}
                className="text-center text-xs text-slate-400 font-medium py-1"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day, i) => {
              const isCurrentMonth = day.getMonth() === viewMonth.getMonth();
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const isToday = isSameDay(day, todayDate);
              const disabled = isDayDisabled(day);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled || !isCurrentMonth}
                  onClick={() => selectDay(day)}
                  aria-label={format(day, "d 'de' MMMM yyyy", { locale: es })}
                  className={cn(
                    "h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                    !isCurrentMonth && "invisible pointer-events-none",
                    isCurrentMonth &&
                      !disabled &&
                      !isSelected &&
                      "hover:bg-[var(--accent)] text-slate-700 cursor-pointer",
                    isSelected && "bg-[var(--brand-teal)] text-white shadow-sm",
                    isToday &&
                      !isSelected &&
                      "border border-[var(--brand-teal)] text-[var(--brand-teal)] font-bold",
                    disabled && isCurrentMonth && "text-slate-300 cursor-not-allowed",
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Booking Form ─────────────────────────────────────────────────────────────

export function BookingForm({ experience }: { experience: Experience }) {
  const [step, setStep] = useState<"form" | "payment">("form");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [totalPaid, setTotalPaid] = useState<number>(0);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { people: 1 },
  });

  const people = watch("people") || 1;
  const total = experience.price * people;

  async function onSubmit(values: BookingFormValues) {
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId: experience.id,
          ...values,
          total: experience.price * values.people,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Error al crear la reserva");
      }

      const { booking } = await res.json();
      setBookingId(booking.id);
      setTotalPaid(booking.total);
      setStep("payment");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo salió mal. Inténtalo de nuevo.");
    }
  }

  if (step === "payment" && bookingId) {
    return (
      <>
        <StepIndicator step="payment" />
        <WompiCheckout
          bookingId={bookingId}
          total={totalPaid}
          experienceName={experience.name}
        />
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <StepIndicator step="form" />

      {/* Fecha y personas */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            <Calendar size={14} className="inline mr-1.5 text-[var(--brand-teal)]" />
            Fecha de la experiencia
          </label>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <CalendarPicker
                value={field.value ?? ""}
                onChange={field.onChange}
                minDate={today}
                error={errors.date?.message}
              />
            )}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            <Users size={14} className="inline mr-1.5 text-[var(--brand-teal)]" />
            Número de personas
          </label>
          <input
            type="number"
            min={1}
            max={20}
            {...register("people", { valueAsNumber: true })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white"
          />
          {errors.people && (
            <p className="text-red-500 text-xs mt-1">{errors.people.message}</p>
          )}
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700">Tus datos</h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            <User size={14} className="inline mr-1.5 text-[var(--brand-teal)]" />
            Nombre completo
          </label>
          <input
            type="text"
            placeholder="Juan García"
            {...register("customerName")}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white"
          />
          {errors.customerName && (
            <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Mail size={14} className="inline mr-1.5 text-[var(--brand-teal)]" />
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="juan@ejemplo.com"
              {...register("customerEmail")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white"
            />
            {errors.customerEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Phone size={14} className="inline mr-1.5 text-[var(--brand-teal)]" />
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              placeholder="+57 300 000 0000"
              {...register("customerPhone")}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white"
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            <MessageSquare size={14} className="inline mr-1.5 text-[var(--brand-teal)]" />
            Notas adicionales (opcional)
          </label>
          <textarea
            rows={3}
            placeholder="Alergias, preferencias, ocasión especial..."
            {...register("notes")}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] bg-white resize-none"
          />
        </div>
      </div>

      {/* Total + submit */}
      <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
        <div className="flex justify-between text-sm text-slate-600">
          <span>
            {formatCOP(experience.price)} × {people} persona{people > 1 ? "s" : ""}
          </span>
          <span className="font-semibold text-slate-800">{formatCOP(total)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-slate-800 border-t border-slate-200 pt-3">
          <span>Total a pagar</span>
          <span className="text-[var(--brand-coral)]">{formatCOP(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--brand-coral)] hover:bg-[var(--brand-coral-dark)] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors text-lg flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 size={20} className="animate-spin" />}
        {isSubmitting ? "Procesando..." : "Continuar al pago"}
      </button>

      <p className="text-xs text-slate-400 text-center">
        Al continuar aceptas nuestros términos y condiciones. Pago procesado por Wompi.
      </p>
    </form>
  );
}

// ─── Wompi Checkout ───────────────────────────────────────────────────────────

function WompiCheckout({
  bookingId,
  total,
  experienceName,
}: {
  bookingId: string;
  total: number;
  experienceName: string;
}) {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "pub_test_placeholder";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const amountInCents = total * 100;
  const redirectUrl = `${appUrl}/reservar/confirmacion`;

  const wompiUrl = new URL("https://checkout.wompi.co/p/");
  wompiUrl.searchParams.set("public-key", publicKey);
  wompiUrl.searchParams.set("currency", "COP");
  wompiUrl.searchParams.set("amount-in-cents", String(amountInCents));
  wompiUrl.searchParams.set("reference", bookingId);
  wompiUrl.searchParams.set("redirect-url", redirectUrl);

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <p className="font-semibold text-green-800">¡Reserva registrada!</p>
        <p className="text-sm text-green-700 mt-1">
          Tu reserva para <strong>{experienceName}</strong> está lista. Completa el pago para
          confirmarla.
        </p>
        <p className="text-xs text-green-600 mt-2 font-mono">Referencia: {bookingId}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-slate-800">Resumen del pago</h3>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Total</span>
          <span className="font-bold text-[var(--brand-coral)] text-lg">{formatCOP(total)}</span>
        </div>
        <p className="text-xs text-slate-400">Acepta PSE, tarjetas débito/crédito y Nequi.</p>
      </div>

      <a
        href={wompiUrl.toString()}
        className="block w-full text-center bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-dark)] text-white font-bold py-4 rounded-xl transition-colors text-lg"
      >
        Pagar con Wompi
      </a>

      <p className="text-xs text-slate-400 text-center">
        Serás redirigido al checkout seguro de Wompi
      </p>
    </div>
  );
}
