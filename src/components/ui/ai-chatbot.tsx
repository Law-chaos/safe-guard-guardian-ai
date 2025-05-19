
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Send, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';

interface CommandType {
  type: 'navigation' | 'action';
  name: string;
  description: string;
  path?: string;
  action?: () => void;
}

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Hi! I\'m SafeGuard Assistant. How can I help you today?' }
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands: CommandType[] = [
    {
      type: 'navigation',
      name: 'Home',
      description: 'Go to the main screen',
      path: '/main',
    },
    {
      type: 'navigation',
      name: 'Profile',
      description: 'View and edit your profile',
      path: '/profile',
    },
    {
      type: 'navigation',
      name: 'Trusted Contacts',
      description: 'Manage your trusted contacts',
      path: '/contacts',
    },
    {
      type: 'navigation',
      name: 'Emergency Contacts',
      description: 'View emergency contact numbers',
      path: '/emergency',
    },
    {
      type: 'navigation',
      name: 'Safety Score',
      description: 'Check your personal safety score',
      path: '/safety-score',
    },
    {
      type: 'navigation',
      name: 'Medical Information',
      description: 'Manage your medical information',
      path: '/medical',
    },
    {
      type: 'navigation',
      name: 'About',
      description: 'About the SafeGuard app',
      path: '/about',
    },
    {
      type: 'action',
      name: 'Trigger SOS',
      description: 'Send emergency alert to trusted contacts',
      action: () => {
        toast({
          variant: "destructive",
          title: "SOS Alert Triggered",
          description: "Emergency contacts are being notified of your situation.",
        });
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/beep-08b.mp3');
        audio.play();
      },
    },
    {
      type: 'action',
      name: 'Log Out',
      description: 'Sign out of your account',
      action: () => {
        // This is just a placeholder, the actual logout functionality would be handled by your auth system
        toast({
          title: "Logging out",
          description: "You are being signed out of SafeGuard",
        });
        setTimeout(() => navigate('/login'), 1000);
      },
    },
  ];

  const processMessage = async (message: string) => {
    // Add user message to conversation
    setConversation(prev => [...prev, { role: 'user', content: message }]);
    setInput('');
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
      response = "I can help you navigate the app or perform quick actions. Try asking me to open a specific page like 'open my profile', 'show emergency contacts', or actions like 'trigger SOS alert'.";
    }

    // Simulate network delay
    setTimeout(() => {
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  const handleCommand = (command: CommandType) => {
    setOpen(false);
    if (command.type === 'navigation' && command.path) {
      navigate(command.path);
      toast({
        title: "Navigating",
        description: `Going to ${command.name}`,
      });
    } else if (command.type === 'action' && command.action) {
      command.action();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processMessage(input);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 bottom-4 h-12 w-12 rounded-full bg-safeguard-primary text-white shadow-lg hover:bg-safeguard-primary/90"
        onClick={() => setOpen(true)}
      >
        <MessageSquare size={24} />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex flex-col h-[80vh]">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-safeguard-primary" />
              <h2 className="font-semibold">SafeGuard Assistant</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-safeguard-primary text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t p-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                className="flex-1 rounded-md border px-3 py-2 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message SafeGuard Assistant..."
              />
              <Button type="submit" disabled={!input.trim() || loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          <div className="border-t">
            <h3 className="px-3 py-2 text-sm font-medium">Quick Actions</h3>
            <Command>
              <CommandInput placeholder="Search commands..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                  {commands
                    .filter(cmd => cmd.type === 'navigation')
                    .map((command) => (
                      <CommandItem
                        key={command.name}
                        onSelect={() => handleCommand(command)}
                      >
                        {command.name}
                        <span className="text-xs text-muted-foreground ml-2">
                          {command.description}
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Actions">
                  {commands
                    .filter(cmd => cmd.type === 'action')
                    .map((command) => (
                      <CommandItem
                        key={command.name}
                        onSelect={() => handleCommand(command)}
                      >
                        {command.name}
                        <span className="text-xs text-muted-foreground ml-2">
                          {command.description}
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
