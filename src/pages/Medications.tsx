
import { Pill, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Medications = () => {
  const medications = [
    {
      name: 'Lisinopril',
      dosage: '10mg - Once daily',
      time: '8:00 AM',
      status: 'taken'
    },
    {
      name: 'Metformin',
      dosage: '500mg - Twice daily',
      time: '2:00 PM',
      status: 'upcoming'
    },
    {
      name: 'Vitamin D',
      dosage: '2000 IU - Once daily',
      time: '8:00 AM',
      status: 'taken'
    },
    {
      name: 'Aspirin',
      dosage: '81mg - Once daily',
      time: '8:00 PM',
      status: 'upcoming'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Medications</h1>
      
      {/* Medication Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Pill className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="text-muted-foreground mb-1">Active Medications</h3>
              <p className="text-3xl font-bold">4</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-amber-500 mb-2" />
              <h3 className="text-muted-foreground mb-1">Next Dose</h3>
              <p className="text-3xl font-bold">2:00 PM</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="text-muted-foreground mb-1">Taken Today</h3>
              <p className="text-3xl font-bold">3/4</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Medication Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medications.map((med, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex gap-3">
                  <Pill className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <h3 className="font-medium">{med.name}</h3>
                    <p className="text-sm text-muted-foreground">{med.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{med.time}</span>
                  <span 
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      med.status === 'taken' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {med.status === 'taken' ? 'Taken' : 'Upcoming'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Medications;
