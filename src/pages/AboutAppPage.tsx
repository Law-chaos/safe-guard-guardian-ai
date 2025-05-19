
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Book, FileText, Mail, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const AboutAppPage = () => {
  const navigate = useNavigate();
  const appVersion = "1.0.0";

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
        <h1 className="text-xl font-bold text-white">About SafeGuard</h1>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-safeguard-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold">SafeGuard</h2>
            <p className="text-gray-500">Personal Safety App</p>
            <p className="text-sm mt-2">Version {appVersion}</p>
          </div>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <Info className="w-5 h-5 mr-2" />
                About
              </h3>
              <p className="text-gray-700">
                SafeGuard is a personal safety application designed to help keep you safe in emergency situations. 
                The app allows you to quickly contact trusted individuals and emergency services, manage your 
                medical information, and maintain important safety-related documents.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <Book className="w-5 h-5 mr-2" />
                How to Use
              </h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sos">
                  <AccordionTrigger className="text-left">SOS Feature</AccordionTrigger>
                  <AccordionContent>
                    Press the large SOS button on the main screen in an emergency. This will alert your trusted 
                    contacts and provide them with your location. You can customize SOS settings in the app.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="contacts">
                  <AccordionTrigger className="text-left">Managing Contacts</AccordionTrigger>
                  <AccordionContent>
                    Add trusted contacts who will be notified in an emergency. Include their name, phone number, 
                    and relationship to you. You can edit or remove contacts at any time.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="medical">
                  <AccordionTrigger className="text-left">Medical Information</AccordionTrigger>
                  <AccordionContent>
                    Store important medical information such as allergies, medications, and emergency contacts. 
                    This information can be accessed by emergency responders if needed.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="safety">
                  <AccordionTrigger className="text-left">Safety Score</AccordionTrigger>
                  <AccordionContent>
                    Your safety score increases as you add more information and complete safety actions. 
                    A higher score means you're better prepared for emergencies.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <FileText className="w-5 h-5 mr-2" />
                Legal Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  © 2025 SafeGuard App. All rights reserved.
                </p>
                <p className="text-sm text-gray-700">
                  Your privacy is important to us. We only collect information that's necessary to provide 
                  you with emergency services. View our complete privacy policy on our website.
                </p>
                <p className="text-sm text-gray-700">
                  SafeGuard is not a substitute for emergency services. Always call emergency services 
                  directly in life-threatening situations.
                </p>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.open('/privacy-policy', '_blank')}
                  >
                    Privacy Policy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs ml-2"
                    onClick={() => window.open('/terms', '_blank')}
                  >
                    Terms of Service
                  </Button>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold flex items-center mb-3">
                <Mail className="w-5 h-5 mr-2" />
                Contact Developer
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  Have questions, feedback, or experiencing issues with the app? 
                  Contact our development team:
                </p>
                <div>
                  <p className="text-sm">Email: support@safeguard-app.com</p>
                  <p className="text-sm">Website: www.safeguard-app.com</p>
                </div>
                <div className="pt-2 flex">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs flex items-center"
                    onClick={() => window.open('https://github.com/safeguard-app', '_blank')}
                  >
                    <Github className="w-4 h-4 mr-1" />
                    GitHub
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutAppPage;
