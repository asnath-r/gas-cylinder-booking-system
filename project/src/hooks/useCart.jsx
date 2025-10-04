import { useEffect, useState } from 'react';

const CART_EVENT = 'cart-updated';

// 🧠 Utility functions
export const getCartFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

export const setCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(CART_EVENT)); // 🔄 Notify all listeners
};

// 🔁 Hook for global cart management
export const useCart = () => {
  const [cartItems, setCartItems] = useState(getCartFromLocalStorage());

  // 🔄 Sync with other components on cart update
  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(getCartFromLocalStorage());
    };

    window.addEventListener(CART_EVENT, handleCartUpdate);
    return () => window.removeEventListener(CART_EVENT, handleCartUpdate);
  }, []);

  // ➕ Add to cart with stock validation
  const addToCart = (item) => {
    const cart = getCartFromLocalStorage();
    const index = cart.findIndex(i => i.cylinder_id === item.cylinder_id);

    if (index !== -1) {
      const updatedQty = cart[index].quantity + 1;
      if (updatedQty > item.stock) {
        return { success: false, message: `Only ${item.stock} left in stock.` };
      }
      cart[index].quantity = updatedQty;
    } else {
      if (item.stock < 1) {
        return { success: false, message: 'Out of stock' };
      }
      cart.push({ ...item, quantity: 1 });
    }

    setCartToLocalStorage(cart);
    return { success: true };
  };

  // ❌ Remove an item
  const removeFromCart = (id) => {
    const updated = getCartFromLocalStorage().filter(i => i.cylinder_id !== id);
    setCartToLocalStorage(updated);
  };

  // 🔁 Change quantity with limits
  const updateQuantity = (id, qty) => {
    const cart = getCartFromLocalStorage();
    const item = cart.find(i => i.cylinder_id === id);
    if (!item) return { success: false, message: 'Item not found' };

    if (qty < 1) {
      removeFromCart(id);
      return { success: true };
    }

    if (qty > item.stock) {
      return { success: false, message: `Only ${item.stock} available.` };
    }

    item.quantity = qty;
    setCartToLocalStorage(cart);
    return { success: true };
  };

  // 🧹 Clear all
  const clearCart = () => {
    setCartToLocalStorage([]);
  };

  // 💰 Total cost
  const getTotalCost = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity * parseFloat(item.cost), 0);
  };

  // 🔢 Total items
  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalCost,
    getTotalItems
  };
};
