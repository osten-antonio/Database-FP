'use client'
import { Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function InnerWarehouseLayout({ children }){
    const router = useRouter();
    const id = useParams().id;
    const [name,setName] = useState('') 
    
    useEffect(() => {
    const fetchWarehouseName = async () => {
        try {
            const res = await api.get(`/warehouse/get_name/${id}`);
            if (res.status >= 200 && res.status < 300) {
                setName(res.data); 
            }
        } catch (e) {
            console.log(e);
        }
    };

        if (id) fetchWarehouseName();
    }, [id]);
    return (
        <div className="p-6 pl-10 w-screen xl:ml-auto xl:w-6/7 2xl:w-8/9 mt-12">          
            <div className='flex flex-row gap-2'>
                <Button onClick={() => router.back()}>
                    <Undo2 />
                </Button>
                <h1 className='text-text-dark text-3xl font-bold mb-4'>
                    Warehouse - { name }
                </h1>
            </div>
            {children}

        </div>
    )
}