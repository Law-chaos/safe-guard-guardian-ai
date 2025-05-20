
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  Phone, 
  Shield, 
  Pill, 
  HelpCircle, 
  LogOut,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  extraContent?: React.ReactNode;
}

const Sidebar = ({ isOpen, onClose, extraContent }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: <User size={20} />, label: 'My Profile', path: '/profile' },
    { icon: <Users size={20} />, label: 'Trusted Contacts', path: '/contacts' },
    { icon: <Phone size={20} />, label: 'Rapid Response Contacts', path: '/emergency' },
    { icon: <Shield size={20} />, label: 'Personal Safety Score', path: '/safety-score' },
    { icon: <Pill size={20} />, label: 'Medical Information', path: '/medical' },
    { icon: <HelpCircle size={20} />, label: 'About the App', path: '/about' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        dark:bg-gray-800 dark:text-white
      `}>
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-safeguard-primary dark:text-safeguard-secondary">SafeGuard</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>
        
        {/* Extra content (Profile, Brightness controls, etc.) */}
        {extraContent && (
          <div className="border-b dark:border-gray-700">
            {extraContent}
          </div>
        )}
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-700 hover:text-safeguard-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:text-safeguard-secondary dark:hover:bg-gray-700"
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Button>
              </li>
            ))}
            
            <li className="pt-4 mt-4 border-t dark:border-gray-700">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
                onClick={logout}
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
