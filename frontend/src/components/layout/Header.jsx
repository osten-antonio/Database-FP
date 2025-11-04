'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react";
import { Squash as Hamburger } from 'hamburger-react'

export function Header({ onMenuClick }){
    const [isOpen, setOpen] = useState(false);

    return (
        <div className="bg-primary w-full p-2 flex justify-between items-center fixed z-15">
            <h1 className="hidden xl:block text-text font-bold text-xl ml-3 m-2">
                Name idk
            </h1>
            <span className="xl:hidden">
                <Hamburger color="#9C9DBF" toggled={isOpen} toggle={setOpen} onToggle={onMenuClick} size={30}/>
            </span>
            <div className="mr-4 flex gap-5 flex-row items-center">
                <span>
                    <p className="text-text text-sm">Username</p>
                    <p className="text-text opacity-75 text-xs text-right">Role</p>
                </span>
                <Avatar>
                    <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" />
                    <AvatarFallback>PFP</AvatarFallback>
                </Avatar>

            </div>
        </div>
    );
}