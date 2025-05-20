
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoginCarousel } from '@/components/ui/login-carousel';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine(
      (value) => /[A-Z]/.test(value),
      { message: "Password must contain at least one uppercase letter" }
    )
    .refine(
      (value) => /[a-z]/.test(value),
      { message: "Password must contain at least one lowercase letter" }
    )
    .refine(
      (value) => /[0-9]/.test(value),
      { message: "Password must contain at least one number" }
    )
    .refine(
      (value) => /[^A-Za-z0-9]/.test(value),
      { message: "Password must contain at least one special character" }
    )
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginContent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Form setup with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Save the user's name to localStorage for profile
      localStorage.setItem('user_name', data.name);
      
      // Attempt login
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout className="flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow-xl p-8 animate-fade-in">
        {/* Login Form */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-safeguard-primary">Login to Your Account</h1>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Your Name"
                        className="px-4 py-3 text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Email"
                        className="px-4 py-3 text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="px-4 py-3 text-lg pr-12"
                          {...field}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-safeguard-primary hover:opacity-90 font-semibold text-lg py-6"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
          
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
        
        {/* Feature Carousel */}
        <div className="hidden md:block">
          <LoginCarousel />
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
