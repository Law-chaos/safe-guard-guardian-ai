
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AppIcon from '@/components/icons/AppIcon';

const SplashScreen = () => {
  return (
    <Layout className="flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <AppIcon className="w-40 h-40 mx-auto mb-8" />
        <h1 className="text-4xl font-bold text-white tracking-wider">SafeGuard</h1>
      </div>
    </Layout>
  );
};

export default SplashScreen;
