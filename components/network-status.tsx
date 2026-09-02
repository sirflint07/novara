"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";

export const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const toastIdRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    
    if (!navigator.onLine) {
      const id = toast.error("Internet disconnected, please try reconnecting", {
        icon: <WifiOff className="h-4 w-4"/>,
        duration: Infinity,
        position: "bottom-right",
        className: "bg-red-50 border-red-200 text-red-800",
        closeButton: true
      });
      toastIdRef.current = id;
    }

    const handleOnline = () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = undefined;
      }
      toast.success("Internet connection restored", {
        icon: <Wifi className="h-4 w-4" />,
        duration: 3000,
        position: "bottom-right",
        className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      });
    };

    const handleOffline = () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = undefined;
      }
      const id = toast.error("Internet disconnected, please try reconnecting", {
        icon: <WifiOff className="h-4 w-4" />,
        duration: Infinity,
        position: "bottom-right",
        className: "bg-red-50 border-red-200 text-red-800",
        dismissible: true,
        onDismiss(toast) {
          toastIdRef.current = undefined;
        },
        closeButton: true
      });
      toastIdRef.current = id;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, []);

 return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOnline && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-medium shadow-lg">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Offline
        </div>
      )}
    </div>
  );
};