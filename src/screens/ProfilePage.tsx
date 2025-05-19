
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const ProfileContent = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Load saved profile data from localStorage
    const loadProfile = () => {
      if (user?.email) {
        const savedProfile = localStorage.getItem(`profile_${user.email}`);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setName(profile.name || '');
          setAge(profile.age || '');
          setGender(profile.gender || '');
          setProfileImage(profile.profileImage || null);
        }
      }
    };
    
    loadProfile();
  }, [isAuthenticated, navigate, user]);
  
  const handleSaveProfile = () => {
    if (user?.email) {
      const profileData = {
        name,
        age,
        gender,
        profileImage,
      };
      
      localStorage.setItem(`profile_${user.email}`, JSON.stringify(profileData));
      
      // Show success message
      alert('Profile updated successfully');
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
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
        <h1 className="text-xl font-bold text-white">My Profile</h1>
      </header>
      
      {/* Profile Content */}
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-400" />
              )}
            </div>
            
            <label className="cursor-pointer">
              <div className="flex items-center text-safeguard-primary">
                <Upload size={16} className="mr-1" />
                <span>Upload Photo</span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={user?.email} disabled className="bg-gray-100" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <Input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                placeholder="Enter your age"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSaveProfile}
                className="w-full bg-safeguard-primary hover:opacity-90"
              >
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <AuthProvider>
      <ProfileContent />
    </AuthProvider>
  );
};

export default ProfilePage;
