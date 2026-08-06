"use client";

import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import axios from 'axios';

export const UpgradeToInstructor = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/users/upgrade-to-instructor');
      toast.success('You are now an instructor!');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to upgrade to instructor');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      className="bg-indigo-600 hover:bg-indigo-700"
    >
      {isLoading ? 'Upgrading...' : 'Become an Instructor'}
    </Button>
  );
};