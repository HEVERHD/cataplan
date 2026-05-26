"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface CartItem {
  experienceId: string;
  slug: string;
  name: string;
  price: number;
  duration: string;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  addItem: (item: CartItem) => void;
  removeItem: (experienceId: string) => void;
  clearCart: () => void;
  isInCart: (experienceId: string) => boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cataplan-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) =>
      prev.some((i) => i.experienceId === item.experienceId) ? prev : [...prev, item],
    );
    setIsOpen(true); // auto-open drawer
  }, []);

  const removeItem = useCallback((experienceId: string) => {
    setItems((prev) => prev.filter((i) => i.experienceId !== experienceId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (experienceId: string) => items.some((i) => i.experienceId === experienceId),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        count: items.length,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        openDrawer: () => setIsOpen(true),
        closeDrawer: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
