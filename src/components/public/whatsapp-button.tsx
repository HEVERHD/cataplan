"use client";

import { MessageCircle } from "lucide-react";

const WA_NUMBER = "573001234567"; // Reemplaza con el número real
const WA_MSG = encodeURIComponent(
  "Hola CataPlan 👋 quiero información sobre sus experiencias en Cartagena."
);

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-4 py-3 font-semibold text-sm group"
    >
      <MessageCircle size={20} className="shrink-0" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
        ¿Hablamos?
      </span>
    </a>
  );
}
