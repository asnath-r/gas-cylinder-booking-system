// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Zap, LogOut, User, ShoppingCart } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import NotificationBell from './NotificationBell';

// const Header = ({ showAuth = true, cartItemCount = 0, onCartClick, bookings = [] }) => {
//   const { user, isAdmin, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <header className="bg-white shadow-lg border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
//             <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
//               <Zap className="h-6 w-6 text-white" />
//             </div>
//             <span className="font-bold text-xl text-gray-900">Gas Cylinder Booking</span>
//           </Link>

//           {showAuth && (
//             <div className="flex items-center space-x-4">
//               {user ? (
//                 <div className="flex items-center space-x-4">
//                   {!isAdmin && (
//                     <>
//                       <NotificationBell bookings={bookings} />
//                       <button
//                         onClick={onCartClick}
//                         className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
//                       >
//                         <ShoppingCart className="h-6 w-6" />
//                         {cartItemCount > 0 && (
//                           <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                             {cartItemCount}
//                           </span>
//                         )}
//                       </button>
//                     </>
//                   )}
//                   <div className="flex items-center space-x-2 text-gray-700">
//                     <User className="h-4 w-4" />
//                     <span className="font-medium">{user.name}</span>
//                     {isAdmin && (
//                       <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
//                         Admin
//                       </span>
//                     )}
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     <LogOut className="h-4 w-4" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-3">
//                   <Link
//                     to="/login"
//                     className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
//                   >
//                     User Login
//                   </Link>
//                   <Link
//                     to="/admin-login"
//                     className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
//                   >
//                     Admin Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Register
//                   </Link>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, LogOut, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Header = ({ showAuth = true, cartItemCount = 0, onCartClick, bookings = [] }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Gas Cylinder Booking</span>
          </Link>

          {showAuth && (
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {!isAdmin && (
                    <>
                      <NotificationBell bookings={bookings} />
                      <button
                        onClick={onCartClick}
                        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ShoppingCart className="h-6 w-6" />
                        {cartItemCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        )}
                      </button>
                    </>
                  )}
                  {/* User Info */}
                  {/* <div className="flex items-center space-x-2 text-gray-700">
                    <User className="h-4 w-4" />
                    <span className="font-medium">
                      {user.name || 'User'}
                    </span>
                    {isAdmin && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div> */}
                  <div className="flex items-center space-x-2 text-gray-700">
  <User className="h-4 w-4" />
  <span className="font-medium">
    {user?.name || (isAdmin ? 'Admin' : 'User')}
  </span>
  {isAdmin && (
    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
      Admin
    </span>
  )}
</div>


                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    User Login
                  </Link>
                  <Link
                    to="/admin-login"
                    className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Admin Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
