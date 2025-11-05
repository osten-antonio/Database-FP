'use client'

import { usePathname } from 'next/navigation';
import { LayoutDashboard, NotebookText, PackageSearch,Warehouse,HandPlatter,Users } from 'lucide-react'
import { SidebarButton } from '../SidebarButton';


export function Sidebar({isOpen}){
    const pathname = usePathname();
    return (
        <div className={`
            w-screen sm:w-fit bg-primary-dark flex text-text flex-col p-4
            transform transition-transform duration-300 ease-in-out 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            xl:block pt-20 fixed z-5 h-full xl:translate-x-0
            `}>
            <ul className=''>
                <SidebarButton Icon={LayoutDashboard} label='Dashboard' route='/' pathname={pathname} />
                <SidebarButton Icon={NotebookText} label='Orders' route='/order' pathname={pathname} />
                <SidebarButton Icon={PackageSearch} label='Products' route='/product' pathname={pathname} />
                <SidebarButton Icon={Warehouse} label='Warehouses' route='/warehouse' pathname={pathname} />
                <SidebarButton Icon={HandPlatter} label='Suppliers' route='/supplier' pathname={pathname} />
                <SidebarButton Icon={Users} label='Customers' route='/customer' pathname={pathname} />
            </ul>
        </div>
    )
}