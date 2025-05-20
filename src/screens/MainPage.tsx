
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Sun, Moon, Bell, XCircle, Plus, Minus, Users, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/navigation/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { AiChatbot } from '@/components/ui/ai-chatbot';
import AnimatedBackground from '@/components/ui/animated-background';
import { alarmSystem } from '@/lib/alarm-system';
import MapView from '@/components/ui/map-view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MainPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sosPressed, setSosPressed] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [userName, setUserName] = useState('');
  const [brightness, setBrightness] = useState(100);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Brightness control ref
  const brightnessRef = useRef<HTMLDivElement>(null);
  
  // Apply brightness effect
  useEffect(() => {
    document.documentElement.style.setProperty('--page-brightness', `${brightness}%`);
  }, [brightness]);
  
  // Dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
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
  
  // Example trusted contacts
  const trustedContacts = [
    { id: 1, name: 'Sarah Johnson', avatar: null },
    { id: 2, name: 'Michael Chen', avatar: null },
    { id: 3, name: 'Elena Rodriguez', avatar: null }
  ];
  
  const increaseBrightness = () => {
    setBrightness(prev => Math.min(prev + 10, 150));
  };
  
  const decreaseBrightness = () => {
    setBrightness(prev => Math.max(prev - 10, 50));
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const handleSOS = () => {
    // Start the alarm sound
    alarmSystem.startAlarm("emergency-siren");
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
      {/* Brightness overlay */}
      <div 
        ref={brightnessRef}
        className="fixed inset-0 pointer-events-none z-50 transition-opacity"
        style={{ 
          backgroundColor: brightness > 100 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
          opacity: brightness > 100 ? (brightness - 100) / 50 : (100 - brightness) / 50,
        }}
      />
      
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
      <main className="container mx-auto p-4 flex flex-col items-center justify-center mt-4 relative z-10">
        <div className="text-center text-white mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {userName || (user?.email ? user.email.split('@')[0] : 'Friend')}
          </h1>
          <p>Your safety is our priority</p>
        </div>
        
        {/* Map View */}
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-semibold text-white mb-2">Your Location</h2>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-1 mb-8">
            <MapView className="h-64 md:h-80 w-full" />
          </div>
        </div>
        
        {/* SOS Button and Stop Alarm Button */}
        <div className="mt-6 flex flex-col items-center">
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
              dark:bg-red-700 dark:hover:bg-red-800
            `}
          >
            SOS
          </button>
          
          {alarmActive && (
            <button
              onClick={handleStopAlarm}
              className="mt-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-bold animate-pulse dark:bg-gray-700 dark:hover:bg-gray-600"
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
      
      {/* Custom Sidebar with Profile and Brightness Controls */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        extraContent={
          <>
            {/* Profile Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-safeguard-primary dark:border-safeguard-secondary">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-safeguard-primary text-white dark:bg-safeguard-secondary dark:text-black">
                    {userName ? userName.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{userName || 'User'}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Brightness Controls */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium mb-3">Brightness</h3>
              <div className="flex justify-between items-center">
                <Button 
                  onClick={decreaseBrightness} 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8"
                >
                  <Minus size={16} />
                </Button>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-safeguard-primary dark:bg-safeguard-secondary transition-all"
                    style={{ width: `${(brightness - 50) / 100 * 100}%` }}
                  />
                </div>
                <Button 
                  onClick={increaseBrightness} 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">
                {brightness}%
              </p>
            </div>
            
            {/* Trusted Contacts */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium flex items-center">
                  <Users size={16} className="mr-2" />
                  Trusted Contacts
                </h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Manage
                </Button>
              </div>
              <ul className="space-y-3">
                {trustedContacts.map(contact => (
                  <li key={contact.id} className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar || ''} alt={contact.name} />
                      <AvatarFallback className="text-xs">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{contact.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Self Defense Hub Preview */}
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Shield size={16} className="mr-2" />
                <h3 className="text-sm font-medium">Self Defense Hub</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Learn essential self-defense techniques
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => {
                  setSidebarOpen(false);
                  window.location.href = '/self-defense';
                }}
              >
                View Videos
              </Button>
            </div>
          </>
        }
      />
    </div>
  );
};

export default MainPage;
