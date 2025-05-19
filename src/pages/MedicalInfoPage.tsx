
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pill, User, Heart, FileText, Upload, Trash2, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface ProfileData {
  id: string;
  full_name: string | null;
  age: number | null;
  blood_type: string | null;
  allergies: string | null;
}

interface Medication {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  notes: string | null;
  isEditing?: boolean;
}

interface MedicalProvider {
  id: string;
  name: string;
  type: string;
  specialty: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isEditing?: boolean;
}

interface Document {
  id: string;
  name: string;
  type: string;
  file_path: string;
}

const MedicalInfoPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [providers, setProviders] = useState<MedicalProvider[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    frequency: '',
    notes: ''
  });
  const [showAddMedication, setShowAddMedication] = useState(false);
  
  const [newProvider, setNewProvider] = useState<Omit<MedicalProvider, 'id'>>({
    name: '',
    type: 'doctor',
    specialty: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [showAddProvider, setShowAddProvider] = useState(false);
  
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('insurance');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMedications();
      fetchProviders();
      fetchDocuments();
    }
  }, [user]);
  
  // Profile functions
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setProfile(data || { id: user?.id || '', full_name: '', age: null, blood_type: null, allergies: null });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load profile data",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async () => {
    try {
      if (!profile || !user) return;
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          age: profile.age,
          blood_type: profile.blood_type,
          allergies: profile.allergies
        });
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Medical profile has been saved successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    }
  };
  
  // Medications functions
  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMedications(data || []);
    } catch (error: any) {
      console.error('Error fetching medications:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load medications",
      });
    }
  };
  
  const addMedication = async () => {
    try {
      if (!user) return;
      if (!newMedication.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Medication name is required",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('medications')
        .insert([{
          user_id: user.id,
          name: newMedication.name,
          dosage: newMedication.dosage || null,
          frequency: newMedication.frequency || null,
          notes: newMedication.notes || null
        }])
        .select();
      
      if (error) throw error;
      
      setMedications([...(data || []), ...medications]);
      setNewMedication({ name: '', dosage: '', frequency: '', notes: '' });
      setShowAddMedication(false);
      fetchMedications();
      
      toast({
        title: "Medication Added",
        description: "Medication has been added successfully",
      });
    } catch (error: any) {
      console.error('Error adding medication:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add medication",
      });
    }
  };
  
  const toggleEditMedication = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, isEditing: !med.isEditing } : med
    ));
  };
  
  const updateMedication = async (id: string) => {
    try {
      const medToUpdate = medications.find(m => m.id === id);
      if (!medToUpdate) return;
      
      if (!medToUpdate.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Medication name is required",
        });
        return;
      }
      
      const { error } = await supabase
        .from('medications')
        .update({
          name: medToUpdate.name,
          dosage: medToUpdate.dosage,
          frequency: medToUpdate.frequency,
          notes: medToUpdate.notes
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toggleEditMedication(id);
      
      toast({
        title: "Medication Updated",
        description: "Medication has been updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating medication:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update medication",
      });
    }
  };
  
  const deleteMedication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMedications(medications.filter(med => med.id !== id));
      
      toast({
        title: "Medication Deleted",
        description: "Medication has been removed successfully",
      });
    } catch (error: any) {
      console.error('Error deleting medication:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete medication",
      });
    }
  };
  
  const handleMedicationChange = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };
  
  // Providers functions
  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_providers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProviders(data || []);
    } catch (error: any) {
      console.error('Error fetching providers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load medical providers",
      });
    }
  };
  
  const addProvider = async () => {
    try {
      if (!user) return;
      if (!newProvider.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Provider name is required",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('medical_providers')
        .insert([{
          user_id: user.id,
          name: newProvider.name,
          type: newProvider.type,
          specialty: newProvider.specialty || null,
          phone: newProvider.phone || null,
          address: newProvider.address || null,
          notes: newProvider.notes || null
        }])
        .select();
      
      if (error) throw error;
      
      setProviders([...(data || []), ...providers]);
      setNewProvider({ 
        name: '', 
        type: 'doctor', 
        specialty: '', 
        phone: '', 
        address: '', 
        notes: '' 
      });
      setShowAddProvider(false);
      fetchProviders();
      
      toast({
        title: "Provider Added",
        description: "Medical provider has been added successfully",
      });
    } catch (error: any) {
      console.error('Error adding provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add medical provider",
      });
    }
  };
  
  const toggleEditProvider = (id: string) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { ...provider, isEditing: !provider.isEditing } : provider
    ));
  };
  
  const updateProvider = async (id: string) => {
    try {
      const providerToUpdate = providers.find(p => p.id === id);
      if (!providerToUpdate) return;
      
      if (!providerToUpdate.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Provider name is required",
        });
        return;
      }
      
      const { error } = await supabase
        .from('medical_providers')
        .update({
          name: providerToUpdate.name,
          type: providerToUpdate.type,
          specialty: providerToUpdate.specialty,
          phone: providerToUpdate.phone,
          address: providerToUpdate.address,
          notes: providerToUpdate.notes
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toggleEditProvider(id);
      
      toast({
        title: "Provider Updated",
        description: "Medical provider has been updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update medical provider",
      });
    }
  };
  
  const deleteProvider = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medical_providers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProviders(providers.filter(provider => provider.id !== id));
      
      toast({
        title: "Provider Deleted",
        description: "Medical provider has been removed successfully",
      });
    } catch (error: any) {
      console.error('Error deleting provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete medical provider",
      });
    }
  };
  
  const handleProviderChange = (id: string, field: keyof MedicalProvider, value: string) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { ...provider, [field]: value } : provider
    ));
  };
  
  // Documents functions
  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load documents",
      });
    }
  };
  
  const uploadDocument = async () => {
    try {
      if (!user) return;
      if (!documentName || !documentFile) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Document name and file are required",
        });
        return;
      }
      
      setUploading(true);
      
      // Upload file to storage
      const fileExt = documentFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('user_documents')
        .upload(fileName, documentFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('user_documents')
        .getPublicUrl(fileName);
      
      const filePath = urlData.publicUrl;
      
      // Save document metadata
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          user_id: user.id,
          name: documentName,
          type: documentType,
          file_path: filePath
        }])
        .select();
      
      if (error) throw error;
      
      setDocuments([...(data || []), ...documents]);
      setDocumentName('');
      setDocumentType('insurance');
      setDocumentFile(null);
      fetchDocuments();
      
      toast({
        title: "Document Uploaded",
        description: "Document has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload document",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const deleteDocument = async (id: string, filePath: string) => {
    try {
      // Delete from documents table
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      // Try to delete from storage (might fail if storage permissions aren't correctly set)
      try {
        const storageFilePath = filePath.split('user_documents/')[1];
        if (storageFilePath) {
          await supabase.storage.from('user_documents').remove([storageFilePath]);
        }
      } catch (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue even if storage delete fails
      }
      
      setDocuments(documents.filter(doc => doc.id !== id));
      
      toast({
        title: "Document Deleted",
        description: "Document has been removed successfully",
      });
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete document",
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFile(e.target.files[0]);
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
        <h1 className="text-xl font-bold text-white">Medical Information</h1>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4 pb-20">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="profile" className="text-xs sm:text-sm">
                <User className="w-4 h-4 mr-1" /> Profile
              </TabsTrigger>
              <TabsTrigger value="medications" className="text-xs sm:text-sm">
                <Pill className="w-4 h-4 mr-1" /> Meds
              </TabsTrigger>
              <TabsTrigger value="providers" className="text-xs sm:text-sm">
                <Heart className="w-4 h-4 mr-1" /> Doctors
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm">
                <FileText className="w-4 h-4 mr-1" /> Docs
              </TabsTrigger>
            </TabsList>
            
            {/* Medical Profile Tab */}
            <TabsContent value="profile" className="mt-4">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Your Medical Profile</h2>
                
                {loading ? (
                  <div className="text-center py-4">Loading profile...</div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <Input 
                        value={profile?.full_name || ''} 
                        onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Age</label>
                      <Input 
                        type="number" 
                        value={profile?.age || ''} 
                        onChange={(e) => setProfile(prev => prev ? {...prev, age: parseInt(e.target.value) || null} : null)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Blood Type</label>
                      <Select 
                        value={profile?.blood_type || ''} 
                        onValueChange={(value) => setProfile(prev => prev ? {...prev, blood_type: value} : null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Allergies</label>
                      <Textarea 
                        value={profile?.allergies || ''} 
                        onChange={(e) => setProfile(prev => prev ? {...prev, allergies: e.target.value} : null)}
                        placeholder="List any allergies or sensitivities"
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      onClick={updateProfile} 
                      className="w-full bg-safeguard-primary hover:opacity-90 mt-2"
                    >
                      Save Medical Profile
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
            
            {/* Medications Tab */}
            <TabsContent value="medications" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Medications</h2>
                  {!showAddMedication && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddMedication(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  )}
                </div>
                
                {showAddMedication && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Add Medication</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => setShowAddMedication(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Name*</label>
                        <Input 
                          value={newMedication.name} 
                          onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Dosage</label>
                        <Input 
                          value={newMedication.dosage || ''} 
                          onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                          placeholder="e.g. 10mg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Frequency</label>
                        <Input 
                          value={newMedication.frequency || ''} 
                          onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                          placeholder="e.g. Once daily"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Notes</label>
                        <Textarea 
                          value={newMedication.notes || ''} 
                          onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                          placeholder="Additional information"
                          rows={2}
                        />
                      </div>
                      <Button 
                        onClick={addMedication} 
                        className="w-full bg-safeguard-primary hover:opacity-90"
                      >
                        Add Medication
                      </Button>
                    </div>
                  </div>
                )}
                
                {medications.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No medications added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {medications.map((medication) => (
                      <div key={medication.id} className="border rounded-lg p-3">
                        {medication.isEditing ? (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-sm mb-1">Name*</label>
                              <Input 
                                value={medication.name} 
                                onChange={(e) => handleMedicationChange(medication.id, 'name', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Dosage</label>
                              <Input 
                                value={medication.dosage || ''} 
                                onChange={(e) => handleMedicationChange(medication.id, 'dosage', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Frequency</label>
                              <Input 
                                value={medication.frequency || ''} 
                                onChange={(e) => handleMedicationChange(medication.id, 'frequency', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Notes</label>
                              <Textarea 
                                value={medication.notes || ''} 
                                onChange={(e) => handleMedicationChange(medication.id, 'notes', e.target.value)}
                                rows={2}
                              />
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <Button 
                                className="bg-safeguard-primary hover:opacity-90 flex-1"
                                onClick={() => updateMedication(medication.id)}
                                size="sm"
                              >
                                <Save className="mr-1" size={14} /> Save
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => toggleEditMedication(medication.id)}
                                size="sm"
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{medication.name}</h3>
                                {medication.dosage && (
                                  <p className="text-sm">{medication.dosage}</p>
                                )}
                                {medication.frequency && (
                                  <p className="text-xs text-gray-500">{medication.frequency}</p>
                                )}
                                {medication.notes && (
                                  <p className="text-xs text-gray-500 mt-1">{medication.notes}</p>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8" 
                                  onClick={() => toggleEditMedication(medication.id)}
                                >
                                  <Edit size={16} className="text-gray-500" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8" 
                                  onClick={() => deleteMedication(medication.id)}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Medical Providers Tab */}
            <TabsContent value="providers" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Doctors & Hospitals</h2>
                  {!showAddProvider && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddProvider(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  )}
                </div>
                
                {showAddProvider && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Add Medical Provider</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => setShowAddProvider(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Name*</label>
                        <Input 
                          value={newProvider.name} 
                          onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Type</label>
                        <Select 
                          value={newProvider.type} 
                          onValueChange={(value) => setNewProvider({...newProvider, type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="hospital">Hospital</SelectItem>
                            <SelectItem value="clinic">Clinic</SelectItem>
                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Specialty</label>
                        <Input 
                          value={newProvider.specialty || ''} 
                          onChange={(e) => setNewProvider({...newProvider, specialty: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Phone</label>
                        <Input 
                          value={newProvider.phone || ''} 
                          onChange={(e) => setNewProvider({...newProvider, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Address</label>
                        <Textarea 
                          value={newProvider.address || ''} 
                          onChange={(e) => setNewProvider({...newProvider, address: e.target.value})}
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Notes</label>
                        <Textarea 
                          value={newProvider.notes || ''} 
                          onChange={(e) => setNewProvider({...newProvider, notes: e.target.value})}
                          rows={2}
                        />
                      </div>
                      <Button 
                        onClick={addProvider} 
                        className="w-full bg-safeguard-primary hover:opacity-90"
                      >
                        Add Provider
                      </Button>
                    </div>
                  </div>
                )}
                
                {providers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No medical providers added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {providers.map((provider) => (
                      <div key={provider.id} className="border rounded-lg p-3">
                        {provider.isEditing ? (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-sm mb-1">Name*</label>
                              <Input 
                                value={provider.name} 
                                onChange={(e) => handleProviderChange(provider.id, 'name', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Type</label>
                              <Select 
                                value={provider.type} 
                                onValueChange={(value) => handleProviderChange(provider.id, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="doctor">Doctor</SelectItem>
                                  <SelectItem value="hospital">Hospital</SelectItem>
                                  <SelectItem value="clinic">Clinic</SelectItem>
                                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Specialty</label>
                              <Input 
                                value={provider.specialty || ''} 
                                onChange={(e) => handleProviderChange(provider.id, 'specialty', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Phone</label>
                              <Input 
                                value={provider.phone || ''} 
                                onChange={(e) => handleProviderChange(provider.id, 'phone', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Address</label>
                              <Textarea 
                                value={provider.address || ''} 
                                onChange={(e) => handleProviderChange(provider.id, 'address', e.target.value)}
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Notes</label>
                              <Textarea 
                                value={provider.notes || ''} 
                                onChange={(e) => handleProviderChange(provider.id, 'notes', e.target.value)}
                                rows={2}
                              />
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <Button 
                                className="bg-safeguard-primary hover:opacity-90 flex-1"
                                onClick={() => updateProvider(provider.id)}
                                size="sm"
                              >
                                <Save className="mr-1" size={14} /> Save
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => toggleEditProvider(provider.id)}
                                size="sm"
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{provider.name}</h3>
                                <p className="text-sm capitalize">{provider.type}</p>
                                {provider.specialty && (
                                  <p className="text-xs text-gray-500">{provider.specialty}</p>
                                )}
                                {provider.phone && (
                                  <p className="text-xs">{provider.phone}</p>
                                )}
                                {provider.address && (
                                  <p className="text-xs text-gray-500 mt-1">{provider.address}</p>
                                )}
                                {provider.notes && (
                                  <p className="text-xs text-gray-500 mt-1">{provider.notes}</p>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8" 
                                  onClick={() => toggleEditProvider(provider.id)}
                                >
                                  <Edit size={16} className="text-gray-500" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8" 
                                  onClick={() => deleteProvider(provider.id)}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-4">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Insurance & Documents</h2>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-3">Upload New Document</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Document Name*</label>
                      <Input 
                        value={documentName} 
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="e.g. Insurance Card"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Document Type</label>
                      <Select 
                        value={documentType} 
                        onValueChange={setDocumentType}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="insurance">Insurance Card</SelectItem>
                          <SelectItem value="medical_report">Medical Report</SelectItem>
                          <SelectItem value="prescription">Prescription</SelectItem>
                          <SelectItem value="other">Other Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">File*</label>
                      <Input 
                        type="file" 
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                      />
                    </div>
                    <Button 
                      onClick={uploadDocument} 
                      className="w-full bg-safeguard-primary hover:opacity-90"
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                  </div>
                </div>
                
                {documents.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No documents uploaded yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((document) => (
                      <div key={document.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{document.name}</h3>
                            <p className="text-xs text-gray-500 capitalize">{document.type.replace('_', ' ')}</p>
                            <div className="mt-2">
                              <a 
                                href={document.file_path} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-safeguard-primary text-sm hover:underline"
                              >
                                View Document
                              </a>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => deleteDocument(document.id, document.file_path)}
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MedicalInfoPage;
