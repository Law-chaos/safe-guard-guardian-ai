
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Self-defense video content
const selfDefenseVideos = {
  basics: [
    {
      id: 'basic1',
      title: 'Basic Self-Defense Stance',
      description: 'Learn the fundamental stance that provides stability and readiness.',
      youtubeId: 'T7aNSRoDCmg',
      duration: '4:30',
      level: 'Beginner'
    },
    {
      id: 'basic2',
      title: 'Breaking Free from Wrist Grabs',
      description: 'Essential techniques to escape from common wrist grab situations.',
      youtubeId: 'aonkH45-6Nc',
      duration: '5:15',
      level: 'Beginner'
    },
    {
      id: 'basic3',
      title: 'Self-Defense Against Pushes',
      description: 'How to respond effectively when someone pushes you.',
      youtubeId: 'KVpxndkZNRE',
      duration: '6:20',
      level: 'Beginner'
    }
  ],
  techniques: [
    {
      id: 'tech1',
      title: 'Effective Palm Strike',
      description: 'The palm strike is one of the safest and most effective strikes you can use.',
      youtubeId: 'ajLaXML8YLM',
      duration: '3:45',
      level: 'Intermediate'
    },
    {
      id: 'tech2',
      title: 'Defensive Knee Strikes',
      description: 'Learn how to use your knees as powerful defensive weapons.',
      youtubeId: 'eMbC02xnTGo',
      duration: '7:10',
      level: 'Intermediate'
    },
    {
      id: 'tech3',
      title: 'Escaping Chokes and Grabs',
      description: 'Critical techniques for escaping dangerous choke holds.',
      youtubeId: 'TmkRLXSdLTo',
      duration: '8:30',
      level: 'Intermediate'
    }
  ],
  situational: [
    {
      id: 'sit1',
      title: 'Self-Defense in Confined Spaces',
      description: 'How to defend yourself in elevators, small rooms, or vehicles.',
      youtubeId: 'EDYonn0sFTk',
      duration: '9:15',
      level: 'Advanced'
    },
    {
      id: 'sit2',
      title: 'Multiple Attackers Strategies',
      description: 'Critical principles when facing more than one attacker.',
      youtubeId: '4DSPefCvNWw',
      duration: '10:40',
      level: 'Advanced'
    },
    {
      id: 'sit3',
      title: 'Nighttime Safety & Awareness',
      description: 'Staying safe and aware when walking alone at night.',
      youtubeId: '9zTXP-SymbU',
      duration: '6:50',
      level: 'All Levels'
    }
  ]
};

type VideoCategory = 'basics' | 'techniques' | 'situational';

const SelfDefensePage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<VideoCategory>('basics');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  const filteredVideos = selectedLevel 
    ? selfDefenseVideos[activeCategory].filter(video => video.level === selectedLevel)
    : selfDefenseVideos[activeCategory];
  
  const handleLevelFilter = (level: string) => {
    setSelectedLevel(selectedLevel === level ? null : level);
  };
  
  const renderVideo = (video: any) => (
    <Card key={video.id} className="mb-6 hover:shadow-lg transition-shadow dark:bg-gray-800">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{video.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {video.duration} | {video.level}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            <Play size={14} className="mr-1" /> Play
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{video.description}</p>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-safeguard-primary dark:bg-gray-800 p-4 flex items-center shadow-md">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/main')}
          className="text-white hover:bg-white hover:bg-opacity-20 mr-4"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold text-white">Self-Defense Hub</h1>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">Essential Self-Defense Training</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Learn crucial self-defense techniques from professional instructors. These videos 
              provide practical knowledge for real-world safety situations.
            </p>
            
            <div className="flex items-center space-x-4 mt-6 overflow-x-auto pb-2">
              <span className="text-sm font-medium flex items-center">
                <Filter size={16} className="mr-1" /> Filter by level:
              </span>
              <Button 
                variant={selectedLevel === 'Beginner' ? 'default' : 'outline'} 
                size="sm"
                className="text-xs rounded-full"
                onClick={() => handleLevelFilter('Beginner')}
              >
                Beginner
              </Button>
              <Button 
                variant={selectedLevel === 'Intermediate' ? 'default' : 'outline'} 
                size="sm"
                className="text-xs rounded-full"
                onClick={() => handleLevelFilter('Intermediate')}
              >
                Intermediate
              </Button>
              <Button 
                variant={selectedLevel === 'Advanced' ? 'default' : 'outline'} 
                size="sm"
                className="text-xs rounded-full"
                onClick={() => handleLevelFilter('Advanced')}
              >
                Advanced
              </Button>
              <Button 
                variant={selectedLevel === 'All Levels' ? 'default' : 'outline'} 
                size="sm"
                className="text-xs rounded-full"
                onClick={() => handleLevelFilter('All Levels')}
              >
                All Levels
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="basics" className="w-full" onValueChange={(value) => setActiveCategory(value as VideoCategory)}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="techniques">Techniques</TabsTrigger>
              <TabsTrigger value="situational">Situational</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="mt-0">
              <div className="space-y-4">
                {filteredVideos.map(renderVideo)}
              </div>
            </TabsContent>
            
            <TabsContent value="techniques" className="mt-0">
              <div className="space-y-4">
                {filteredVideos.map(renderVideo)}
              </div>
            </TabsContent>
            
            <TabsContent value="situational" className="mt-0">
              <div className="space-y-4">
                {filteredVideos.map(renderVideo)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SelfDefensePage;
