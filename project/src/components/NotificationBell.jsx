import React, { useState, useEffect } from 'react';
import { Bell, X, Calendar, CheckCircle } from 'lucide-react';

const NotificationBell = ({ bookings = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load read notification IDs from localStorage
  const getStoredReadIds = () => {
    try {
      return JSON.parse(localStorage.getItem('readNotifications')) || [];
    } catch {
      return [];
    }
  };

  const saveReadIds = (ids) => {
    localStorage.setItem('readNotifications', JSON.stringify(ids));
  };

  useEffect(() => {
    const storedReadIds = getStoredReadIds();

    const newNotifications = bookings
      .filter(booking => booking.status === 'Approved' && booking.delivery_date)
      .map(booking => ({
        id: `approved-${booking.booking_id}`,
        type: 'delivery',
        title: 'Delivery Scheduled',
        message: `Your ${booking.cylinder_type} will be delivered on ${new Date(booking.delivery_date).toLocaleDateString()}`,
        date: booking.delivery_date,
        read: storedReadIds.includes(`approved-${booking.booking_id}`)
      }));

    const deliveredNotifications = bookings
      .filter(booking => booking.status === 'Delivered')
      .map(booking => ({
        id: `delivered-${booking.booking_id}`,
        type: 'delivered',
        title: 'Order Delivered',
        message: `Your ${booking.cylinder_type} has been delivered. Please provide feedback.`,
        date: booking.delivery_date,
        read: storedReadIds.includes(`delivered-${booking.booking_id}`)
      }));

    setNotifications([...newNotifications, ...deliveredNotifications]);
  }, [bookings]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    const readIds = getStoredReadIds();
    if (!readIds.includes(notificationId)) {
      const updated = [...readIds, notificationId];
      saveReadIds(updated);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const uniqueIds = Array.from(new Set([...getStoredReadIds(), ...allIds]));
    saveReadIds(uniqueIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        notification.type === 'delivery'
                          ? 'bg-blue-100'
                          : 'bg-green-100'
                      }`}
                    >
                      {notification.type === 'delivery' ? (
                        <Calendar className="h-4 w-4 text-blue-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.date).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
