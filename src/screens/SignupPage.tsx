
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

// Define validation schema with strong password requirements
const signupSchema = z.object({
  username: z.string().min(8, { message: "Username must be at least 8 characters" }),
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
    ),
  confirmPassword: z.string()
});

const signupFormSchema = signupSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupContent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  
  // Form setup with validation
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);
  
  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      // Store username in localStorage for profile
      localStorage.setItem('user_name', data.username);
      
      // Attempt signup
      const success = await signup(data.email, data.password, data.confirmPassword);
      if (success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout className="flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 animate-fade-in dark:bg-gray-800 dark:text-white">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/login')}
            className="mr-2"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-3xl font-bold text-safeguard-primary dark:text-safeguard-secondary">Create Account</h1>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Username (min 8 characters)"
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
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        className="px-4 py-3 text-lg pr-12"
                        {...field}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-6">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <AlertCircle size={16} /> Password Requirements:
              </h4>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>At least 8 characters long</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character</li>
              </ul>
            </div>
          
            <Button 
              type="submit" 
              className="w-full bg-safeguard-primary hover:opacity-90 font-semibold text-lg py-6 dark:bg-safeguard-secondary dark:text-black"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </Layout>
  );
};

const SignupPage = () => {
  return (
    <AuthProvider>
      <SignupContent />
    </AuthProvider>
  );
};

export default SignupPage;
