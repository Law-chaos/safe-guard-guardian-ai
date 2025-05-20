
import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon, Bell, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/navigation/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { AiChatbot } from '@/components/ui/ai-chatbot';
import AnimatedBackground from '@/components/ui/animated-background';
import { alarmSystem } from '@/lib/alarm-system';

const MainPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sosPressed, setSosPressed] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [userName, setUserName] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Load user name from localStorage if available
  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setUserName(storedName);
    } else if (user?.email) {
      try {
        const savedProfile = localStorage.getItem(`profile_${user.email}`);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.name) {
            setUserName(profile.name);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  }, [user]);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const handleSOS = () => {
    // Start the alarm sound
    alarmSystem.startAlarm();
    setAlarmActive(true);
    
    setSosPressed(true);
    
    toast({
      variant: "destructive",
      title: "SOS Alert Triggered",
      description: "Emergency contacts are being notified of your situation.",
    });
    
    // Reset button animation after animation
    setTimeout(() => {
      setSosPressed(false);
    }, 500);
  };
  
  const handleStopAlarm = () => {
    alarmSystem.stopAlarm();
    setAlarmActive(false);
    
    toast({
      title: "Alarm Stopped",
      description: "SOS alarm has been deactivated.",
    });
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-safeguard-gradient'}`}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Header */}
      <header className="p-4 flex justify-between items-center relative z-10">
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
      <main className="container mx-auto p-4 flex flex-col items-center justify-center mt-8 relative z-10">
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {userName || (user?.email ? user.email.split('@')[0] : 'Friend')}
          </h1>
          <p>Your safety is our priority</p>
        </div>
        
        {/* Map Placeholder */}
        <div className="w-full max-w-md h-64 bg-white bg-opacity-20 rounded-lg mb-8 flex items-center justify-center backdrop-blur-sm">
          <p className="text-white">Map View (Location tracking)</p>
        </div>
        
        {/* SOS Button and Stop Alarm Button */}
        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={handleSOS}
            disabled={alarmActive}
            className={`
              w-40 h-40 rounded-full bg-red-600 text-white font-bold text-3xl
              shadow-lg flex items-center justify-center
              hover:bg-red-700 active:bg-red-800
              transition-transform duration-200
              ${sosPressed ? 'transform scale-95' : ''}
              ${alarmActive ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            SOS
          </button>
          
          {alarmActive && (
            <button
              onClick={handleStopAlarm}
              className="mt-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-bold animate-pulse"
            >
              <XCircle size={20} />
              STOP ALARM
            </button>
          )}
          
          <p className="text-white text-center mt-4">
            {alarmActive 
              ? 'Alarm active - click STOP to deactivate' 
              : 'Press in case of emergency'}
          </p>
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
