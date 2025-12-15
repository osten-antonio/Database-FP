'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react";
import { Squash as Hamburger } from 'hamburger-react'
import { useToken } from '@/app/context/TokenContext'
import { useRouter } from 'next/navigation'

export function Header({ onMenuClick }){
    const [isOpen, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const { logout } = useToken();
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Failed to parse user data:', e);
            }
        }
    }, []);

    const username = user?.username || 'User';
    const role = user?.role || 'Unknown';

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="bg-primary w-full p-2 flex justify-between items-center fixed z-15">
            <h1 className="hidden xl:block text-text font-bold text-xl ml-3 m-2">
                Inventory System
            </h1>
            <span className="xl:hidden">
                <Hamburger color="#9C9DBF" toggled={isOpen} toggle={setOpen} onToggle={onMenuClick} size={30}/>
            </span>
            <div className="mr-4 flex gap-5 flex-row items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex gap-3 hover:bg-transparent cursor-pointer">
                            <span>
                                <p className="text-text text-sm">{username}</p>
                                <p className="text-text opacity-75 text-xs text-right">{role}</p>
                            </span>
                            <Avatar>
                                <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" />
                                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}