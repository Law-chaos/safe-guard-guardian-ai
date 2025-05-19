
import React, { useState } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/navigation/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { AiChatbot } from '@/components/ui/ai-chatbot';

const MainPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sosPressed, setSosPressed] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const handleSOS = () => {
    // Play alert sound
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/beep-08b.mp3');
    audio.play();
    
    setSosPressed(true);
    
    toast({
      variant: "destructive",
      title: "SOS Alert Triggered",
      description: "Emergency contacts are being notified of your situation.",
    });
    
    // Reset after animation
    setTimeout(() => {
      setSosPressed(false);
    }, 500);
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-safeguard-gradient'}`}>
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="text-white hover:bg-white hover:bg-opacity-20"
        >
          <Menu size={24} />
        </Button>
        
        <div className="text-xl font-bold text-white">SafeGuard</div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleDarkMode}
          className="text-white hover:bg-white hover:bg-opacity-20"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4 flex flex-col items-center justify-center mt-8">
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome, {user?.email}</h1>
          <p>Your safety is our priority</p>
        </div>
        
        {/* Map Placeholder */}
        <div className="w-full max-w-md h-64 bg-white bg-opacity-20 rounded-lg mb-8 flex items-center justify-center">
          <p className="text-white">Map View (Location tracking)</p>
        </div>
        
        {/* SOS Button */}
        <div className="mt-8">
          <button
            onClick={handleSOS}
            className={`
              w-40 h-40 rounded-full bg-red-600 text-white font-bold text-3xl
              shadow-lg flex items-center justify-center
              hover:bg-red-700 active:bg-red-800
              transition-transform duration-200
              ${sosPressed ? 'transform scale-95' : ''}
            `}
          >
            SOS
          </button>
          <p className="text-white text-center mt-4">Press in case of emergency</p>
        </div>
      </main>
      
      {/* AI Chatbot */}
      <AiChatbot />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};

export default MainPage;
