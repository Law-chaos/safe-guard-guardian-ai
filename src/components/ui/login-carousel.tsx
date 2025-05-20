
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Users, AlertCircle, Map } from 'lucide-react';

// Array of app features to display in the carousel
const features = [
  {
    title: "Personal Safety",
    description: "Track your location and share it with trusted contacts in real-time during emergencies.",
    icon: <Shield className="h-12 w-12 text-safeguard-primary mb-4" />
  },
  {
    title: "Emergency SOS",
    description: "One-tap SOS button to alert your emergency contacts with your location.",
    icon: <AlertCircle className="h-12 w-12 text-safeguard-primary mb-4" />
  },
  {
    title: "Trusted Contacts",
    description: "Add trusted people who will be notified during emergencies.",
    icon: <Users className="h-12 w-12 text-safeguard-primary mb-4" />
  },
  {
    title: "Safe Route Planning",
    description: "Plan and follow the safest routes to your destination.",
    icon: <Map className="h-12 w-12 text-safeguard-primary mb-4" />
  },
  {
    title: "Secure & Private",
    description: "Your data is encrypted and shared only with your explicit permission.",
    icon: <Lock className="h-12 w-12 text-safeguard-primary mb-4" />
  }
];

export function LoginCarousel() {
  return (
    <div className="h-full flex flex-col justify-center">
      <h2 className="text-2xl font-bold text-center mb-8 text-safeguard-primary">SafeGuard Features</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={index}>
              <Card className="border-none shadow-none">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  {feature.icon}
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative static" />
          <CarouselNext className="relative static" />
        </div>
      </Carousel>
    </div>
  );
}
