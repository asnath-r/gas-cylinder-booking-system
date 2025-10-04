import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const Cart = ({ isOpen, onClose, onCheckout }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalCost,
    getTotalItems
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Cart ({getTotalItems()} items)
          </h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
              Your cart is empty.
            </div>
          ) : (
            cartItems.map(item => (
              <div
                key={item.cylinder_id}
                className="flex justify-between items-center mb-4 border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.type}</p>
                  <p className="text-sm text-gray-500">₹{item.cost} x {item.quantity}</p>
                  <p className="text-green-600 font-semibold mt-1">₹{item.cost * item.quantity}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.cylinder_id, item.quantity - 1)}
                    className="bg-gray-200 p-1.5 rounded hover:bg-gray-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => {
                      if (item.quantity + 1 > item.stock) {
                        alert(`❌ Only ${item.stock} in stock.`);
                        return;
                      }
                      updateQuantity(item.cylinder_id, item.quantity + 1);
                    }}
                    className="bg-gray-200 p-1.5 rounded hover:bg-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.cylinder_id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <p className="text-lg font-bold text-gray-900">
              Total: ₹{getTotalCost()}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onCheckout(cartItems, getTotalCost());
                  onClose();
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition w-full sm:w-auto"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
