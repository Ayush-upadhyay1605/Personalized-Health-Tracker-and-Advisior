
export interface UserProfile {
  id: string;
  email: string;
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
