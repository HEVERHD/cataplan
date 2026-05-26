import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/public/cart-drawer";
import { Navbar } from "@/components/public/navbar";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <WhatsAppButton />
      <CartDrawer />
    </CartProvider>
  );
}
