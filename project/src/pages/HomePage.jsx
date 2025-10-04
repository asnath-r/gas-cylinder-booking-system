import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Users, ShieldCheck, Truck, ArrowRight, Star, Package } from 'lucide-react';
import Header from '../components/Header';
import CylinderCard from '../components/CylinderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { cylindersAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [cylinders, setCylinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCylinders();
  }, []);

  const fetchCylinders = async () => {
    try {
      const response = await cylindersAPI.getAll();
      setCylinders(response.data);
    } catch (error) {
      console.error('Error fetching cylinders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCylinderClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-2xl">
                <Zap className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Gas Cylinder Booking
              <span className="block text-3xl font-normal text-blue-200 mt-2">
                Made Simple & Secure
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Book your gas cylinders online with ease. Fast delivery, competitive prices, 
              and reliable service for homes and businesses across the city.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center group"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of gas cylinder booking with our premium service
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Same-day delivery available with real-time tracking for your convenience
              </p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                All cylinders are quality-tested and certified for your safety
              </p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Our customer support team is always ready to help you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Cylinders Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Cylinders</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of gas cylinders for all your needs
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : cylinders.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cylinders.slice(0, 8).map((cylinder) => (
                <CylinderCard
                  key={cylinder.cylinder_id}
                  cylinder={cylinder}
                  onClick={handleCylinderClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No cylinders available at the moment</p>
            </div>
          )}

          {!user && cylinders.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Ready to book? Sign in to get started!</p>
              <Link
                to="/login"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In to Book
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-200 mb-2">5000+</div>
              <div className="text-lg">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-200 mb-2">99.9%</div>
              <div className="text-lg">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-200 mb-2">4.8</div>
              <div className="text-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                Customer Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">Gas Cylinder Booking</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Your trusted partner for safe, reliable, and convenient gas cylinder delivery services.
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500">© 2024 Gas Cylinder Booking. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;