
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Appointments = () => {
  const appointments = [
    {
      doctorName: 'Dr. Smith',
      specialty: 'Cardiologist',
      date: 'Today, 11:00 AM',
      hospital: 'Central Hospital',
      status: 'Upcoming'
    },
    {
      doctorName: 'Dr. Johnson',
      specialty: 'Endocrinologist',
      date: 'Mar 28, 2:30 PM',
      hospital: 'Medical Center',
      status: 'Scheduled'
    },
    {
      doctorName: 'Dr. Williams',
      specialty: 'Neurologist',
      date: 'Mar 15, 10:00 AM',
      hospital: 'Health Clinic',
      status: 'Completed'
    },
    {
      doctorName: 'Dr. Brown',
      specialty: 'Ophthalmologist',
      date: 'Mar 10, 9:15 AM',
      hospital: 'Vision Center',
      status: 'Completed'
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Appointments</h1>
      
      {/* Next Appointment */}
      <Card className="bg-gradient-to-r from-health-primary/10 to-health-secondary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full">
                <Calendar className="h-6 w-6 text-health-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Next Appointment</h3>
                <p className="text-xl font-bold mt-1">Dr. Smith - Cardiologist</p>
                <p className="text-muted-foreground">Today at 11:00 AM - Central Hospital</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-health-primary text-white rounded-lg hover:bg-health-primary/90 transition-colors">
              View Details
            </button>
          </div>
        </CardContent>
      </Card>
      
      {/* All Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.hospital}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === 'Upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.status === 'Scheduled'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;
