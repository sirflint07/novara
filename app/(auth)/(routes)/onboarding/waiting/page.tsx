"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function WaitingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkUserStatus = async () => {
      try {
        const response = await axios.get('/api/user/status');
        
        if (response.data.exists) {
          router.push('/onboarding/role-selection');
          return;
        }

        if (attempts >= 10) {
          
          setError(true);
          router.push('/onboarding/role-selection');
          return;
        }

        setAttempts(prev => prev + 1);
        setTimeout(checkUserStatus, 2000);
      } catch (error) {
        console.error('Error checking user status:', error);
        if (attempts >= 10) {
          router.push('/onboarding/role-selection');
          return;
        }
        setAttempts(prev => prev + 1);
        setTimeout(checkUserStatus, 2000);
      }
    };

    checkUserStatus();
  }, [isLoaded, user, router, attempts]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Setting up your account...</p>
      <p className="text-sm text-gray-400 mt-2">This will only take a moment</p>
      <p className="text-xs text-gray-300 mt-4">Attempt {attempts} of 10</p>
    </div>
  );
}