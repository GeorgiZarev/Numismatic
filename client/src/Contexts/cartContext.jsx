import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { availableForSize, cartItemKey, hasProductSizes } from "../utils/productSizes";

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

  const addToCart = (coin, quantity = 1, sizeMm = null) => {
    setItems((prev) => {
      if (hasProductSizes(coin) && sizeMm === null) return prev;
      const key = cartItemKey({ id: coin.id, size_mm: sizeMm });
      const existing = prev.find((item) => cartItemKey(item) === key);
      if (availableForSize(coin, sizeMm) < (existing?.quantity || 0) + quantity) return prev;
      if (existing) {
        return prev.map((item) =>
          cartItemKey(item) === key
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
          size_mm: sizeMm,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (key) => {
    setItems((prev) => prev.filter((item) => cartItemKey(item) !== key));
  };

  const updateQuantity = (key, quantity) => {
    const nextQuantity = Number(quantity);
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) return;

    setItems((prev) =>
      prev.map((item) =>
        cartItemKey(item) === key ? { ...item, quantity: nextQuantity } : item
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
