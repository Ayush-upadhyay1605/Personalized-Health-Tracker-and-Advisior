
import { Heart, Activity, Weight, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Health Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Heart className="h-8 w-8 text-red-500 mb-2" />
                <h3 className="text-muted-foreground">Heart Rate</h3>
                <p className="text-3xl font-bold mt-1">72 bpm</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Activity className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="text-muted-foreground">Steps</h3>
                <p className="text-3xl font-bold mt-1">8,439</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Weight className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="text-muted-foreground">Weight</h3>
                <p className="text-3xl font-bold mt-1">68 kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Thermometer className="h-8 w-8 text-amber-500 mb-2" />
                <h3 className="text-muted-foreground">Temperature</h3>
                <p className="text-3xl font-bold mt-1">36.6°C</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Schedule and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Morning Walk</h3>
                  <p className="text-sm text-muted-foreground">09:00 AM</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  Exercise
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dr. Smith Appointment</h3>
                  <p className="text-sm text-muted-foreground">11:00 AM</p>
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                  Medical
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Take Medications</h3>
                  <p className="text-sm text-muted-foreground">02:00 PM</p>
                </div>
                <span className="bg-pink-100 text-pink-800 text-xs font-medium px-3 py-1 rounded-full">
                  Medication
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Blood Pressure Check</h3>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <span className="text-sm font-medium">120/80 mmHg</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Medication Taken</h3>
                  <p className="text-sm text-muted-foreground">4 hours ago</p>
                </div>
                <span className="text-sm font-medium">Morning Dose</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Weight Measurement</h3>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
                <span className="text-sm font-medium">68 kg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
