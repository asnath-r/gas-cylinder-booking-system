// // import React, { useState, useEffect } from 'react';
// // import {
// //   Clock,
// //   CheckCircle,
// //   XCircle,
// //   Star,
// //   MessageSquare
// // } from 'lucide-react';
// // import Header from '../components/Header';
// // import CylinderCard from '../components/CylinderCard';
// // import Cart from '../components/Cart';
// // import BookingModal from '../components/BookingModal';
// // import LoadingSpinner from '../components/LoadingSpinner';
// // import { cylindersAPI, bookingsAPI, feedbackAPI, cartAPI } from '../utils/api';
// // import toast from 'react-hot-toast';
// // import PaymentModal from '../components/PaymentModal';
// // import BillModal from '../components/BillModal';
// // import { useCart } from '../hooks/useCart';

// // const UserDashboard = () => {
// //   const [activeTab, setActiveTab] = useState('cylinders');
// //   const [cylinders, setCylinders] = useState([]);
// //   const [bookings, setBookings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [filterArea, setFilterArea] = useState('');
// //   const [filterType, setFilterType] = useState('');
// //   const [showCart, setShowCart] = useState(false);
// //   const [showBookingModal, setShowBookingModal] = useState(false);
// //   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
// //   const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });
// //   const [selectedBookingId, setSelectedBookingId] = useState(null);
// //   const [userFeedback, setUserFeedback] = useState([]);
// //   const [showPaymentModal, setShowPaymentModal] = useState(false);
// //   const [showBillModal, setShowBillModal] = useState(false);
// //   const [selectedBillData, setSelectedBillData] = useState(null);
// //   const [selectedCylinder, setSelectedCylinder] = useState(null);
// //   const { cartItems, addToCart, clearCart } = useCart(); // ✅ FIXED

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const fetchData = async () => {
// //     try {
// //       setLoading(true);
// //       const [cylindersRes, bookingsRes, feedbackRes] = await Promise.all([
// //         cylindersAPI.getAll(),
// //         bookingsAPI.getUserBookings(),
// //         feedbackAPI.getUserFeedback()
// //       ]);

// //       setCylinders(cylindersRes.data);
// //       setBookings(bookingsRes.data);
// //       setUserFeedback(Array.isArray(feedbackRes?.data) ? feedbackRes.data : []);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const hasFeedback = (bookingId) => {
// //     return userFeedback?.some(fb => fb.booking_id === bookingId);
// //   };

// //   const handleAddToCart = (cylinder) => {
// //     const result = addToCart(cylinder);
// //     if (!result.success) {
// //       toast.error(result.message);
// //     } else {
// //       toast.success('Added to cart!');
// //     }
// //   };

// //   const handleCheckout = () => {
// //     setShowBookingModal(true);
// //   };

// //   const handleConfirmBooking = async (bookings, billData = null) => {
// //     try {
// //       for (const booking of bookings) {
// //         await bookingsAPI.create({
// //           cylinder_id: booking.cylinder_id,
// //           area: booking.area,
// //           quantity: booking.quantity,
// //           total_cost: booking.total_cost,
// //           payment_method: booking.payment_method
// //         });
// //       }

// //       cartAPI.clearCart();
// //       clearCart(); // ✅ FIXED
// //       setShowBookingModal(false);

// //       if (billData) {
// //         setSelectedBillData(billData);
// //         setShowBillModal(true);
// //       }

// //       fetchData();
// //       toast.success("Booking successful!");
// //     } catch (error) {
// //       toast.error("Booking failed.");
// //       console.error('Booking error:', error);
// //     }
// //   };

// //   const handleCancelBooking = async (bookingId) => {
// //     if (window.confirm('Are you sure you want to cancel this booking?')) {
// //       try {
// //         await bookingsAPI.cancel(bookingId);
// //         fetchData();
// //       } catch (error) {
// //         console.error('Cancel booking error:', error);
// //       }
// //     }
// //   };

// //   const handlePaymentSuccess = async (paymentDetails) => {
// //     try {
// //       for (const item of cartItems) {
// //         await bookingsAPI.create({
// //           cylinder_id: item.cylinder_id,
// //           area: item.area,
// //           quantity: item.quantity,
// //           total_cost: item.cost * item.quantity,
// //           payment_method: paymentDetails.method,
// //         });
// //       }

// //       const totalCost = cartItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);
// //       const tax = Math.round(totalCost * 0.18 * 100) / 100;

// //       const billData = {
// //         billId: `BILL${Date.now()}`,
// //         date: new Date().toISOString(),
// //         customerName: "Current User", // Replace with actual user data if needed
// //         address: cartItems[0]?.area || "N/A",
// //         items: cartItems.map(item => ({
// //           type: item.type,
// //           quantity: item.quantity,
// //           cost: item.cost
// //         })),
// //         subtotal: totalCost,
// //         tax: tax,
// //         total: totalCost + tax,
// //         paymentMethod: paymentDetails.method,
// //         transactionId: paymentDetails.transactionId || null,
// //         paymentStatus: 'Paid'
// //       };

// //       setSelectedBillData(billData);
// //       setShowPaymentModal(false);
// //       setShowBillModal(true);
// //       cartAPI.clearCart();
// //       clearCart(); // ✅ FIXED
// //       fetchData();
// //     } catch (error) {
// //       toast.error("Booking failed.");
// //       console.error('Payment Success Handler Error:', error);
// //     }
// //   };

// //   const handleBookNow = (cylinder) => {
// //     const cylinderWithQuantity = { ...cylinder, quantity: 1 };
// //     setSelectedCylinder(cylinderWithQuantity);
// //     setShowBookingModal(true);
// //   };

// //   const handleSubmitFeedback = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await feedbackAPI.submit(selectedBookingId, {
// //         rating: feedbackForm.rating,
// //         comments: feedbackForm.comment
// //       });

// //       toast.success('Thank you for your feedback!');
// //       setShowFeedbackModal(false);
// //       setFeedbackForm({ rating: 5, comment: '' });
// //       setSelectedBookingId(null);
// //       fetchData();
// //     } catch (error) {
// //       console.error('Feedback error:', error);
// //       toast.error(error.response?.data?.message || 'Feedback already submitted.');
// //     }
// //   };

// //   const openFeedbackModal = (bookingId) => {
// //     setSelectedBookingId(bookingId);
// //     setShowFeedbackModal(true);
// //   };

// //   const filteredCylinders = cylinders.filter(cylinder =>
// //     (filterArea === '' || cylinder.area.toLowerCase().includes(filterArea.toLowerCase())) &&
// //     (filterType === '' || cylinder.type.toLowerCase().includes(filterType.toLowerCase()))
// //   );

// //   const getFilteredBookings = (status) => {
// //     return bookings?.filter(booking => {
// //       const bookingStatus = booking.status?.toLowerCase();
// //       if (status === 'waiting') return bookingStatus === 'pending';
// //       if (status === 'approved') return bookingStatus === 'approved';
// //       if (status === 'delivered') return bookingStatus === 'delivered';
// //       return true;
// //     }) || [];
// //   };

// //   const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50">
// //         <Header cartItemCount={cartItemCount} onCartClick={() => setShowCart(true)} bookings={bookings} />
// //         <div className="flex items-center justify-center py-20">
// //           <LoadingSpinner size="lg" />
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Header cartItemCount={cartItemCount} onCartClick={() => setShowCart(true)} bookings={bookings} />

// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>

// //         <div className="flex gap-2 overflow-x-auto mb-6 border-b">
// //           {['cylinders', 'waiting', 'approved', 'delivered', 'feedback'].map(tab => (
// //             <button
// //               key={tab}
// //               onClick={() => setActiveTab(tab)}
// //               className={`px-4 py-2 font-medium text-sm border-b-2 ${
// //                 activeTab === tab
// //                   ? 'border-blue-500 text-blue-600'
// //                   : 'border-transparent text-gray-500 hover:text-gray-700'
// //               }`}
// //             >
// //               {tab.charAt(0).toUpperCase() + tab.slice(1)}
// //               {['waiting', 'approved', 'delivered'].includes(tab) && (
// //                 <> ({getFilteredBookings(tab).length})</>
// //               )}
// //             </button>
// //           ))}
// //         </div>

// //         {activeTab === 'cylinders' && (
// //           <>
// //             <div className="flex gap-4 mb-4">
// //               <input
// //                 type="text"
// //                 placeholder="Filter by area"
// //                 value={filterArea}
// //                 onChange={(e) => setFilterArea(e.target.value)}
// //                 className="border rounded px-4 py-2"
// //               />
// //               <input
// //                 type="text"
// //                 placeholder="Filter by type"
// //                 value={filterType}
// //                 onChange={(e) => setFilterType(e.target.value)}
// //                 className="border rounded px-4 py-2"
// //               />
// //             </div>

// //             {filteredCylinders.length === 0 ? (
// //               <p>No cylinders match your filters.</p>
// //             ) : (
// //               <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// //                 {filteredCylinders.map(cylinder => (
// //                   <CylinderCard
// //                     key={cylinder.cylinder_id}
// //                     cylinder={cylinder}
// //                     onClick={() => handleAddToCart(cylinder)}
// //                     showBookButton
// //                   />
// //                 ))}
// //               </div>
// //             )}
// //           </>
// //         )}

// //         {['waiting', 'approved', 'delivered'].includes(activeTab) && (
// //           <div className="space-y-4">
// //             {getFilteredBookings(activeTab).map(booking => (
// //               <div key={booking.booking_id} className="bg-white p-4 rounded shadow">
// //                 <div className="flex justify-between items-center">
// //                   <div>
// //                     <h2 className="font-semibold">{booking.cylinder_type || 'Cylinder'}</h2>
// //                     <p>Area: {booking.area}</p>
// //                     <p>Quantity: {booking.quantity}</p>
// //                     <p>Total: ₹{booking.total_cost}</p>
// //                     <p>Status: {booking.status}</p>
// //                   </div>
// //                   <div className="space-x-2">
// //                     {booking.status?.toLowerCase() === 'pending' && (
// //                       <button
// //                         onClick={() => handleCancelBooking(booking.booking_id)}
// //                         className="px-3 py-1 bg-red-600 text-white rounded"
// //                       >
// //                         Cancel
// //                       </button>
// //                     )}
// //                     {booking.status?.toLowerCase() === 'delivered' &&
// //                       (hasFeedback(booking.booking_id) ? (
// //                         <p className="text-green-600 font-medium">Feedback already submitted</p>
// //                       ) : (
// //                         <button
// //                           onClick={() => openFeedbackModal(booking.booking_id)}
// //                           className="px-3 py-1 bg-blue-600 text-white rounded"
// //                         >
// //                           Feedback
// //                         </button>
// //                       ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {activeTab === 'feedback' && (
// //           <div className="space-y-4">
// //             {Array.isArray(userFeedback) && userFeedback.length === 0 ? (
// //               <div className="text-center bg-white p-6 rounded shadow">
// //                 <MessageSquare className="mx-auto mb-2 text-gray-400 h-10 w-10" />
// //                 <h2 className="font-semibold text-lg mb-2">No feedback submitted yet</h2>
// //                 <p className="text-gray-600">You can submit feedback after your cylinder is delivered.</p>
// //               </div>
// //             ) : (
// //               userFeedback.map((fb) => (
// //                 <div key={fb.feedback_id} className="bg-white p-4 rounded shadow">
// //                   <div className="flex items-center justify-between">
// //                     <div>
// //                       <p className="text-sm text-gray-600">Booking ID: {fb.booking_id}</p>
// //                       <p className="text-lg font-semibold text-gray-800">Rating: {fb.rating} / 5</p>
// //                       <p className="text-gray-700">{fb.comments}</p>
// //                     </div>
// //                     <div className="flex gap-1">
// //                       {[...Array(5)].map((_, i) => (
// //                         <Star key={i} className={`w-5 h-5 ${i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         )}
// //       </div>

// //       <Cart isOpen={showCart} onClose={() => setShowCart(false)} onCheckout={handleCheckout} />

// //       <BookingModal
// //         isOpen={showBookingModal}
// //         onClose={() => setShowBookingModal(false)}
// //         cartItems={cartItems}
// //         totalCost={cartItems.reduce((total, item) => total + item.quantity * item.cost, 0)}
// //         onConfirmBooking={handleConfirmBooking}
// //       />

// //       <PaymentModal
// //         isOpen={showPaymentModal}
// //         onClose={() => setShowPaymentModal(false)}
// //         cartItems={cartItems}
// //         totalAmount={cartItems.reduce((total, item) => total + item.cost * item.quantity, 0)}
// //         onPaymentSuccess={handlePaymentSuccess}
// //       />

// //       <BillModal
// //         isOpen={showBillModal}
// //         onClose={() => {
// //           setShowBillModal(false);
// //           setSelectedBillData(null);
// //         }}
// //         billData={selectedBillData}
// //       />

// //       {showFeedbackModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-xl max-w-md w-full p-6">
// //             <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Feedback</h3>
// //             <form onSubmit={handleSubmitFeedback} className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
// //                 <div className="flex space-x-1">
// //                   {[1, 2, 3, 4, 5].map((star) => (
// //                     <button
// //                       key={star}
// //                       type="button"
// //                       onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
// //                       className={`p-1 ${star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
// //                     >
// //                       <Star className="h-6 w-6 fill-current" />
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
// //                 <textarea
// //                   value={feedbackForm.comment}
// //                   onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
// //                   rows={4}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
// //                   placeholder="Share your experience..."
// //                   required
// //                 />
// //               </div>

// //               <div className="flex space-x-3">
// //                 <button
// //                   type="submit"
// //                   className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg"
// //                 >
// //                   Submit
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowFeedbackModal(false)}
// //                   className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
// //                 >
// //                   Cancel
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserDashboard;


// import React, { useState, useEffect } from 'react';
// import {
//   Clock, CheckCircle, XCircle, Star,
//   MessageSquare, Package, Truck, Filter, Download
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// import Header from '../components/Header';
// import CylinderCard from '../components/CylinderCard';
// import Cart from '../components/Cart';
// import BookingModal from '../components/BookingModal';
// import PaymentModal from '../components/PaymentModal';
// import BillModal from '../components/BillModal';
// import LoadingSpinner from '../components/LoadingSpinner';

// import { useCart } from '../hooks/useCart';
// import { cylindersAPI, bookingsAPI, feedbackAPI, cartAPI } from '../utils/api';

// const EmptyState = ({ icon: Icon, title, message }) => (
//   <div className="text-center bg-white p-6 rounded shadow">
//     <Icon className="mx-auto mb-2 text-gray-400 h-10 w-10" />
//     <h2 className="font-semibold text-lg mb-2">{title}</h2>
//     <p className="text-gray-600">{message}</p>
//   </div>
// );

// const UserDashboard = () => {
//   const [activeTab, setActiveTab] = useState('cylinders');
//   const [cylinders, setCylinders] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [userFeedback, setUserFeedback] = useState([]);
//   const [filterArea, setFilterArea] = useState('');
//   const [filterType, setFilterType] = useState('');
//   const [loading, setLoading] = useState(true);

//   const [showCart, setShowCart] = useState(false);
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showBillModal, setShowBillModal] = useState(false);
//   const [selectedBillData, setSelectedBillData] = useState(null);

//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });

//   const { cartItems, addToCart, clearCart } = useCart();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [cRes, bRes, fRes] = await Promise.all([
//         cylindersAPI.getAll(),
//         bookingsAPI.getUserBookings(),
//         feedbackAPI.getUserFeedback(),
//       ]);
//       setCylinders(cRes.data || []);
//       setBookings(bRes.data || []);
//       setUserFeedback(fRes.data || []);
//     } catch (err) {
//       toast.error('Error fetching dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasFeedback = (bookingId) => {
//     return userFeedback?.some((fb) => fb.booking_id === bookingId);
//   };

//   const getFilteredBookings = (status) => {
//     return bookings?.filter((b) => b.status?.toLowerCase() === status) || [];
//   };

//   const filteredCylinders = cylinders.filter((c) =>
//     (filterArea === '' || c.area.toLowerCase().includes(filterArea.toLowerCase())) &&
//     (filterType === '' || c.type.toLowerCase().includes(filterType.toLowerCase()))
//   );

//   const handleAddToCart = (cylinder) => {
//     const result = addToCart(cylinder);
//     if (!result.success) {
//       toast.error(result.message);
//     } else {
//       toast.success('Added to cart!');
//     }
//   };

//   const handleConfirmBooking = async (bookings, billData = null) => {
//     try {
//       for (const b of bookings) {
//         await bookingsAPI.create({
//           cylinder_id: b.cylinder_id,
//           area: b.area,
//           quantity: b.quantity,
//           total_cost: b.total_cost,
//           payment_method: b.payment_method
//         });
//       }
//       clearCart();
//       cartAPI.clearCart();
//       setShowBookingModal(false);
//       toast.success('Booking successful!');
//       fetchData();

//       if (billData) {
//         setSelectedBillData(billData);
//         setShowBillModal(true);
//       }
//     } catch (err) {
//       toast.error('Booking failed');
//     }
//   };

//   const handlePaymentSuccess = async (paymentDetails) => {
//     try {
//       for (const item of cartItems) {
//         await bookingsAPI.create({
//           cylinder_id: item.cylinder_id,
//           area: item.area,
//           quantity: item.quantity,
//           total_cost: item.cost * item.quantity,
//           payment_method: paymentDetails.method
//         });
//       }

//       const totalCost = cartItems.reduce((sum, i) => sum + i.quantity * i.cost, 0);
//       const tax = Math.round(totalCost * 0.18 * 100) / 100;

//       const billData = {
//         billId: `BILL${Date.now()}`,
//         date: new Date().toISOString(),
//         customerName: "Current User",
//         address: cartItems[0]?.area || "N/A",
//         items: cartItems.map(i => ({
//           type: i.type,
//           quantity: i.quantity,
//           cost: i.cost
//         })),
//         subtotal: totalCost,
//         tax,
//         total: totalCost + tax,
//         paymentMethod: paymentDetails.method,
//         transactionId: paymentDetails.transactionId || '',
//         paymentStatus: 'Paid'
//       };

//       setSelectedBillData(billData);
//       setShowPaymentModal(false);
//       setShowBillModal(true);
//       clearCart();
//       cartAPI.clearCart();
//       fetchData();
//     } catch (error) {
//       toast.error("Booking failed.");
//     }
//   };

//   const handleCancelBooking = async (bookingId) => {
//     if (window.confirm("Cancel this booking?")) {
//       await bookingsAPI.cancel(bookingId);
//       toast.success("Booking cancelled");
//       fetchData();
//     }
//   };

//   const handleSubmitFeedback = async (e) => {
//     e.preventDefault();
//     try {
//       await feedbackAPI.submit(selectedBookingId, feedbackForm);
//       toast.success('Feedback submitted!');
//       setShowFeedbackModal(false);
//       setFeedbackForm({ rating: 5, comment: '' });
//       setSelectedBookingId(null);
//       fetchData();
//     } catch (err) {
//       toast.error('Already submitted or failed.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex justify-center items-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

// return (
//   <div className="min-h-screen bg-gray-50">
//     <Header
//       cartItemCount={cartItems.reduce((t, i) => t + i.quantity, 0)}
//       onCartClick={() => setShowCart(true)}
//       bookings={bookings}
//     />

//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {/* Tabs */}
//       <div className="flex gap-2 overflow-x-auto mb-6 border-b">
//         {[
//           { key: 'cylinders', label: 'Cylinders', icon: Package },
//           { key: 'waiting', label: 'Waiting', icon: Clock },
//           { key: 'approved', label: 'Approved', icon: CheckCircle },
//           { key: 'delivered', label: 'Delivered', icon: Truck },
//           { key: 'feedback', label: 'Feedback', icon: MessageSquare },
//         ].map(({ key, label, icon: Icon }) => (
//           <button
//             key={key}
//             onClick={() => setActiveTab(key)}
//             className={`px-4 py-2 font-medium text-sm border-b-2 flex items-center gap-1 ${
//               activeTab === key
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             <Icon className="w-4 h-4" />
//             {label}
//             {['waiting', 'approved', 'delivered'].includes(key) && (
//               <span>({getFilteredBookings(key).length})</span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Cylinders Tab */}
//       {activeTab === 'cylinders' && (
//         <>
//           <div className="flex gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Filter by area"
//               value={filterArea}
//               onChange={(e) => setFilterArea(e.target.value)}
//               className="border rounded px-4 py-2"
//             />
//             <input
//               type="text"
//               placeholder="Filter by type"
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="border rounded px-4 py-2"
//             />
//           </div>
//           {filteredCylinders.length === 0 ? (
//             <EmptyState icon={Filter} title="No Results" message="No cylinders match your filters." />
//           ) : (
//             <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {filteredCylinders.map((cylinder) => (
//                 <CylinderCard
//                   key={cylinder.cylinder_id}
//                   cylinder={cylinder}
//                   onClick={() => handleAddToCart(cylinder)}
//                   showBookButton
//                 />
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {/* Bookings Tab */}
//       {['waiting', 'approved', 'delivered'].includes(activeTab) && (
//         <>
//           {getFilteredBookings(activeTab).length === 0 ? (
//             <EmptyState
//               icon={activeTab === 'waiting' ? Clock : activeTab === 'approved' ? CheckCircle : Truck}
//               title={`No ${activeTab} bookings`}
//               message={`You have no ${activeTab} bookings yet.`}
//             />
//           ) : (
//             <div className="space-y-4">
//               {getFilteredBookings(activeTab).map((booking) => (
//                 <div key={booking.booking_id} className="bg-white p-4 rounded shadow">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h2 className="font-semibold">{booking.cylinder_type}</h2>
//                       <p>Area: {booking.area}</p>
//                       <p>Quantity: {booking.quantity}</p>
//                       <p>Total: ₹{booking.total_cost}</p>
//                       <p>Status: {booking.status}</p>
//                     </div>
//                     <div className="space-x-2">
//                       {booking.status.toLowerCase() === 'pending' && (
//                         <button
//                           onClick={() => handleCancelBooking(booking.booking_id)}
//                           className="px-3 py-1 bg-red-600 text-white rounded"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                       {booking.status.toLowerCase() === 'delivered' &&
//                         (hasFeedback(booking.booking_id) ? (
//                           <p className="text-green-600 font-medium">Feedback submitted</p>
//                         ) : (
//                           <button
//                             onClick={() => {
//                               setSelectedBookingId(booking.booking_id);
//                               setShowFeedbackModal(true);
//                             }}
//                             className="px-3 py-1 bg-blue-600 text-white rounded"
//                           >
//                             Feedback
//                           </button>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {/* Feedback Tab */}
//       {activeTab === 'feedback' && (
//         <>
//           {userFeedback.length === 0 ? (
//             <EmptyState
//               icon={MessageSquare}
//               title="No Feedback Yet"
//               message="You can submit feedback after delivery."
//             />
//           ) : (
//             <div className="space-y-4">
//               {userFeedback.map((fb) => (
//                 <div key={fb.feedback_id} className="bg-white p-4 rounded shadow">
//                   <p className="text-sm text-gray-600">Booking ID: {fb.booking_id}</p>
//                   <p className="text-lg font-semibold text-gray-800">Rating: {fb.rating} / 5</p>
//                   <p className="text-gray-700">{fb.comments}</p>
//                   <div className="flex gap-1 mt-1">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className={`w-5 h-5 ${i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>

//     {/* Cart */}
//     <Cart isOpen={showCart} onClose={() => setShowCart(false)} onCheckout={() => setShowBookingModal(true)} />

//     {/* Booking Modal */}
//     <BookingModal
//       isOpen={showBookingModal}
//       onClose={() => setShowBookingModal(false)}
//       cartItems={cartItems}
//       totalCost={cartItems.reduce((t, i) => t + i.quantity * i.cost, 0)}
//       onConfirmBooking={handleConfirmBooking}
//     />

//     {/* Payment Modal */}
//     <PaymentModal
//       isOpen={showPaymentModal}
//       onClose={() => setShowPaymentModal(false)}
//       cartItems={cartItems}
//       totalAmount={cartItems.reduce((t, i) => t + i.quantity * i.cost, 0)}
//       onPaymentSuccess={handlePaymentSuccess}
//     />

//     {/* Bill Modal */}
//     <BillModal
//       isOpen={showBillModal}
//       onClose={() => {
//         setShowBillModal(false);
//         setSelectedBillData(null);
//       }}
//       billData={selectedBillData}
//     />

//     {/* Feedback Modal */}
//     {showFeedbackModal && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-xl max-w-md w-full p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Feedback</h3>
//           <form onSubmit={handleSubmitFeedback} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
//               <div className="flex space-x-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     type="button"
//                     onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
//                     className={`p-1 ${star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                   >
//                     <Star className="h-6 w-6 fill-current" />
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
//               <textarea
//                 value={feedbackForm.comment}
//                 onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 placeholder="Share your experience..."
//                 required
//               />
//             </div>
//             <div className="flex space-x-3">
//               <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg">Submit</button>
//               <button
//                 type="button"
//                 onClick={() => setShowFeedbackModal(false)}
//                 className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     )}
//   </div>
// );
// };


// export default UserDashboard;


import React, { useState, useEffect } from 'react';
import {
  Clock, CheckCircle, XCircle, Star,
  MessageSquare, Package, Truck, Filter, Download
} from 'lucide-react';
import toast from 'react-hot-toast';

import Header from '../components/Header';
import CylinderCard from '../components/CylinderCard';
import Cart from '../components/Cart';
import BookingModal from '../components/BookingModal';
import PaymentModal from '../components/PaymentModal';
import BillModal from '../components/BillModal';
import LoadingSpinner from '../components/LoadingSpinner';

import { useCart } from '../hooks/useCart';
import { cylindersAPI, bookingsAPI, feedbackAPI, cartAPI } from '../utils/api';

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="text-center bg-white p-6 rounded shadow">
    <Icon className="mx-auto mb-2 text-gray-400 h-10 w-10" />
    <h2 className="font-semibold text-lg mb-2">{title}</h2>
    <p className="text-gray-600">{message}</p>
  </div>
);

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('cylinders');
  const [cylinders, setCylinders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [userFeedback, setUserFeedback] = useState([]);
  const [filterArea, setFilterArea] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);

  const [showCart, setShowCart] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBillData, setSelectedBillData] = useState(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });

  const { cartItems, addToCart, clearCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, bRes, fRes] = await Promise.all([
        cylindersAPI.getAll(),
        bookingsAPI.getUserBookings(),
        feedbackAPI.getUserFeedback(),
      ]);
      setCylinders(cRes.data || []);
      setBookings(bRes.data || []);
      setUserFeedback(fRes.data || []);
    } catch (err) {
      toast.error('Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const hasFeedback = (bookingId) => {
    return userFeedback?.some((fb) => fb.booking_id === bookingId);
  };

  // ✅ FIXED: This function now correctly maps the 'waiting' tab to the 'pending' status.
  const getFilteredBookings = (status) => {
    if (status === 'waiting') {
      return bookings?.filter((b) => b.status?.toLowerCase() === 'pending') || [];
    }
    return bookings?.filter((b) => b.status?.toLowerCase() === status) || [];
  };

  const filteredCylinders = cylinders.filter((c) =>
    (filterArea === '' || c.area.toLowerCase().includes(filterArea.toLowerCase())) &&
    (filterType === '' || c.type.toLowerCase().includes(filterType.toLowerCase()))
  );

  const handleAddToCart = (cylinder) => {
    const result = addToCart(cylinder);
    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success('Added to cart!');
    }
  };

  const handleConfirmBooking = async (bookings, billData = null) => {
    try {
      for (const b of bookings) {
        await bookingsAPI.create({
          cylinder_id: b.cylinder_id,
          area: b.area,
          quantity: b.quantity,
          total_cost: b.total_cost,
          payment_method: b.payment_method
        });
      }
      clearCart();
      cartAPI.clearCart();
      setShowBookingModal(false);
      toast.success('Booking successful!');
      fetchData();

      if (billData) {
        setSelectedBillData(billData);
        setShowBillModal(true);
      }
    } catch (err) {
      toast.error('Booking failed');
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      for (const item of cartItems) {
        await bookingsAPI.create({
          cylinder_id: item.cylinder_id,
          area: item.area,
          quantity: item.quantity,
          total_cost: item.cost * item.quantity,
          payment_method: paymentDetails.method
        });
      }

      const totalCost = cartItems.reduce((sum, i) => sum + i.quantity * i.cost, 0);
      const tax = Math.round(totalCost * 0.18 * 100) / 100;

      const billData = {
        billId: `BILL${Date.now()}`,
        date: new Date().toISOString(),
        customerName: "Current User",
        address: cartItems[0]?.area || "N/A",
        items: cartItems.map(i => ({
          type: i.type,
          quantity: i.quantity,
          cost: i.cost
        })),
        subtotal: totalCost,
        tax,
        total: totalCost + tax,
        paymentMethod: paymentDetails.method,
        transactionId: paymentDetails.transactionId || '',
        paymentStatus: 'Paid'
      };

      setSelectedBillData(billData);
      setShowPaymentModal(false);
      setShowBillModal(true);
      clearCart();
      cartAPI.clearCart();
      fetchData();
    } catch (error) {
      toast.error("Booking failed.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Cancel this booking?")) {
      try {
        await bookingsAPI.cancel(bookingId);
        toast.success("Booking cancelled");
        fetchData();
      } catch (err) {
        toast.error("Failed to cancel booking.");
      }
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await feedbackAPI.submit(selectedBookingId, feedbackForm);
      toast.success('Feedback submitted!');
      setShowFeedbackModal(false);
      setFeedbackForm({ rating: 5, comment: '' });
      setSelectedBookingId(null);
      fetchData();
    } catch (err) {
      toast.error('Already submitted or failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gray-50">
    <Header
      cartItemCount={cartItems.reduce((t, i) => t + i.quantity, 0)}
      onCartClick={() => setShowCart(true)}
      bookings={bookings}
    />

    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-6 border-b">
        {[
          { key: 'cylinders', label: 'Cylinders', icon: Package },
          { key: 'waiting', label: 'Waiting', icon: Clock },
          { key: 'approved', label: 'Approved', icon: CheckCircle },
          { key: 'delivered', label: 'Delivered', icon: Truck },
          { key: 'feedback', label: 'Feedback', icon: MessageSquare },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 font-medium text-sm border-b-2 flex items-center gap-1 ${
              activeTab === key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {['waiting', 'approved', 'delivered'].includes(key) && (
              <span>({getFilteredBookings(key).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Cylinders Tab */}
      {activeTab === 'cylinders' && (
        <>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Filter by area"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="border rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="Filter by type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded px-4 py-2"
            />
          </div>
          {filteredCylinders.length === 0 ? (
            <EmptyState icon={Filter} title="No Results" message="No cylinders match your filters." />
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCylinders.map((cylinder) => (
                <CylinderCard
                  key={cylinder.cylinder_id}
                  cylinder={cylinder}
                  onClick={() => handleAddToCart(cylinder)}
                  showBookButton
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Bookings Tabs */}
      {['waiting', 'approved', 'delivered'].includes(activeTab) && (
        <>
          {getFilteredBookings(activeTab).length === 0 ? (
            <EmptyState
              icon={activeTab === 'waiting' ? Clock : activeTab === 'approved' ? CheckCircle : Truck}
              title={`No ${activeTab} bookings`}
              message={`You have no ${activeTab} bookings yet.`}
            />
          ) : (
            <div className="space-y-4">
              {getFilteredBookings(activeTab).map((booking) => (
                <div key={booking.booking_id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold">{booking.cylinder_type}</h2>
                      <p>Area: {booking.area}</p>
                      <p>Quantity: {booking.quantity}</p>
                      <p>Total: ₹{booking.total_cost}</p>
                      <p>Status: {booking.status}</p>
                    </div>
                    <div className="space-x-2">
                      {booking.status.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.booking_id)}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                          Cancel
                        </button>
                      )}
                      {booking.status.toLowerCase() === 'delivered' &&
                        (hasFeedback(booking.booking_id) ? (
                          <p className="text-green-600 font-medium">Feedback submitted</p>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedBookingId(booking.booking_id);
                              setShowFeedbackModal(true);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                          >
                            Feedback
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <>
          {userFeedback.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No Feedback Yet"
              message="You can submit feedback after delivery."
            />
          ) : (
            <div className="space-y-4">
              {userFeedback.map((fb) => (
                <div key={fb.feedback_id} className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-600">Booking ID: {fb.booking_id}</p>
                  <p className="text-lg font-semibold text-gray-800">Rating: {fb.rating} / 5</p>
                  <p className="text-gray-700">{fb.comments}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>

    {/* Modals */}
    <Cart isOpen={showCart} onClose={() => setShowCart(false)} onCheckout={() => setShowBookingModal(true)} />

    <BookingModal
      isOpen={showBookingModal}
      onClose={() => setShowBookingModal(false)}
      cartItems={cartItems}
      totalCost={cartItems.reduce((t, i) => t + i.quantity * i.cost, 0)}
      onConfirmBooking={handleConfirmBooking}
    />

    <PaymentModal
      isOpen={showPaymentModal}
      onClose={() => setShowPaymentModal(false)}
      cartItems={cartItems}
      totalAmount={cartItems.reduce((t, i) => t + i.quantity * i.cost, 0)}
      onPaymentSuccess={handlePaymentSuccess}
    />

    <BillModal
      isOpen={showBillModal}
      onClose={() => {
        setShowBillModal(false);
        setSelectedBillData(null);
      }}
      billData={selectedBillData}
    />

    {showFeedbackModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Feedback</h3>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                    className={`p-1 ${star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
              <textarea
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Share your experience..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg">Submit</button>
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
};


export default UserDashboard;