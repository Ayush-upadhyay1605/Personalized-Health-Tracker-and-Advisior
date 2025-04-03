
import { supabase } from '@/integrations/supabase/client';
import { Doctor } from '@/types/doctor';

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    // Query all users with role=doctor from Supabase
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }
    
    // Fix the TypeScript error by properly handling the users array
    const users = data?.users || [];
    
    // Filter users with role 'doctor' and map to our Doctor interface
    const doctorUsers = users
      .filter(user => user.user_metadata?.role === 'doctor')
      .map(user => ({
        id: user.id,
        name: user.user_metadata?.full_name || 'Unknown Doctor',
        specialty: user.user_metadata?.specialty || 'General Medicine',
        hospital: user.user_metadata?.hospital || 'Unknown Hospital',
        email: user.email || '',
        rating: 4.8, // Default rating for now
        location: user.user_metadata?.location || 'Unknown Location',
        image: user.user_metadata?.image || '/placeholder.svg',
        fee: user.user_metadata?.fee || '$100',
        availability: user.user_metadata?.availability || ['Today']
      }));
    
    // Sample doctor data as fallback
    const sampleDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. Sample',
        specialty: 'General Medicine',
        hospital: 'General Hospital',
        email: 'doctor@example.com',
        rating: 4.8,
        location: 'New York, NY',
        image: '/placeholder.svg',
        fee: '$100',
        availability: ['Today', 'Tomorrow']
      },
      {
        id: '2',
        name: 'Dr. Jane Smith',
        specialty: 'Cardiology',
        hospital: 'Heart Center',
        email: 'drjane@example.com',
        rating: 4.9,
        location: 'Boston, MA',
        image: '/placeholder.svg',
        fee: '$150',
        availability: ['Tomorrow']
      },
      {
        id: '3',
        name: 'Dr. Michael Wong',
        specialty: 'Pediatrics',
        hospital: 'Children\'s Hospital',
        email: 'drwong@example.com',
        rating: 4.7,
        location: 'San Francisco, CA',
        image: '/placeholder.svg',
        fee: '$120',
        availability: ['Today', 'Tomorrow']
      }
    ];
    
    // Return real doctors if any, otherwise use sample data
    return doctorUsers.length > 0 ? doctorUsers : sampleDoctors;
  } catch (error) {
    console.error('Error in doctor search:', error);
    // Fallback to sample data
    return [
      {
        id: '1',
        name: 'Dr. Sample',
        specialty: 'General Medicine',
        hospital: 'General Hospital',
        email: 'doctor@example.com',
        rating: 4.8,
        location: 'New York, NY',
        image: '/placeholder.svg',
        fee: '$100',
        availability: ['Today', 'Tomorrow']
      },
      {
        id: '2',
        name: 'Dr. Jane Smith',
        specialty: 'Cardiology',
        hospital: 'Heart Center',
        email: 'drjane@example.com',
        rating: 4.9,
        location: 'Boston, MA',
        image: '/placeholder.svg',
        fee: '$150',
        availability: ['Tomorrow']
      },
      {
        id: '3',
        name: 'Dr. Michael Wong',
        specialty: 'Pediatrics',
        hospital: 'Children\'s Hospital',
        email: 'drwong@example.com',
        rating: 4.7,
        location: 'San Francisco, CA',
        image: '/placeholder.svg',
        fee: '$120',
        availability: ['Today', 'Tomorrow']
      }
    ];
  }
};
