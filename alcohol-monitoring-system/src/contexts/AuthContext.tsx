import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
  department?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
  selectDepartment: (department: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (phoneNumber: string, password: string): Promise<void> => {
    // В реальном приложении здесь будет запрос к API
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsAuthenticated(true);
        setUser({
          id: '1',
          name: 'Медицинский работник',
          role: 'medical',
        });
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const selectDepartment = (department: string) => {
    if (user) {
      setUser({
        ...user,
        department,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        selectDepartment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};