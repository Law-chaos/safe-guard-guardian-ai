
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import AppIcon from '@/components/icons/AppIcon';

const WelcomePage = () => {
  const navigate = useNavigate();
  
  return (
    <Layout className="flex flex-col items-center justify-between py-20 px-6">
      <div className="w-full max-w-md animate-fade-in">
        <AppIcon className="w-24 h-24 mx-auto mb-8" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Hi Fellow Being!</h1>
          <p className="text-xl text-white opacity-90">Ensuring everything is secure...</p>
        </div>
        
        <div className="absolute bottom-16 left-0 right-0 flex justify-center">
          <Button 
            onClick={() => navigate('/login')}
            size="lg"
            className="bg-white text-safeguard-primary hover:bg-gray-100 font-bold text-lg px-8 py-6"
          >
            Let's Get Started
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default WelcomePage;
