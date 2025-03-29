
import { User, Phone, Mail, MapPin, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
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
              <h2 className="text-xl font-bold text-center">Ayush Upadhyay</h2>
              <p className="text-muted-foreground text-center">Patient ID: #123456</p>
            </div>
            
            <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">john.doe@example.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">123 Health St, Medical City</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-medium">A+</p>
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
