'use client'

import { usePathname } from 'next/navigation';
import { LayoutDashboard, NotebookText, PackageSearch,Warehouse,HandPlatter,Users } from 'lucide-react'
import { SidebarButton } from '@/components/widget/SidebarButton';


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
                <SidebarButton Icon={LayoutDashboard} label='Dashboard' route='/home' pathname={pathname} />
                <SidebarButton Icon={NotebookText} label='Orders' route='/home/order' pathname={pathname} />
                <SidebarButton Icon={PackageSearch} label='Products' route='/home/product' pathname={pathname} />
                <SidebarButton Icon={Warehouse} label='Warehouses' route='/home/warehouse' pathname={pathname} />
                <SidebarButton Icon={HandPlatter} label='Suppliers' route='/home/supplier' pathname={pathname} />
                <SidebarButton Icon={Users} label='Customers' route='/home/customer' pathname={pathname} />
            </ul>
        </div>
    )
}