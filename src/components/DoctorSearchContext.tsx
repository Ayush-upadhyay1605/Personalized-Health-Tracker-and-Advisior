
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DoctorSearchContextType = {
  showMoreDoctors: boolean;
  setShowMoreDoctors: (show: boolean) => void;
};

const DoctorSearchContext = createContext<DoctorSearchContextType | undefined>(undefined);

export const DoctorSearchProvider = ({ children }: { children: ReactNode }) => {
  const [showMoreDoctors, setShowMoreDoctors] = useState(false);

  useEffect(() => {
    // Check if the user clicked the "Find Doctors" button on the home page
    const showMoreFlag = localStorage.getItem('showMoreDoctors');
    if (showMoreFlag === 'true') {
      setShowMoreDoctors(true);
      // Clear the flag after we've processed it
      localStorage.removeItem('showMoreDoctors');
    }
  }, []);

  return (
    <DoctorSearchContext.Provider value={{ showMoreDoctors, setShowMoreDoctors }}>
      {children}
    </DoctorSearchContext.Provider>
  );
};

export const useDoctorSearch = (): DoctorSearchContextType => {
  const context = useContext(DoctorSearchContext);
  if (context === undefined) {
    throw new Error('useDoctorSearch must be used within a DoctorSearchProvider');
  }
  return context;
};
