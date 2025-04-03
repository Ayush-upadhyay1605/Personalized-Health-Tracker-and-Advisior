
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
          <Card key={index} className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/4 p-6 flex items-center justify-center">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <CardContent className="p-6 md:w-3/4">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                  <div className="flex space-x-2 mt-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Skeleton className="h-10 w-36" />
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredDoctors.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No doctors found matching your criteria.</p>
            <p className="text-gray-500 text-sm">Try adjusting your search filters or try a different specialty.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">{filteredDoctors.length} doctors found</p>
      {filteredDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;
