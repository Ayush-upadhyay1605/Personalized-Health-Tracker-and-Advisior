
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  email: string;
  rating?: number;
  location?: string;
  image?: string;
  fee?: string;
  availability?: string[];
}
