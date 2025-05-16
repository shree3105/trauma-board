'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js'; 

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null); 
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); 
      setLoading(false);
      if (!session) router.push('/login');
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
