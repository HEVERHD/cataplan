import { Resend } from "resend";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCOP } from "@/lib/utils";

const FROM = process.env.RESEND_FROM_EMAIL ?? "CataPlan <onboarding@resend.dev>";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";

export interface BookingConfirmationData {
  customerName: string;
  customerEmail: string;
  experienceName: string;
  date: Date;
  people: number;
  total: number;
  bookingId: string;
}

export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const formattedDate = format(data.date, "EEEE d 'de' MMMM, yyyy", { locale: es });
  const shortId = data.bookingId.slice(0, 12).toUpperCase();

  const waText = encodeURIComponent(
    `Hola, confirmé mi reserva para "${data.experienceName}" (Ref: ${shortId}). ¿Qué debo saber para el día?`,
  );
  const waUrl = `https://wa.me/${WHATSAPP}?text=${waText}`;

  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `¡Reserva confirmada! — ${data.experienceName}`,
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reserva Confirmada — CataPlan</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:540px;" cellpadding="0" cellspacing="0">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);border-radius:16px 16px 0 0;padding:36px 32px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">CataPlan</p>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">Experiencias auténticas en Cartagena</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px 0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <!-- Check icon -->
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;background:#d1fae5;">
                  <span style="font-size:28px;line-height:1;">✓</span>
                </div>
              </div>
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;text-align:center;">¡Reserva confirmada!</h1>
              <p style="margin:0 0 28px;font-size:15px;color:#64748b;text-align:center;">
                Hola <strong style="color:#1e293b;">${data.customerName}</strong>, tu reserva está lista. ¡Te esperamos!
              </p>

              <!-- Detail card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">Experiencia</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1e293b;">${data.experienceName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">Fecha</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1e293b;text-transform:capitalize;">${formattedDate}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">Personas</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1e293b;">${data.people} persona${data.people > 1 ? "s" : ""}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">Total pagado</p>
                    <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#f97316;">${formatCOP(data.total)}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:12px;color:#94a3b8;text-align:center;">
                Referencia: <span style="font-family:monospace;font-size:11px;color:#64748b;">${shortId}</span>
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background:#ffffff;padding:0 32px 32px;text-align:center;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <a href="${waUrl}"
                style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 28px;border-radius:10px;margin-bottom:16px;">
                Contactar por WhatsApp
              </a>
              <p style="margin:0;font-size:12px;color:#94a3b8;">¿Preguntas? Te respondemos en minutos.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:0;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                © ${new Date().getFullYear()} CataPlan · Cartagena, Colombia
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
