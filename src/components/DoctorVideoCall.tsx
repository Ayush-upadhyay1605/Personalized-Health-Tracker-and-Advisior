
import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DoctorVideoCallProps {
  doctorName?: string;
  doctorImage?: string;
  patientId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DoctorVideoCall = ({ 
  doctorName = "Dr. Smith", 
  doctorImage = "/placeholder.svg", 
  patientId,
  open = false, 
  onOpenChange 
}: DoctorVideoCallProps) => {
  const { toast } = useToast();
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  
  // Log patient ID for debugging
  useEffect(() => {
    if (patientId) {
      console.log(`Video call initialized with patient ID: ${patientId}`);
    }
  }, [patientId]);

  // Simulate a connection delay
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setCallStatus('connected');
        toast({
          title: "Call connected",
          description: `You are now connected with the patient`,
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [open, toast]);

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const endCall = () => {
    setCallStatus('ended');
    if (onOpenChange) {
      onOpenChange(false);
    }
    toast({
      title: "Call ended",
      description: "The video call has been ended",
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh] flex flex-col">
        <DrawerHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={doctorImage} 
                alt={doctorName}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <DrawerTitle>{doctorName}</DrawerTitle>
              <span className="ml-3 text-sm text-gray-500">
                {callStatus === 'connecting' ? 'Connecting...' : 
                 callStatus === 'connected' ? 'Connected' : 'Call ended'}
              </span>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={endCall}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        {/* Video container */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center relative">
          {callStatus === 'connecting' ? (
            <div className="text-white text-center">
              <div className="animate-pulse flex flex-col items-center">
                <Video className="h-12 w-12 mb-4" />
                <p>Connecting to patient...</p>
              </div>
            </div>
          ) : callStatus === 'connected' ? (
            <>
              {/* Simulated video feed (replace with actual implementation) */}
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center text-white">
                    <p className="mb-2">Patient Video Feed</p>
                    <p className="text-xs text-gray-400">(Simulated for demo)</p>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <VideoOff className="h-16 w-16 mx-auto mb-2" />
                    <p>Video is off</p>
                  </div>
                )}
              </div>
              
              {/* Doctor video (small overlay) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
                <div className="w-full h-full flex items-center justify-center text-white text-sm">
                  {isVideoOn ? (
                    <>
                      <img 
                        src={doctorImage} 
                        alt="Your video"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-2 text-xs bg-black bg-opacity-50 px-2 py-1 rounded">You</span>
                    </>
                  ) : (
                    <div className="text-center">
                      <VideoOff className="h-8 w-8 mx-auto mb-1" />
                      <p className="text-xs">Your video is off</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-white text-center">
              <p>Call ended</p>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="p-4 flex justify-center space-x-4">
          <Button 
            variant={isAudioOn ? "default" : "destructive"} 
            size="icon" 
            className="rounded-full h-12 w-12"
            onClick={toggleAudio}
          >
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button 
            variant={isVideoOn ? "default" : "destructive"} 
            size="icon" 
            className="rounded-full h-12 w-12"
            onClick={toggleVideo}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="rounded-full h-12 w-12"
            onClick={endCall}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DoctorVideoCall;
