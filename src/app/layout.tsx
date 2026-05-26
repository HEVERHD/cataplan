import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CataPlan – Experiencias Únicas en Cartagena",
    template: "%s | CataPlan",
  },
  description:
    "Descubre Cartagena como nunca antes. Experiencias gastronómicas, culturales y de aventura curadas para viajeros auténticos.",
  keywords: ["Cartagena", "turismo", "experiencias", "gastronomía", "Colombia", "viajes"],
  openGraph: {
    title: "CataPlan – Experiencias Únicas en Cartagena",
    description:
      "Descubre Cartagena como nunca antes. Experiencias curadas para viajeros auténticos.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased font-[var(--font-inter)]">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: "0.75rem" },
          }}
        />
      </body>
    </html>
  );
}
