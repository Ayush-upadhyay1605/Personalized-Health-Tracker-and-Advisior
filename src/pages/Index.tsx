import { useState } from 'react';
import { Calendar, Activity, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/features/FeatureCard';
import FeatureItem from '../components/features/FeatureItem';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDashboardClick = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      navigate('/dashboard');
    } else {
      // Handle not logged in state
      console.log('User is not logged in');
      toast({
        title: "Authentication required",
        description: "Please sign in to view your dashboard",
        variant: "destructive",
      });
    }
  };

  const handleFindDoctorsClick = () => {
    navigate('/appointments');
  };

  return (
    <div className="min-h-screen bg-health-light">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Your Personal Health Companion
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Choose how you'd like to take care of your health today
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto animate-fade-in-up">
          <FeatureCard
            icon={
              <div className="feature-icon-bg bg-health-primary/10">
                <Calendar className="h-8 w-8 text-health-primary" />
              </div>
            }
            title="Book Doctor Appointment"
            description="Find and schedule appointments with trusted healthcare providers in your area"
            buttonText="Find Doctors"
            buttonColor="bg-health-primary hover:bg-health-primary/90"
            onButtonClick={handleFindDoctorsClick}
          />
          
          <FeatureCard
            icon={
              <div className="feature-icon-bg bg-health-secondary/10">
                <Activity className="h-8 w-8 text-health-secondary" />
              </div>
            }
            title="Track Your Fitness"
            description="Monitor your daily activities, heart rate, and other vital health metrics"
            buttonText="View Dashboard"
            buttonColor="bg-health-secondary hover:bg-health-secondary/90"
            onButtonClick={handleDashboardClick}
          />
        </div>
      </section>
      
      {/* Why Choose Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Why Choose HealthHub?</h2>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureItem
            icon={<Calendar className="h-8 w-8 text-health-primary" />}
            title="Easy Scheduling"
            description="Book appointments with just a few clicks"
            bgColor="bg-health-primary/10"
          />
          
          <FeatureItem
            icon={<Activity className="h-8 w-8 text-health-secondary" />}
            title="Health Tracking"
            description="Monitor your vital signs and daily activities"
            bgColor="bg-health-secondary/10"
          />
          
          <FeatureItem
            icon={<Users className="h-8 w-8 text-blue-500" />}
            title="Expert Care"
            description="Connect with qualified healthcare providers"
            bgColor="bg-blue-100"
          />
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-health-primary/5 to-health-secondary/5">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to take control of your health?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of users who've improved their health with HealthHub.
          </p>
          <button 
            className="bg-health-primary text-white py-3 px-8 rounded-lg hover:bg-health-primary/90 transition-all duration-300 shadow-sm hover:shadow"
            onClick={handleDashboardClick}
          >
            Get Started Today
          </button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
