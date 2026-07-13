"use client";

import { useState, useEffect } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { toast } from "sonner";

interface MuxPlayerWrapperProps {
  playbackId: string | null;
  className?: string;
}

const MuxPlayerWrapper = ({ playbackId, className }: MuxPlayerWrapperProps) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (playbackId) {
     
      console.log("MuxPlayerWrapper - playbackId:", playbackId);
      const checkAssetStatus = async () => {
        try {
        const response = await fetch(`/api/mux/asset-status?playbackId=${playbackId}`);
        const data = await response.json();
          
          if (data.ready) {
            setIsReady(true);
          } else {
            
            setTimeout(checkAssetStatus, 5000);
            console.log("Asset still processing...");
          }
        } catch (err) {
          console.error("Failed to check asset status:", err);
          
          setIsReady(true);
        }
      };
      
      checkAssetStatus();
    }
  }, [playbackId]);

  if (!playbackId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <p className="text-sm">No video available</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
        <p className="text-sm text-gray-500">Processing video... This may take a moment.</p>
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      muted={false}
      autoPlay={false}
      loop={false}
      style={{backgroundColor: "black"}}
      primaryColor="#000eee"
      accentColor="#ffffff"
      className={className}
      
       onError={(error) => {
        console.error("MuxPlayer error:", error);
        setError("Failed to load video");
        toast.error("Failed to load video");
      }}
      
      onLoadedData={() => {
        console.log("Video loaded successfully");
        setIsReady(true);
        setError(null);
      }}
    />
  );
};

export default MuxPlayerWrapper;