import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "numisora_cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (coin, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === coin.id);
      if (Number(coin.stock_quantity) < (existing?.quantity || 0) + quantity) return prev;
      if (existing) {
        return prev.map((item) =>
          item.id === coin.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          id: coin.id,
          name: coin.name,
          price: Number(coin.price),
          currency: "EUR",
          photo_url: coin.photo_url,
          country: coin.country,
          year: coin.year,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (coinId) => {
    setItems((prev) => prev.filter((item) => item.id !== coinId));
  };

  const updateQuantity = (coinId, quantity) => {
    const nextQuantity = Number(quantity);
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === coinId ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
      ),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
