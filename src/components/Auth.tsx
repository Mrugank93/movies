"use client"
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';

interface AuthProps {
  children: ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/sign-in');
    }
  }, [router]);

  return <>{children}</>;
};

export default Auth;
