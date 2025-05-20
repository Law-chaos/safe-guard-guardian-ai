
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

// Video categories and their embedded content
const videoCategories = [
  {
    id: "basics",
    title: "Basic Techniques",
    videos: [
      {
        title: "Basic Self Defense Moves Everyone Should Know",
        embedUrl: "https://www.youtube.com/embed/Gx3_x6RH1J4",
        description: "Learn the fundamental moves that could save your life in an emergency situation."
      },
      {
        title: "Self Defense Basics: Stance and Movement",
        embedUrl: "https://www.youtube.com/embed/T7aNSRoDCmg",
        description: "Proper stance and movement are critical for effective self defense."
      }
    ]
  },
  {
    id: "women",
    title: "Women's Self Defense",
    videos: [
      {
        title: "Self Defense for Women",
        embedUrl: "https://www.youtube.com/embed/KVpxP3ZZtAc",
        description: "Specific techniques designed for women facing various threatening scenarios."
      },
      {
        title: "Women's Self Defense: Escape from Grabs",
        embedUrl: "https://www.youtube.com/embed/T7aNSRoDCmg",
        description: "Learn effective techniques to escape from common grabs and holds."
      }
    ]
  },
  {
    id: "advanced",
    title: "Advanced Techniques",
    videos: [
      {
        title: "Advanced Self Defense Strategies",
        embedUrl: "https://www.youtube.com/embed/T7aNSRoDCmg",
        description: "Take your skills to the next level with these advanced techniques."
      },
      {
        title: "Pressure Points for Self Defense",
        embedUrl: "https://www.youtube.com/embed/KVpxP3ZZtAc",
        description: "Learn how to use pressure points effectively in self defense situations."
      }
    ]
  }
];

const SelfDefensePage = () => {
  const navigate = useNavigate();
  
  return (
    <Layout className="py-6 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/main')}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-safeguard-primary">Self Defense Videos</h1>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">
            Learn effective self-defense techniques from expert instructors. These videos cover basic to advanced skills
            to help you stay safe in various situations. Remember: practice makes perfect!
          </p>
        </div>
        
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="mb-6 w-full flex justify-start overflow-x-auto space-x-2">
            {videoCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="px-4 py-2">
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {videoCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <h2 className="text-xl font-bold mb-4">{category.title}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {category.videos.map((video, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription>{video.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative overflow-hidden w-full pt-[56.25%]">
                        <iframe
                          src={video.embedUrl}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default SelfDefensePage;
