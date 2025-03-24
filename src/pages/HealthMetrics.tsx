
import { Heart, Activity, Weight, Moon, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HealthMetrics = () => {
  // Mock data for charts - in real app would come from state/API
  const chartHeight = 150;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Health Metrics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-medium">Heart Rate</h3>
              </div>
              <LineChart className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">72 bpm</p>
              <p className="text-sm text-muted-foreground text-green-600">+2 from yesterday</p>
            </div>
            <div className="h-[150px] mt-4 flex items-end justify-between gap-1">
              {days.map((day, i) => (
                <div key={day} className="relative flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-red-100 rounded-sm" 
                    style={{ height: `${Math.random() * 50 + 50}px` }}
                  ></div>
                  <span className="text-xs mt-2 text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Daily Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-medium">Daily Steps</h3>
              </div>
              <LineChart className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">8,439 steps</p>
              <p className="text-sm text-muted-foreground text-green-600">2k more than average</p>
            </div>
            <div className="h-[150px] mt-4 flex items-end justify-between gap-1">
              {days.map((day) => (
                <div key={day} className="relative flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-100 rounded-sm" 
                    style={{ height: `${Math.random() * 50 + 50}px` }}
                  ></div>
                  <span className="text-xs mt-2 text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Weight */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Weight className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-medium">Weight</h3>
              </div>
              <LineChart className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">68 kg</p>
              <p className="text-sm text-muted-foreground text-green-600">-0.5 kg this week</p>
            </div>
            <div className="h-[150px] mt-4 flex items-end justify-between gap-1">
              {days.map((day) => (
                <div key={day} className="relative flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-green-100 rounded-sm" 
                    style={{ height: `${Math.random() * 30 + 70}px` }}
                  ></div>
                  <span className="text-xs mt-2 text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Sleep Quality */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Moon className="h-6 w-6 text-purple-500" />
                <h3 className="text-lg font-medium">Sleep Quality</h3>
              </div>
              <LineChart className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-3xl font-bold">7.5 hours</p>
              <p className="text-sm text-muted-foreground">Good quality</p>
            </div>
            <div className="h-[150px] mt-4 flex items-end justify-between gap-1">
              {days.map((day) => (
                <div key={day} className="relative flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-purple-100 rounded-sm" 
                    style={{ height: `${Math.random() * 40 + 60}px` }}
                  ></div>
                  <span className="text-xs mt-2 text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthMetrics;
