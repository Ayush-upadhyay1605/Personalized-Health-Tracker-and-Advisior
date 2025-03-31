
import { useState } from 'react';
import { Heart, Activity, Weight, Moon, BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const HealthMetrics = () => {
  const [timeRange, setTimeRange] = useState('week');
  
  // Mock data for heart rate trend
  const heartRateData = [
    { day: 'Mon', rate: 72 },
    { day: 'Tue', rate: 68 },
    { day: 'Wed', rate: 74 },
    { day: 'Thu', rate: 76 },
    { day: 'Fri', rate: 71 },
    { day: 'Sat', rate: 65 },
    { day: 'Sun', rate: 69 },
  ];

  // Mock data for steps
  const stepsData = [
    { day: 'Mon', steps: 7234 },
    { day: 'Tue', steps: 8512 },
    { day: 'Wed', steps: 6798 },
    { day: 'Thu', steps: 9102 },
    { day: 'Fri', steps: 8439 },
    { day: 'Sat', steps: 10254 },
    { day: 'Sun', steps: 5687 },
  ];

  // Mock data for weight tracking (monthly)
  const weightData = [
    { week: 'Week 1', weight: 69.5 },
    { week: 'Week 2', weight: 69.0 },
    { week: 'Week 3', weight: 68.7 },
    { week: 'Week 4', weight: 68.0 },
  ];

  // Mock data for sleep quality
  const sleepData = [
    { day: 'Mon', hours: 7.2, quality: 'Good' },
    { day: 'Tue', hours: 6.5, quality: 'Fair' },
    { day: 'Wed', hours: 8.0, quality: 'Excellent' },
    { day: 'Thu', hours: 7.5, quality: 'Good' },
    { day: 'Fri', hours: 6.8, quality: 'Fair' },
    { day: 'Sat', hours: 8.5, quality: 'Excellent' },
    { day: 'Sun', hours: 7.8, quality: 'Good' },
  ];

  // Mock data for nutrition breakdown
  const nutritionData = [
    { name: 'Protein', value: 30 },
    { name: 'Carbs', value: 45 },
    { name: 'Fats', value: 20 },
    { name: 'Fiber', value: 5 },
  ];
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Health Metrics</h1>
        <div className="bg-gray-100 rounded-lg p-1">
          <button 
            className={`px-3 py-1 rounded-md transition-colors ${timeRange === 'week' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 rounded-md transition-colors ${timeRange === 'month' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1 rounded-md transition-colors ${timeRange === 'year' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cardiac">Cardiac</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heart Rate Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-lg">Heart Rate</CardTitle>
                  </div>
                  <LineChartIcon className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <p className="text-3xl font-bold">72 bpm</p>
                  <p className="text-sm text-green-600">Within healthy range</p>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={heartRateData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[60, 80]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Daily Steps Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">Daily Steps</CardTitle>
                  </div>
                  <BarChartIcon className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <p className="text-3xl font-bold">8,439 steps</p>
                  <p className="text-sm text-green-600">84% of daily goal</p>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stepsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="steps" fill="#3b82f6" barSize={20} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weight Tracking */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Weight className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg">Weight</CardTitle>
                  </div>
                  <LineChartIcon className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <p className="text-3xl font-bold">68 kg</p>
                  <p className="text-sm text-green-600">-0.5 kg this month</p>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" />
                      <YAxis domain={[67, 70]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Sleep Quality */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-lg">Sleep Quality</CardTitle>
                  </div>
                  <BarChartIcon className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <p className="text-3xl font-bold">7.5 hours</p>
                  <p className="text-sm text-green-600">Good quality sleep</p>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sleepData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#a855f7" barSize={20} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Nutrition Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Nutrition Breakdown</CardTitle>
                <PieChartIcon className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="h-64 col-span-1 md:col-span-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nutritionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {nutritionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium">Daily Nutrition Goals</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Protein: 120g</span>
                        <span className="font-medium">75% completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Carbs: 250g</span>
                        <span className="font-medium">60% completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fats: 70g</span>
                        <span className="font-medium">40% completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Water: 2.5L</span>
                        <span className="font-medium">80% completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cardiac" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Heart Health Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Average Heart Rate</h3>
                    <p className="text-2xl font-bold">72 bpm</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold">
                    BP
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Blood Pressure</h3>
                    <p className="text-2xl font-bold">120/80</p>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center bg-purple-500 rounded-full text-white font-bold">
                    O₂
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Oxygen Saturation</h3>
                    <p className="text-2xl font-bold">98%</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Heart Rate Trends (Last 30 Days)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={Array.from({ length: 30 }, (_, i) => ({ 
                    day: i + 1, 
                    resting: Math.floor(Math.random() * 10) + 65,
                    active: Math.floor(Math.random() * 20) + 90,
                    sleeping: Math.floor(Math.random() * 10) + 55
                  }))} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottomRight', offset: -10 }} />
                    <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="resting" name="Resting HR" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="active" name="Active HR" stroke="#f97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="sleeping" name="Sleeping HR" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                  <Activity className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Daily Steps</h3>
                    <p className="text-2xl font-bold">8,439</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center bg-green-500 rounded-full text-white font-bold">
                    km
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Distance</h3>
                    <p className="text-2xl font-bold">5.2 km</p>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center bg-orange-500 rounded-full text-white font-bold">
                    cal
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Calories</h3>
                    <p className="text-2xl font-bold">425</p>
                  </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center bg-indigo-500 rounded-full text-white font-bold">
                    min
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Active Minutes</h3>
                    <p className="text-2xl font-bold">45</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Weekly Activity Breakdown</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stepsData.map(item => ({ 
                      ...item,
                      "Light Activity": Math.floor(Math.random() * 30) + 30,
                      "Moderate Activity": Math.floor(Math.random() * 20) + 10,
                      "Intense Activity": Math.floor(Math.random() * 15),
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Light Activity" stackId="a" fill="#93c5fd" />
                    <Bar dataKey="Moderate Activity" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Intense Activity" stackId="a" fill="#1d4ed8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Macronutrient Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={nutritionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {nutritionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Calorie Intake vs. Goal</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Today's Intake</span>
                        <span className="text-sm font-medium">1,850 / 2,200 cal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Breakfast</h4>
                        <p className="text-xl font-medium">450 cal</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Lunch</h4>
                        <p className="text-xl font-medium">650 cal</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Dinner</h4>
                        <p className="text-xl font-medium">550 cal</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Snacks</h4>
                        <p className="text-xl font-medium">200 cal</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-base font-medium mb-3">Nutrient Goals</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sugar (25g goal)</span>
                            <span className="font-medium">18g</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sodium (2000mg goal)</span>
                            <span className="font-medium">1450mg</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Weekly Calorie Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { day: 'Mon', calories: 2100, goal: 2200 },
                      { day: 'Tue', calories: 1950, goal: 2200 },
                      { day: 'Wed', calories: 2350, goal: 2200 },
                      { day: 'Thu', calories: 2000, goal: 2200 },
                      { day: 'Fri', calories: 1850, goal: 2200 },
                      { day: 'Sat', calories: 2250, goal: 2200 },
                      { day: 'Sun', calories: 1950, goal: 2200 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calories" name="Calories Consumed" stroke="#f97316" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="goal" name="Calorie Goal" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthMetrics;
