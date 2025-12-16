'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useToken } from './context/TokenContext';


export default function Auth() {
  const router = useRouter();
  const token = useToken();


  useEffect(()=>{
    if(token){
      router.push('/home');
    }
    router.push('/home');
  },[])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        
      </div>
    </div>
  );
}
