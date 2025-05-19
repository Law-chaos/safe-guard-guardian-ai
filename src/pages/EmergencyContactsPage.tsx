
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface EmergencyNumber {
  name: string;
  number: string;
  description?: string;
}

const EmergencyContactsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [countryFilter, setCountryFilter] = useState<'india' | 'all'>('india');
  
  // Define emergency numbers
  const indiaEmergencyNumbers: EmergencyNumber[] = [
    { name: "Police", number: "100", description: "For reporting crimes and emergencies" },
    { name: "Ambulance", number: "108", description: "Medical emergencies" },
    { name: "Fire", number: "101", description: "Fire emergencies" },
    { name: "Women Helpline", number: "1091", description: "For women in distress" },
    { name: "Child Helpline", number: "1098", description: "For children in need" },
    { name: "National Emergency", number: "112", description: "Unified emergency number" },
    { name: "Disaster Management", number: "108", description: "Natural and man-made disasters" },
    { name: "Senior Citizen Helpline", number: "14567", description: "For elderly in distress" },
    { name: "Road Accidents", number: "1073", description: "Highway accidents" },
    { name: "Railway Protection", number: "1512", description: "Railway emergencies" }
  ];
  
  const internationalEmergencyNumbers: EmergencyNumber[] = [
    { name: "USA General Emergency", number: "911", description: "Police, Fire, Ambulance in USA" },
    { name: "UK General Emergency", number: "999", description: "Police, Fire, Ambulance in UK" },
    { name: "Australia General Emergency", number: "000", description: "Police, Fire, Ambulance in Australia" },
    { name: "EU General Emergency", number: "112", description: "Standard emergency number for EU countries" },
    { name: "Canada General Emergency", number: "911", description: "Police, Fire, Ambulance in Canada" }
  ];
  
  const displayedNumbers = countryFilter === 'india' 
    ? indiaEmergencyNumbers 
    : [...indiaEmergencyNumbers, ...internationalEmergencyNumbers];
  
  const handleCallEmergency = (number: string, name: string) => {
    // This will only work on mobile devices
    window.location.href = `tel:${number}`;
    
    toast({
      title: `Calling ${name}`,
      description: `Dialing emergency number ${number}`,
    });
  };

  return (
    <div className="min-h-screen bg-safeguard-gradient">
      {/* Header */}
      <header className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/main')}
          className="text-white hover:bg-white hover:bg-opacity-20 mr-4"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold text-white">Emergency Contacts</h1>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <div className="mb-6 flex justify-center space-x-2">
            <Button 
              onClick={() => setCountryFilter('india')}
              variant={countryFilter === 'india' ? 'default' : 'outline'}
              className={countryFilter === 'india' ? 'bg-safeguard-primary hover:opacity-90' : ''}
            >
              India
            </Button>
            <Button 
              onClick={() => setCountryFilter('all')}
              variant={countryFilter === 'all' ? 'default' : 'outline'}
              className={countryFilter === 'all' ? 'bg-safeguard-primary hover:opacity-90' : ''}
            >
              All Countries
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4 text-center">
            Tap any number to call directly in case of emergency
          </p>
          
          <div className="space-y-4">
            {displayedNumbers.map((emergency, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleCallEmergency(emergency.number, emergency.name)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{emergency.name}</h3>
                    {emergency.description && (
                      <p className="text-sm text-gray-500">{emergency.description}</p>
                    )}
                  </div>
                  <div className="flex items-center text-safeguard-primary font-bold">
                    <Phone className="mr-2" size={20} />
                    {emergency.number}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-sm text-gray-500">
              In a life-threatening emergency, call your local emergency services immediately.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmergencyContactsPage;
