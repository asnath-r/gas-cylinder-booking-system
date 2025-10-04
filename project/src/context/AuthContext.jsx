// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored auth data on app load
//     const storedUser = localStorage.getItem('user');
//     const storedIsAdmin = localStorage.getItem('isAdmin');
    
//     try {
//   if (storedUser && storedUser !== "undefined") {
//     setUser(JSON.parse(storedUser));
//     setIsAdmin(storedIsAdmin === 'true');
//   }
// } catch (error) {
//   console.error("Failed to parse stored user:", error);
//   // Optional: Clean up invalid localStorage entry
//   localStorage.removeItem('user');
//   localStorage.removeItem('isAdmin');
// }

//     setLoading(false);
//   }, []);

//   const login = (userData, adminStatus = false) => {
//     setUser(userData);
//     setIsAdmin(adminStatus);
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('isAdmin', adminStatus.toString());
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAdmin(false);
//     localStorage.removeItem('user');
//     localStorage.removeItem('isAdmin');
//   };

//   const value = {
//     user,
//     isAdmin,
//     login,
//     logout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedIsAdmin = localStorage.getItem('isAdmin');

    try {
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
        setIsAdmin(storedIsAdmin === 'true');
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
    }

    setLoading(false);
  }, []);

  const login = (userData, adminStatus = false) => {
    setUser(userData);
    setIsAdmin(adminStatus);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAdmin', adminStatus.toString());
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
