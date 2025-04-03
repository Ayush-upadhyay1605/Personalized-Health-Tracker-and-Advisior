
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
        availability: user.user_metadata?.availability || ['Today'],
        consultationTypes: user.user_metadata?.consultationTypes || {
          video: { available: true, fee: '$150' },
          chat: { available: true, fee: '$100' },
          inPerson: { available: true, fee: '$200' }
        },
        bio: user.user_metadata?.bio || 'Experienced doctor dedicated to patient care.'
      }));
    
    // Sample doctor data as fallback
    const sampleDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. John Smith',
        specialty: 'General Medicine',
        hospital: 'General Hospital',
        email: 'doctor@example.com',
        rating: 4.8,
        location: 'New York, NY',
        image: '/placeholder.svg',
        fee: '$100',
        availability: ['Today', 'Tomorrow'],
        consultationTypes: {
          video: { available: true, fee: '$150' },
          chat: { available: true, fee: '$100' },
          inPerson: { available: true, fee: '$200' }
        },
        bio: 'Dr. Smith is a board-certified physician with over 15 years of experience.'
      },
      {
        id: '2',
        name: 'Dr. Jane Williams',
        specialty: 'Cardiology',
        hospital: 'Heart Center',
        email: 'drjane@example.com',
        rating: 4.9,
        location: 'Boston, MA',
        image: '/placeholder.svg',
        fee: '$150',
        availability: ['Tomorrow'],
        consultationTypes: {
          video: { available: true, fee: '$200' },
          chat: { available: true, fee: '$150' },
          inPerson: { available: true, fee: '$250' }
        },
        bio: 'Specialized in heart conditions with a focus on preventive care.'
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
        availability: ['Today', 'Tomorrow'],
        consultationTypes: {
          video: { available: true, fee: '$160' },
          chat: { available: true, fee: '$100' },
          inPerson: { available: true, fee: '$180' }
        },
        bio: 'Compassionate pediatrician with expertise in child development.'
      },
      {
        id: '4',
        name: 'Dr. Sarah Johnson',
        specialty: 'Dermatology',
        hospital: 'Skin Care Clinic',
        email: 'drsarah@example.com',
        rating: 4.6,
        location: 'Chicago, IL',
        image: '/placeholder.svg',
        fee: '$160',
        availability: ['Today'],
        consultationTypes: {
          video: { available: true, fee: '$180' },
          chat: { available: true, fee: '$120' },
          inPerson: { available: true, fee: '$220' }
        },
        bio: 'Specialized in skin conditions and cosmetic dermatology.'
      },
      {
        id: '5',
        name: 'Dr. Robert Chen',
        specialty: 'Orthopedics',
        hospital: 'Joint & Spine Center',
        email: 'drrobert@example.com',
        rating: 4.9,
        location: 'Los Angeles, CA',
        image: '/placeholder.svg',
        fee: '$180',
        availability: ['Tomorrow'],
        consultationTypes: {
          video: { available: true, fee: '$200' },
          chat: { available: true, fee: '$150' },
          inPerson: { available: true, fee: '$250' }
        },
        bio: 'Expert in joint replacement and sports medicine.'
      },
      {
        id: '6',
        name: 'Dr. Lisa Patel',
        specialty: 'Neurology',
        hospital: 'Neurological Institute',
        email: 'drlisa@example.com',
        rating: 4.8,
        location: 'Seattle, WA',
        image: '/placeholder.svg',
        fee: '$190',
        availability: ['Today', 'Tomorrow'],
        consultationTypes: {
          video: { available: true, fee: '$220' },
          chat: { available: true, fee: '$170' },
          inPerson: { available: true, fee: '$250' }
        },
        bio: 'Focused on neurological disorders with advanced diagnostic techniques.'
      },
      {
        id: '7',
        name: 'Dr. David Kim',
        specialty: 'Psychiatry',
        hospital: 'Mental Health Center',
        email: 'drdavid@example.com',
        rating: 4.7,
        location: 'Austin, TX',
        image: '/placeholder.svg',
        fee: '$170',
        availability: ['Tomorrow'],
        consultationTypes: {
          video: { available: true, fee: '$200' },
          chat: { available: true, fee: '$150' },
          inPerson: { available: true, fee: '$230' }
        },
        bio: 'Compassionate psychiatrist specializing in anxiety and depression treatment.'
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
