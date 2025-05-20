
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const useChatbotProcessor = () => {
  const [conversation, setConversation] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m SafeGuard Assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const processMessage = async (message: string) => {
    // Add user message to conversation
    setConversation(prev => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    // Simple rule-based responses - in a real app, you might use a more sophisticated NLP approach
    let response = "I'm not sure how to help with that. Try asking about safety features or navigation options.";

    const msgLower = message.toLowerCase();
    
    // Check for navigation intents
    if (msgLower.includes('home') || msgLower.includes('main') || msgLower.includes('dashboard')) {
      response = "Taking you to the home screen.";
      setTimeout(() => navigate('/main'), 1000);
    }
    else if (msgLower.includes('profile') || msgLower.includes('account')) {
      response = "Opening your profile.";
      setTimeout(() => navigate('/profile'), 1000);
    }
    else if (msgLower.includes('contacts') && !msgLower.includes('emergency')) {
      response = "Taking you to trusted contacts.";
      setTimeout(() => navigate('/contacts'), 1000);
    }
    else if (msgLower.includes('emergency') || msgLower.includes('help number')) {
      response = "Opening emergency contacts.";
      setTimeout(() => navigate('/emergency'), 1000);
    }
    else if (msgLower.includes('score') || msgLower.includes('achievement')) {
      response = "Checking your safety score.";
      setTimeout(() => navigate('/safety-score'), 1000);
    }
    else if (msgLower.includes('medical') || msgLower.includes('health') || msgLower.includes('doctor')) {
      response = "Opening your medical information.";
      setTimeout(() => navigate('/medical'), 1000);
    }
    else if (msgLower.includes('about') || msgLower.includes('app info')) {
      response = "Opening about page.";
      setTimeout(() => navigate('/about'), 1000);
    }
    else if (msgLower.includes('self defense') || msgLower.includes('defense videos') || msgLower.includes('videos')) {
      response = "Opening self-defense videos.";
      setTimeout(() => navigate('/self-defense'), 1000);
    }
    // Check for action intents
    else if (msgLower.includes('sos') || msgLower.includes('emergency') || msgLower.includes('help me')) {
      response = "SOS alert triggered! Emergency contacts are being notified of your situation.";
      const audio = new Audio('https://www.soundjay.com/buttons/sounds/beep-08b.mp3');
      audio.play();
      toast({
        variant: "destructive",
        title: "SOS Alert Triggered",
        description: "Emergency contacts are being notified of your situation.",
      });
    }
    else if (msgLower.includes('log out') || msgLower.includes('sign out')) {
      response = "Logging you out of SafeGuard.";
      toast({
        title: "Logging out",
        description: "You are being signed out of SafeGuard",
      });
      setTimeout(() => navigate('/login'), 1000);
    }
    // General help
    else if (msgLower.includes('help') || msgLower.includes('what can you do')) {
      response = "I can help you navigate the app or perform quick actions. Try asking me to open a specific page like 'open my profile', 'show emergency contacts', 'show self defense videos', or actions like 'trigger SOS alert'.";
    }

    // Simulate network delay
    setTimeout(() => {
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  return {
    conversation,
    loading,
    processMessage
  };
};
