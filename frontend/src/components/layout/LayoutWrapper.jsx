'use client'
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";

export function LayoutWrapper({children}){
    const [open,setOpen] = useState(false);

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