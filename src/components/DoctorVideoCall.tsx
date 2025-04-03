
import { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Log patient ID for debugging
  useEffect(() => {
    if (patientId) {
      console.log(`Video call initialized with patient ID: ${patientId}`);
    }
  }, [patientId]);

  useEffect(() => {
    if (open) {
      initializeCall();
    } else {
      endCall();
    }

    return () => {
      endCall();
    };
  }, [open]);

  const initializeCall = async () => {
    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      peerConnectionRef.current = new RTCPeerConnection(configuration);

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        if (peerConnectionRef.current && localStreamRef.current) {
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        }
      });

      // Handle incoming tracks
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // In a real app, you would set up signaling here
      // For demo purposes, we'll simulate a connection after a delay
      setTimeout(() => {
        setIsConnecting(false);
        toast({
          title: "Connected",
          description: `You are now in a call with ${doctorName}`,
        });
      }, 2000);

    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Connection failed",
        description: "Could not access camera or microphone",
        variant: "destructive",
      });
      onOpenChange?.(false);
    }
  };

  const endCall = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    toast({
      title: "Call ended",
      description: `Call with ${doctorName} has ended`,
    });
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Call with {doctorName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 relative bg-black rounded-md overflow-hidden">
          {/* Remote video (doctor) - takes full space */}
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
          />
          
          {isConnecting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <img 
                src={doctorImage} 
                alt={doctorName} 
                className="w-24 h-24 rounded-full object-cover border-2 border-white mb-4" 
              />
              <p className="text-lg">Connecting to {doctorName}...</p>
              <div className="mt-3 h-2 w-40 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-health-primary animate-pulse"></div>
              </div>
            </div>
          )}
          
          {/* Local video (patient) - small overlay */}
          <div className="absolute bottom-4 right-4 w-32 h-24 rounded-md overflow-hidden border-2 border-white shadow-lg">
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Call controls */}
        <div className="flex justify-center space-x-4 mt-4">
          <Button 
            variant="outline" 
            size="icon" 
            className={isMuted ? "bg-red-100 text-red-500" : ""} 
            onClick={toggleMute}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="rounded-full h-12 w-12"
            onClick={handleEndCall}
          >
            <Phone className="transform rotate-135" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={isVideoOff ? "bg-red-100 text-red-500" : ""} 
            onClick={toggleVideo}
          >
            {isVideoOff ? <VideoOff /> : <Video />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorVideoCall;
