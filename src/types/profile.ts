
export interface UserProfile {
  id: string;
  email: string;
  role?: 'patient' | 'doctor';
  user_metadata?: {
    full_name?: string;
    phone?: string;
    address?: string;
    blood_type?: string;
    [key: string]: any;
  };
}

export interface MedicalCondition {
  condition: string;
  diagnosedYear: string;
  status: string;
}

export interface Allergy {
  name: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  rating: number;
  reviews: number;
  fee: string;
  availableToday: boolean;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
