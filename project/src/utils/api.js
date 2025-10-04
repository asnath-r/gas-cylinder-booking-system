import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  userLogin: async (credentials) => {
    try {
      const response = await api.post('/auth/user/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  
  adminLogin: async (credentials) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Admin login failed');
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
};

// Cylinders API
export const cylindersAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/cylinders');
      return response.data;
    } catch (error) {
      // Check if it's a network error (no response from server)
      if (!error.response) {
        throw new Error('Cannot connect to backend server. Please ensure the server is running on localhost:5000');
      }
      // Server responded with an error
      throw new Error(error.response?.data?.message || 'Failed to fetch cylinders');
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/cylinders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cylinder');
    }
  },
  
  filterByType: async (type) => {
    try {
      const response = await api.get(`/cylinders/filter/by?type=${type}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to filter cylinders');
    }
  },
  
  create: async (formData) => {
    try {
      const response = await api.post('/cylinders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message || 'Cylinder added successfully!');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add cylinder');
    }
  },
  
  update: async (id, formData) => {
    try {
      const response = await api.put(`/cylinders/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message || 'Cylinder updated successfully!');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update cylinder');
    }
  },
  
  partialUpdate: async (id, formData) => {
    try {
      const response = await api.patch(`/cylinders/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message || 'Cylinder updated successfully!');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update cylinder');
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/cylinders/${id}`);
      toast.success(response.data.message || 'Cylinder deleted successfully!');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete cylinder');
    }
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      toast.success(response.data.message || 'Order placed successfully!');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to place order');
    }
  },
  
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },
  
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all bookings');
    }
  },
  
  manage: async (id, data) => {
    try {
      const response = await api.put(`/bookings/${id}/manage`, data);
      toast.success(response.data.message || 'Order updated successfully!');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to manage order');
    }
  },
  
  cancel: async (id) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      toast.success(response.data.message || 'Order cancelled successfully!');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  },

  markDelivered: async (id) => {
    try {
      const response = await api.post(`/bookings/${id}/delivered`);
      toast.success(response.data.message || 'Order marked as delivered!');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark as delivered');
    }
  },
};

// Feedback API
export const feedbackAPI = {
  submit: async (bookingId, feedbackData) => {
    try {
      const response = await api.post(`/feedback/${bookingId}`, feedbackData);
      toast.success(response.data.message || 'Feedback submitted successfully!');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit feedback');
    }
  },
  

  
  getAll: async () => {
    try {
      const response = await api.get('/feedback');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
    }
  },


  getUserFeedback: async () => {
  try {
    const response = await api.get('/feedback/user');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user feedback');
  }
}

};

// Cart API (local storage based)
export const cartAPI = {
  getCart: () => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  },
  
  addToCart: (cylinder, quantity = 1) => {
    const cart = cartAPI.getCart();
    const existingItem = cart.find(item => item.cylinder_id === cylinder.cylinder_id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...cylinder, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
    return cart;
  },
  
  removeFromCart: (cylinderId) => {
    const cart = cartAPI.getCart().filter(item => item.cylinder_id !== cylinderId);
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Removed from cart!');
    return cart;
  },
  
  updateQuantity: (cylinderId, quantity) => {
    const cart = cartAPI.getCart();
    const item = cart.find(item => item.cylinder_id === cylinderId);
    
    if (item) {
      if (quantity <= 0) {
        return cartAPI.removeFromCart(cylinderId);
      }
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
  },
  
  clearCart: () => {
    localStorage.removeItem('cart');
    return [];
  },
};

export default api;