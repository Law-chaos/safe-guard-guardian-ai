
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import SplashScreen from "./screens/SplashScreen";
import WelcomePage from "./screens/WelcomePage";
import LoginPage from "./screens/LoginPage";
import SignupPage from "./screens/SignupPage";
import MainPage from "./screens/MainPage";
import ProfilePage from "./screens/ProfilePage";
import TrustedContactsPage from "./pages/TrustedContactsPage";
import EmergencyContactsPage from "./pages/EmergencyContactsPage";
import SafetyScorePage from "./pages/SafetyScorePage";
import MedicalInfoPage from "./pages/MedicalInfoPage";
import AboutAppPage from "./pages/AboutAppPage";
import SelfDefensePage from "./pages/SelfDefensePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route 
        path="/main" 
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contacts" 
        element={
          <ProtectedRoute>
            <TrustedContactsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/emergency" 
        element={
          <ProtectedRoute>
            <EmergencyContactsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/safety-score" 
        element={
          <ProtectedRoute>
            <SafetyScorePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/medical" 
        element={
          <ProtectedRoute>
            <MedicalInfoPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/about" 
        element={
          <ProtectedRoute>
            <AboutAppPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/self-defense" 
        element={
          <ProtectedRoute>
            <SelfDefensePage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
