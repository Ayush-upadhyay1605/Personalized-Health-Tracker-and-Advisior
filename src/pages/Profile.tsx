
import { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Activity, AlertTriangle, Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Profile form data
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    bloodType: ''
  });
  
  // Medical conditions and allergies data
  const [medicalConditions, setMedicalConditions] = useState([
    {
      condition: 'Hypertension',
      diagnosedYear: '2020',
      status: 'Controlled'
    },
    {
      condition: 'Type 2 Diabetes',
      diagnosedYear: '2018',
      status: 'Managed'
    }
  ]);
  
  const [allergies, setAllergies] = useState([
    {
      name: 'Penicillin Allergy',
      severity: 'high'
    },
    {
      name: 'Latex Sensitivity',
      severity: 'medium'
    },
    {
      name: 'Aspirin Interaction',
      severity: 'low'
    }
  ]);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to view your profile",
          variant: "destructive",
        });
        return;
      }
      
      const currentUser = session.user;
      setUser(currentUser);
      
      // Set initial form data from user metadata or default values
      setFormData({
        fullName: currentUser.user_metadata?.full_name || 'John Doe',
        phone: currentUser.user_metadata?.phone || '+1 (555) 123-4567',
        email: currentUser.email || '',
        address: currentUser.user_metadata?.address || '123 Health St, Medical City',
        bloodType: currentUser.user_metadata?.blood_type || 'A+'
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          blood_type: formData.bloodType
        }
      });
      
      if (error) throw error;
      
      setEditMode(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
      
      // Refresh user data
      fetchUserProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="p-6">Loading profile information...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        {!editMode ? (
          <Button onClick={() => setEditMode(true)} variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSaveProfile} variant="default" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button onClick={() => {
              setEditMode(false);
              fetchUserProfile(); // Reset form data
            }} variant="outline" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>
      
      {/* Profile Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <User className="h-16 w-16 text-gray-400" />
              </div>
              {editMode ? (
                <Input 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="text-center"
                />
              ) : (
                <h2 className="text-xl font-bold text-center">{formData.fullName}</h2>
              )}
              <p className="text-muted-foreground text-center">
                {user?.id ? `Patient ID: #${user.id.substring(0, 6)}` : 'Loading...'}
              </p>
            </div>
            
            <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  {editMode ? (
                    <Input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-medium">{formData.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  {editMode ? (
                    <Input 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-medium">{formData.address}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  {editMode ? (
                    <Input 
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="font-medium">{formData.bloodType}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicalConditions.map((condition, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{condition.condition}</h3>
                    <p className="text-sm text-muted-foreground">Diagnosed: {condition.diagnosedYear}</p>
                  </div>
                  <span className={`bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full`}>
                    {condition.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Jane Doe</h3>
                <p className="text-sm text-muted-foreground">Spouse</p>
                <p className="text-sm font-medium mt-1">+91 8690174512</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Robert Doe</h3>
                <p className="text-sm text-muted-foreground">Son</p>
                <p className="text-sm font-medium mt-1">+1 (555) 456-7890</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Allergies & Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Allergies & Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allergies.map((allergy, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-lg flex items-center gap-3 ${
                  allergy.severity === 'high' 
                    ? 'bg-red-100' 
                    : allergy.severity === 'medium'
                      ? 'bg-amber-100'
                      : 'bg-blue-100'
                }`}
              >
                <AlertTriangle className={`h-5 w-5 ${
                  allergy.severity === 'high' 
                    ? 'text-red-500' 
                    : allergy.severity === 'medium'
                      ? 'text-amber-500'
                      : 'text-blue-500'
                }`} />
                <p className="font-medium">{allergy.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
