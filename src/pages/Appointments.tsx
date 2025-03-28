
import { useState } from 'react';
import { Calendar, Video, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import DoctorVideoCall from '@/components/DoctorVideoCall';
import DoctorChat from '@/components/DoctorChat';

const Appointments = () => {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const appointments = [
    {
      doctorName: 'Dr. Smith',
      specialty: 'Cardiologist',
      date: 'Today, 11:00 AM',
      hospital: 'Central Hospital',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      doctorName: 'Dr. Johnson',
      specialty: 'Endocrinologist',
      date: 'Mar 28, 2:30 PM',
      hospital: 'Medical Center',
      status: 'Scheduled',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      doctorName: 'Dr. Williams',
      specialty: 'Neurologist',
      date: 'Mar 15, 10:00 AM',
      hospital: 'Health Clinic',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      doctorName: 'Dr. Brown',
      specialty: 'Ophthalmologist',
      date: 'Mar 10, 9:15 AM',
      hospital: 'Vision Center',
      status: 'Completed',
      image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
  ];

  const handleVideoCall = (doctor) => {
    setSelectedDoctor(doctor);
    setIsVideoCallOpen(true);
  };

  const handleChat = (doctor) => {
    setSelectedDoctor(doctor);
    setIsChatOpen(true);
  };

  const nextAppointment = appointments.find(app => app.status === 'Upcoming');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Appointments</h1>
      
      {/* Next Appointment */}
      {nextAppointment && (
        <Card className="bg-gradient-to-r from-health-primary/10 to-health-secondary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full">
                  <Calendar className="h-6 w-6 text-health-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Next Appointment</h3>
                  <p className="text-xl font-bold mt-1">{nextAppointment.doctorName} - {nextAppointment.specialty}</p>
                  <p className="text-muted-foreground">{nextAppointment.date} - {nextAppointment.hospital}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="border-health-primary text-health-primary hover:bg-health-primary/10"
                  onClick={() => handleChat(nextAppointment)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button 
                  className="bg-health-primary hover:bg-health-primary/90"
                  onClick={() => handleVideoCall(nextAppointment)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                <TableHead>Actions</TableHead>
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
                  <TableCell>
                    {(appointment.status === 'Upcoming' || appointment.status === 'Scheduled') && (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 px-2 text-health-primary"
                          onClick={() => handleChat(appointment)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 px-2 text-health-primary"
                          onClick={() => handleVideoCall(appointment)}
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Video Call Dialog */}
      {selectedDoctor && (
        <DoctorVideoCall 
          doctorName={selectedDoctor.doctorName}
          doctorImage={selectedDoctor.image}
          open={isVideoCallOpen}
          onOpenChange={setIsVideoCallOpen}
        />
      )}

      {/* Chat Drawer */}
      {selectedDoctor && (
        <DoctorChat 
          doctorName={selectedDoctor.doctorName}
          doctorImage={selectedDoctor.image}
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
        />
      )}
    </div>
  );
};

export default Appointments;
