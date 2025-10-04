import React from 'react';
import { Package, MapPin, DollarSign, TrendingUp, ShoppingCart, Plus, IndianRupee } from 'lucide-react';

const CylinderCard = ({ cylinder, onClick, showBookButton = false, onAddToCart }) => {
  const isLowStock = cylinder.stock < 10;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-t-xl">
        {cylinder.image ? (
          <img 
            src={`http://localhost:5000/${cylinder.image}`} 
            alt={cylinder.type}
            className="h-48 w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="h-48 bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center" style={{ display: cylinder.image ? 'none' : 'flex' }}>
          <Package className="h-16 w-16 text-white" />
        </div>
        {isLowStock && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{cylinder.type}</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <IndianRupee className="h-4 w-4 mr-2 text-green-600" />
            <span className="font-semibold text-green-600">{cylinder.cost}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
            <span>{cylinder.area}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <TrendingUp className="h-4 w-4 mr-2 text-teal-600" />
            <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-teal-600'}`}>
              {cylinder.stock} in stock
            </span>
          </div>
        </div>

        {showBookButton && (
          <div className="flex space-x-2">
            <button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                onClick(cylinder);
              }}
            >
              Add to Cart
            </button>
            {onAddToCart && (
              <button 
                className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(cylinder);
                }}
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CylinderCard;