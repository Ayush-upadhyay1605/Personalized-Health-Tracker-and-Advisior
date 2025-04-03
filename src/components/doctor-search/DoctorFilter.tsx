
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface DoctorFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  specialty: string;
  setSpecialty: (specialty: string) => void;
  location: string;
  setLocation: (location: string) => void;
  handleSearch: () => void;
  specialties: string[];
  locations: string[];
}

const DoctorFilter = ({
  searchTerm,
  setSearchTerm,
  specialty,
  setSpecialty,
  location,
  setLocation,
  handleSearch,
  specialties,
  locations
}: DoctorFilterProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Doctor name or specialty"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="specialty">Specialty</Label>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Any specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any specialty</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Any location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any location</SelectItem>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={handleSearch} 
        className="mt-4 w-full md:w-auto bg-health-primary text-white hover:bg-health-primary/90"
      >
        Search Doctors
      </Button>
    </div>
  );
};

export default DoctorFilter;
