'use client'
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToken } from "@/app/context/TokenContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LayoutWrapper({children}){
    const [open, setOpen] = useState(false);
    const { token } = useToken();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            router.push('/login');
        }
        setIsLoading(false);
    }, [token, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return null;
    }

    const onMenuClick = () => {
        setOpen(!open);
    }

    return (
        <>
            <Header onMenuClick={onMenuClick}/>
            <div className="flex h-full">
                <Sidebar isOpen={open}/>
                {children}
            </div>
        </>
    )
}