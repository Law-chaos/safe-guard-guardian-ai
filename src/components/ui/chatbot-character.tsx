
import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

interface ChatbotCharacterProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const ChatbotCharacter: React.FC<ChatbotCharacterProps> = ({ isExpanded, onToggleExpand }) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  
  // Bounce animation on initial load
  useEffect(() => {
    setIsBouncing(true);
    setTimeout(() => {
      setIsBouncing(false);
      setShowGreeting(true);
    }, 1000);
    
    // Hide greeting after some time
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Random movements
  useEffect(() => {
    if (isExpanded) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 500);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isExpanded]);
  
  return (
    <div className="relative">
      {showGreeting && !isExpanded && (
        <div className="absolute -top-16 right-0 bg-white rounded-lg p-3 shadow-lg animate-fade-in">
          <div className="arrow-down"></div>
          <p className="text-sm">Hi! Complete your profile for better assistance!</p>
        </div>
      )}
      
      <button
        onClick={onToggleExpand}
        className={`
          h-12 w-12 rounded-full bg-safeguard-primary text-white shadow-lg
          flex items-center justify-center transition-all duration-300
          hover:bg-safeguard-primary/90
          ${isBouncing ? 'animate-bounce' : ''}
          ${isExpanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        <Bot className="h-6 w-6" />
      </button>
      
      <style dangerouslySetInnerHTML={{__html: `
        .arrow-down {
          position: absolute;
          bottom: -8px;
          right: 12px;
          width: 0; 
          height: 0; 
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid white;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default ChatbotCharacter;
