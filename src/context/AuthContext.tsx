
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('safeguardUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('safeguardUser');
      }
    }
  }, []);

  // Mock user database as we don't have backend
  const getUserDatabase = (): Record<string, { password: string }> => {
    const usersJson = localStorage.getItem('safeguardUsers');
    return usersJson ? JSON.parse(usersJson) : {};
  };

  const saveUserDatabase = (users: Record<string, { password: string }>) => {
    localStorage.setItem('safeguardUsers', JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getUserDatabase();
      
      if (users[email] && users[email].password === password) {
        const userData = { email };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('safeguardUser', JSON.stringify(userData));
        
        toast({
          title: "Login Successful",
          description: "Welcome back to SafeGuard!",
        });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: "Passwords do not match",
        });
        return false;
      }

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getUserDatabase();
      
      if (users[email]) {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: "Email already in use",
        });
        return false;
      }
      
      // Add new user
      users[email] = { password };
      saveUserDatabase(users);
      
      toast({
        title: "Signup Successful",
        description: "Your account has been created!",
      });
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: "An unexpected error occurred",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('safeguardUser');
    navigate('/login');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
