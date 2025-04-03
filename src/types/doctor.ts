
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
  consultationTypes?: {
    video?: {
      available: boolean;
      fee: string;
    };
    chat?: {
      available: boolean;
      fee: string;
    };
    inPerson?: {
      available: boolean;
      fee: string;
    };
  };
  bio?: string;
}
