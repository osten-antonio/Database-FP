'use client'

import { usePathname } from 'next/navigation';
import { LayoutDashboard, NotebookText, PackageSearch,Warehouse,HandPlatter,Users } from 'lucide-react'
import { SidebarButton } from '../SidebarButton';


export function Sidebar({isOpen}){
    const pathname = usePathname();
    return (
        <div className={`
            w-screen sm:w-fit bg-primary-dark flex text-text flex-col p-4
            ${isOpen ? 'block' : 'hidden'} xl:block pt-20 fixed z-5 h-full
            `}>
            <ul className=''>
                <SidebarButton Icon={LayoutDashboard} label='Dashboard' route='/' pathname={pathname} />
                <SidebarButton Icon={NotebookText} label='Orders' route='/order' pathname={pathname} />
                <SidebarButton Icon={PackageSearch} label='Products' route='/order' pathname={pathname} />
                <SidebarButton Icon={Warehouse} label='Warehouses' route='/order' pathname={pathname} />
                <SidebarButton Icon={HandPlatter} label='Suppliers' route='/order' pathname={pathname} />
                <SidebarButton Icon={Users} label='Customers' route='/order' pathname={pathname} />
            </ul>
        </div>
    )
}