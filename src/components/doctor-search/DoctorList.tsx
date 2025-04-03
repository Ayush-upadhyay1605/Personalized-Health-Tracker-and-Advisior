
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DoctorCard from './DoctorCard';
import { Doctor } from '@/types/doctor';

interface DoctorListProps {
  loading: boolean;
  filteredDoctors: Doctor[];
}

const DoctorList = ({ loading, filteredDoctors }: DoctorListProps) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array(3).fill(0).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredDoctors.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No doctors found matching your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {filteredDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;
