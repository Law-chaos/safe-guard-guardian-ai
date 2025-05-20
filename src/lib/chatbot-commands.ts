
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface CommandType {
  type: 'navigation' | 'action';
  name: string;
  description: string;
  path?: string;
  action?: () => void;
}

export const useChatbotCommands = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
        toast({
          title: "Logging out",
          description: "You are being signed out of SafeGuard",
        });
        setTimeout(() => navigate('/login'), 1000);
      },
    },
  ];

  return commands;
};
