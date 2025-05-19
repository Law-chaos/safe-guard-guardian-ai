
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SafetyScore {
  id: string;
  user_id: string;
  score: number;
  last_updated: string;
}

interface Achievement {
  id: string;
  user_id: string;
  name: string;
  description: string;
  icon: string | null;
  earned_at: string;
}

const SafetyScorePage = () => {
  const [safetyScore, setSafetyScore] = useState<SafetyScore | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSafetyScore();
      fetchAchievements();
    }
  }, [user]);

  const fetchSafetyScore = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('safety_scores')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSafetyScore(data);
      } else {
        // If no score exists, create a default one
        const { data: newScore, error: insertError } = await supabase
          .from('safety_scores')
          .insert([{ user_id: user?.id, score: 50 }])
          .select()
          .single();
        
        if (insertError) throw insertError;
        setSafetyScore(newScore);
      }
    } catch (error: any) {
      console.error('Error fetching safety score:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load safety score",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user?.id)
        .order('earned_at', { ascending: false });
      
      if (error) throw error;
      
      setAchievements(data || []);
      
      // If there are no achievements, create some dummy ones
      if (!data || data.length === 0) {
        await createDummyAchievements();
      }
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load achievements",
      });
    }
  };

  const createDummyAchievements = async () => {
    try {
      const dummyAchievements = [
        {
          user_id: user?.id,
          name: "SafeGuard Onboarding",
          description: "Completed the SafeGuard app onboarding process",
          icon: "onboarding"
        },
        {
          user_id: user?.id,
          name: "Profile Setup",
          description: "Set up your personal profile with essential information",
          icon: "profile"
        },
        {
          user_id: user?.id,
          name: "First Contact",
          description: "Added your first trusted contact",
          icon: "contact"
        }
      ];
      
      const { data, error } = await supabase
        .from('achievements')
        .insert(dummyAchievements)
        .select();
      
      if (error) throw error;
      
      setAchievements(data || []);
    } catch (error: any) {
      console.error('Error creating dummy achievements:', error);
    }
  };

  // Function to improve safety score for demo purposes
  const improveSafetyScore = async () => {
    try {
      if (!safetyScore) return;
      
      let newScore = Math.min(safetyScore.score + 5, 100);
      
      const { error } = await supabase
        .from('safety_scores')
        .update({ score: newScore, last_updated: new Date().toISOString() })
        .eq('id', safetyScore.id);
      
      if (error) throw error;
      
      setSafetyScore({ ...safetyScore, score: newScore });
      
      toast({
        title: "Score Improved!",
        description: "Your safety score has increased.",
      });
      
      // Add a new achievement if score reaches certain thresholds
      if ([70, 80, 90, 100].includes(newScore)) {
        await addScoreAchievement(newScore);
      }
    } catch (error: any) {
      console.error('Error updating safety score:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update safety score",
      });
    }
  };

  const addScoreAchievement = async (score: number) => {
    try {
      let achievementDetails = {
        user_id: user?.id,
        name: `${score}% Safety Score`,
        description: `Reached a safety score of ${score}%`,
        icon: "trophy"
      };
      
      const { data, error } = await supabase
        .from('achievements')
        .insert([achievementDetails])
        .select();
      
      if (error) throw error;
      
      setAchievements([...(data || []), ...achievements]);
    } catch (error: any) {
      console.error('Error adding achievement:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-red-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getScoreLevel = (score: number) => {
    if (score < 40) return 'At Risk';
    if (score < 70) return 'Moderate';
    if (score < 90) return 'Good';
    return 'Excellent';
  };

  const getProgressColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAchievementIcon = (iconName: string | null) => {
    switch(iconName) {
      case 'trophy': return <Trophy />;
      case 'profile': return <Shield />;
      default: return <Award />;
    }
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
        <h1 className="text-xl font-bold text-white">Personal Safety Score</h1>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          {loading ? (
            <div className="text-center py-8">Loading safety data...</div>
          ) : (
            <>
              {/* Safety Score */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Your Safety Score</h2>
                
                <div className="w-48 h-48 rounded-full border-8 border-gray-200 flex items-center justify-center mx-auto mb-4">
                  <div className="text-center">
                    <p className={`text-4xl font-bold ${getScoreColor(safetyScore?.score || 0)}`}>
                      {safetyScore?.score || 0}%
                    </p>
                    <p className="text-gray-500">{getScoreLevel(safetyScore?.score || 0)}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Progress 
                    value={safetyScore?.score || 0} 
                    className="h-2"
                    indicatorClassName={getProgressColor(safetyScore?.score || 0)}  
                  />
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  Complete safety actions to increase your score and stay safer
                </p>
                
                <Button 
                  onClick={improveSafetyScore} 
                  className="bg-safeguard-primary hover:opacity-90"
                >
                  Complete Safety Action
                </Button>
              </div>
              
              {/* Achievements */}
              <div>
                <h2 className="text-xl font-bold mb-4">Your Achievements</h2>
                
                {achievements.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Complete actions to earn achievements
                  </div>
                ) : (
                  <div className="space-y-3">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center p-3 border rounded-lg">
                        <div className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                          {getAchievementIcon(achievement.icon)}
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.name}</h3>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(achievement.earned_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SafetyScorePage;
