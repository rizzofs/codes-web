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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la app
    const savedUser = localStorage.getItem('codes_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('codes_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('AuthContext login called with:', { email, password });
    setLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuarios de prueba (en producción esto vendría de una API)
      const users = [
        {
          id: 1,
          email: 'admin@codes.unlu.edu.ar',
          password: 'admin123',
          name: 'Administrador CODES++',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 2,
          email: 'editor@codes.unlu.edu.ar',
          password: 'editor123',
          name: 'Editor de Contenido',
          role: 'editor',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 3,
          email: 'miembro@codes.unlu.edu.ar',
          password: 'miembro123',
          name: 'Miembro CODES++',
          role: 'member',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        }
      ];

      console.log('Looking for user with email:', email);
      const foundUser = users.find(u => u.email === email && u.password === password);
      console.log('Found user:', foundUser);
      
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          avatar: foundUser.avatar,
          loginTime: new Date().toISOString()
        };
        
        console.log('Setting user data:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('codes_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        console.log('User not found, returning error');
        return { success: false, error: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('codes_user');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_blog'],
      editor: ['read', 'write', 'manage_blog'],
      member: ['read']
    };
    
    return permissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
