
import { useEffect, useState } from 'react';
import { User, Phone, Mail, MapPin, Activity, AlertTriangle, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          return;
        }
        
        const user = sessionData.session.user;
        
        // Set the user profile with data from auth
        setUserProfile({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'Health Buddy User',
          phone: user.phone || user.user_metadata?.phone || '+1 (555) 123-4567',
          address: user.user_metadata?.address || '123 Health St, Medical City',
          bloodType: 'A+', // This would ideally come from a user_metadata or profiles table
          joinedDate: new Date(user.created_at).toLocaleDateString(),
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error fetching profile',
          description: 'We could not load your profile information',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [toast]);
  
  const medicalConditions = [
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
  ];
  
  const allergies = [
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
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-32">
              <p>Loading profile information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      {/* Profile Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <User className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-center">{userProfile?.name}</h2>
              <p className="text-muted-foreground text-center">Patient ID: #{userProfile?.id.slice(0, 6)}</p>
            </div>
            
            <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{userProfile?.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userProfile?.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{userProfile?.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-medium">{userProfile?.bloodType}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{userProfile?.joinedDate}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Account</p>
                  <p className="font-medium">Health Buddy User</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button variant="outline" className="mr-2">
              Edit Profile
            </Button>
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
