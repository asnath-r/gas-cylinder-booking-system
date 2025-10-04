import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, MessageSquare, Plus, Edit, Trash2, Eye, Check, X, Star, Upload, Calendar } from 'lucide-react';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { cylindersAPI, bookingsAPI, feedbackAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('cylinders');
  const [cylinders, setCylinders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCylinderModal, setShowCylinderModal] = useState(false);
  const [editingCylinder, setEditingCylinder] = useState(null);
  const [cylinderForm, setCylinderForm] = useState({
    type: '',
    cost: '',
    area: '',
    stock: '',
    image: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cylindersRes, bookingsRes, feedbackRes] = await Promise.all([
        cylindersAPI.getAll(),
        bookingsAPI.getAllBookings(),
        feedbackAPI.getAll()
      ]);
      setCylinders(cylindersRes.data);
      setBookings(bookingsRes.data);
      setFeedback(feedbackRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCylinderSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('type', cylinderForm.type);
      formData.append('cost', cylinderForm.cost);
      formData.append('area', cylinderForm.area);
      formData.append('stock', cylinderForm.stock);
      
      if (cylinderForm.image) {
        formData.append('image', cylinderForm.image);
      }

      if (editingCylinder) {
        await cylindersAPI.update(editingCylinder.cylinder_id, formData);
      } else {
        await cylindersAPI.create(formData);
      }
      
      setShowCylinderModal(false);
      setEditingCylinder(null);
      setCylinderForm({ type: '', cost: '', area: '', stock: '', image: null });
      fetchData();
    } catch (error) {
      console.error('Cylinder operation error:', error);
    }
  };

  const handleEditCylinder = (cylinder) => {
    setEditingCylinder(cylinder);
    setCylinderForm({
      type: cylinder.type,
      cost: cylinder.cost.toString(),
      area: cylinder.area,
      stock: cylinder.stock.toString(),
      image: null
    });
    setShowCylinderModal(true);
  };

  const handleDeleteCylinder = async (id) => {
    if (window.confirm('Are you sure you want to delete this cylinder?')) {
      try {
        await cylindersAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Delete cylinder error:', error);
      }
    }
  };

  const handleManageOrder = async (booking, status) => {
    try {
      await bookingsAPI.manage(booking.booking_id, { status });
      fetchData();
    } catch (error) {
      console.error('Manage order error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage cylinders, orders, and customer feedback</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cylinders</p>
                <p className="text-2xl font-semibold text-gray-900">{cylinders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-teal-100 p-3 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Feedback</p>
                <p className="text-2xl font-semibold text-gray-900">{feedback.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bookings.filter(b => b.status?.toLowerCase() === 'delivered').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('cylinders')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'cylinders'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="h-4 w-4 inline mr-2" />
              Cylinder Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingCart className="h-4 w-4 inline mr-2" />
              Order Management
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'feedback'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Feedback Overview
            </button>
          </div>
        </div>

        {/* Cylinder Management Tab */}
        {activeTab === 'cylinders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Cylinder Management</h2>
              <button
                onClick={() => setShowCylinderModal(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Cylinder
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cylinders.map((cylinder) => (
                      <tr key={cylinder.cylinder_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cylinder.image ? (
                            <img 
                              src={`http://localhost:5000/${cylinder.image}`} 
                              alt={cylinder.type}
                              className="h-12 w-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cylinder.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{cylinder.cost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cylinder.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`${cylinder.stock < 10 ? 'text-red-600' : 'text-green-600'} font-medium`}>
                            {cylinder.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditCylinder(cylinder)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCylinder(cylinder.cylinder_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Order Management Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Management</h2>
            <div className="space-y-4">
              {bookings && bookings.map((booking) => (
                <div key={booking.booking_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.cylinder_type || 'N/A'} - Order #{booking.booking_id}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-gray-600 space-y-1">
                        <p>Address: {booking.address || 'N/A'}</p>
                        <p>Total Cost: ₹{booking.total_cost || 'N/A'}</p>
                        <p>Quantity: {booking.quantity || 1}</p>
                        <p>Payment: {booking.payment_method || 'N/A'}</p>
                        <p>Ordered: {new Date(booking.booking_date).toLocaleDateString()}</p>
                        {booking.delivery_date && (
                          <p>Delivery: {new Date(booking.delivery_date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {booking.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleManageOrder(booking, 'Approved')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleManageOrder(booking, 'Rejected')}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      {booking.status === 'Approved' && (
                        <button
                          onClick={() => bookingsAPI.markDelivered(booking.booking_id).then(() => fetchData())}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(!bookings || bookings.length === 0) && (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feedback Overview Tab */}
        {activeTab === 'feedback' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Feedback</h2>
            <div className="space-y-4">
              {feedback && feedback.map((item) => (
                <div key={item.feedback_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.user_name || 'Anonymous'}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">({item.rating}/5)</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      Booking #{item.booking_id}
                    </span>
                  </div>
                  <p className="text-gray-700">{item.comments}</p>
                </div>
              ))}

              {(!feedback || feedback.length === 0) && (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600">No feedback yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cylinder Modal */}
      {showCylinderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCylinder ? 'Edit Cylinder' : 'Add New Cylinder'}
            </h3>
            <form onSubmit={handleCylinderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cylinder Image
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCylinderForm({ ...cylinderForm, image: e.target.files[0] })}
                    className="hidden"
                    id="cylinder-image"
                  />
                  <label
                    htmlFor="cylinder-image"
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </label>
                  {cylinderForm.image && (
                    <span className="text-sm text-gray-600">{cylinderForm.image.name}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cylinder Type
                </label>
                <input
                  type="text"
                  value={cylinderForm.type}
                  onChange={(e) => setCylinderForm({ ...cylinderForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., LPG Domestic"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (₹)
                </label>
                <input
                  type="number"
                  value={cylinderForm.cost}
                  onChange={(e) => setCylinderForm({ ...cylinderForm, cost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area
                </label>
                <input
                  type="text"
                  value={cylinderForm.area}
                  onChange={(e) => setCylinderForm({ ...cylinderForm, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Downtown"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={cylinderForm.stock}
                  onChange={(e) => setCylinderForm({ ...cylinderForm, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {editingCylinder ? 'Update' : 'Add'} Cylinder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCylinderModal(false);
                    setEditingCylinder(null);
                    setCylinderForm({ type: '', cost: '', area: '', stock: '', image: null });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
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

export default AdminDashboard;