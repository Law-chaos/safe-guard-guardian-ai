
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const LoginContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout className="flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-safeguard-primary">Login to Your Account</h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 text-lg"
            />
          </div>
          
          <div className="space-y-2 relative">
            <Input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 text-lg pr-12"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-safeguard-primary hover:opacity-90 font-semibold text-lg py-6"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="font-bold">New Here?</p>
          <p className="mb-2">Sign Up</p>
          <p className="text-gray-500 mb-4">Your safety is our priority...</p>
          <Button 
            variant="outline"
            onClick={() => navigate('/signup')} 
            className="w-full border-safeguard-primary text-safeguard-primary hover:bg-safeguard-primary hover:text-white"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </Layout>
  );
};

const LoginPage = () => {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
};

export default LoginPage;
