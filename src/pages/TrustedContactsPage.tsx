
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
  email: string | null;
  created_at: string;
  isEditing?: boolean;
}

const TrustedContactsPage = () => {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [newContact, setNewContact] = useState<Omit<TrustedContact, 'id' | 'created_at'>>({
    name: '',
    phone: '',
    relationship: '',
    email: '',
    isEditing: false
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load contacts",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContact = async () => {
    try {
      if (!user) return;
      if (!newContact.name || !newContact.phone) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Name and phone are required",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('trusted_contacts')
        .insert([{
          user_id: user.id,
          name: newContact.name,
          phone: newContact.phone,
          relationship: newContact.relationship || null,
          email: newContact.email || null
        }])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Contact Added",
        description: "Trusted contact has been added successfully",
      });
      
      setContacts([...(data || []), ...contacts]);
      setNewContact({ name: '', phone: '', relationship: '', email: '', isEditing: false });
      setShowAddForm(false);
      fetchContacts();
    } catch (error: any) {
      console.error('Error adding contact:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add contact",
      });
    }
  };

  const toggleEdit = (id: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, isEditing: !contact.isEditing } : contact
    ));
  };

  const updateContact = async (id: string) => {
    try {
      const contactToUpdate = contacts.find(c => c.id === id);
      if (!contactToUpdate) return;
      
      const { name, phone, relationship, email } = contactToUpdate;
      
      if (!name || !phone) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Name and phone are required",
        });
        return;
      }
      
      const { error } = await supabase
        .from('trusted_contacts')
        .update({ name, phone, relationship, email })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Contact Updated",
        description: "Trusted contact has been updated successfully",
      });
      
      toggleEdit(id);
    } catch (error: any) {
      console.error('Error updating contact:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update contact",
      });
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trusted_contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setContacts(contacts.filter(contact => contact.id !== id));
      
      toast({
        title: "Contact Deleted",
        description: "Trusted contact has been removed successfully",
      });
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete contact",
      });
    }
  };

  const handleContactChange = (id: string, field: keyof TrustedContact, value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
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
        <h1 className="text-xl font-bold text-white">Trusted Contacts</h1>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          {/* Add Contact Button */}
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="mb-4 w-full bg-safeguard-primary hover:opacity-90"
            >
              <Plus className="mr-2" size={16} />
              Add New Contact
            </Button>
          )}

          {/* Add New Contact Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Add New Contact</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Name*</label>
                  <Input
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Phone Number*</label>
                  <Input
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Relationship</label>
                  <Input
                    value={newContact.relationship || ''}
                    onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                    placeholder="e.g. Family, Friend, Colleague"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <Input
                    value={newContact.email || ''}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    placeholder="Email Address"
                    type="email"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button 
                    className="bg-safeguard-primary hover:opacity-90 flex-1"
                    onClick={addContact}
                  >
                    Add Contact
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewContact({ name: '', phone: '', relationship: '', email: '', isEditing: false });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Contacts List */}
          <div className="space-y-4">
            <h2 className="font-semibold">Your Trusted Contacts</h2>
            
            {loading ? (
              <div className="text-center py-4">Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No contacts added yet. Add someone you trust.
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-3">
                    {contact.isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm mb-1">Name*</label>
                          <Input
                            value={contact.name}
                            onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)}
                            placeholder="Full Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Phone Number*</label>
                          <Input
                            value={contact.phone}
                            onChange={(e) => handleContactChange(contact.id, 'phone', e.target.value)}
                            placeholder="Phone Number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Relationship</label>
                          <Input
                            value={contact.relationship || ''}
                            onChange={(e) => handleContactChange(contact.id, 'relationship', e.target.value)}
                            placeholder="e.g. Family, Friend, Colleague"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Email</label>
                          <Input
                            value={contact.email || ''}
                            onChange={(e) => handleContactChange(contact.id, 'email', e.target.value)}
                            placeholder="Email Address"
                            type="email"
                          />
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button 
                            className="bg-safeguard-primary hover:opacity-90 flex-1"
                            onClick={() => updateContact(contact.id)}
                            size="sm"
                          >
                            <Save className="mr-1" size={14} /> Save
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => toggleEdit(contact.id)}
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
                            <h3 className="font-medium">{contact.name}</h3>
                            <p className="text-sm">{contact.phone}</p>
                            {contact.relationship && (
                              <p className="text-xs text-gray-500">{contact.relationship}</p>
                            )}
                            {contact.email && (
                              <p className="text-xs text-gray-500">{contact.email}</p>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => toggleEdit(contact.id)}
                            >
                              <Edit size={16} className="text-gray-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => deleteContact(contact.id)}
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
        </div>
      </main>
    </div>
  );
};

export default TrustedContactsPage;
