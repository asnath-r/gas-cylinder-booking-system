import React, { useState } from 'react';
import { X, MapPin, CreditCard, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PaymentModal from './PaymentModal';
import BillModal from './BillModal';

const BookingModal = ({ isOpen, onClose, cartItems = [], totalCost = 0, onConfirmBooking }) => {
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState({
    area: user?.address || '',
    paymentMethod: 'Cash on Delivery',
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billData, setBillData] = useState(null);

  const processBooking = (paymentInfo = null) => {
    const bookings = cartItems.map(item => ({
      cylinder_id: item.cylinder_id,
      area: bookingData.area,
      quantity: item.quantity,
      total_cost: parseFloat(item.cost) * item.quantity,
      payment_method: bookingData.paymentMethod
    }));

    const newBill = {
      billId: `BILL${Date.now()}`,
      date: new Date().toISOString(),
      customerName: user?.name || 'Customer',
      address: bookingData.area,
      items: cartItems.map(item => ({
        type: item.type,
        quantity: item.quantity,
        cost: parseFloat(item.cost)
      })),
      subtotal: totalCost,
      total: totalCost,
      paymentMethod: bookingData.paymentMethod,
      transactionId: paymentInfo?.transactionId || null,
      paymentStatus: bookingData.paymentMethod === 'Online Payment' ? 'Paid' : 'Pending'
    };

    setBillData(newBill);
    setShowBillModal(true);
    onConfirmBooking(bookings, newBill);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookingData.paymentMethod === 'Online Payment') {
      setShowPaymentModal(true);
    } else {
      processBooking();
    }
  };

  const handlePaymentSuccess = (paymentInfo) => {
    setShowPaymentModal(false);
    processBooking(paymentInfo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Confirm Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Delivery Address
            </label>
            <textarea
              value={bookingData.area}
              onChange={(e) => setBookingData({ ...bookingData, area: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              placeholder="Enter delivery address"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <CreditCard className="inline h-4 w-4 mr-1" />
              Payment Method
            </label>
            <select
              value={bookingData.paymentMethod}
              onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Online Payment">Online Payment</option>
            </select>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm text-gray-700">
              {cartItems.map(item => (
                <div key={item.cylinder_id} className="flex justify-between">
                  <span>{item.type} × {item.quantity}</span>
                  <span>₹{item.cost * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold text-gray-900">
                <span>Total:</span>
                <span>₹{totalCost}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <Truck className="h-5 w-5 mr-2" />
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={totalCost}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Bill Modal */}
      <BillModal
        isOpen={showBillModal}
        onClose={() => {
          setShowBillModal(false);
          onClose();
        }}
        billData={billData}
      />
    </div>
  );
};

export default BookingModal;
