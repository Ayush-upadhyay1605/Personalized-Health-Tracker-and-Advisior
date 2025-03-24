
import { Bell, Globe, Sun, Clock, Shield, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Medication Reminders</p>
                    <p className="text-sm text-muted-foreground">Receive alerts for medication schedules</p>
                  </div>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Appointment Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about upcoming appointments</p>
                  </div>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Health Updates</p>
                    <p className="text-sm text-muted-foreground">Receive weekly health summary</p>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                  </div>
                </div>
                <select className="p-2 rounded border">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Sun className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
                  </div>
                </div>
                <select className="p-2 rounded border">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Quiet Hours</p>
                    <p className="text-sm text-muted-foreground">Disable notifications during specific hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="time" className="p-2 rounded border" defaultValue="22:00" />
                  <span>to</span>
                  <input type="time" className="p-2 rounded border" defaultValue="07:00" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              Export Health Data
            </Button>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
