'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import api from '@/lib/axios'
import { useEffect, useState } from "react";
import { DataTable } from "@/components/layout/BasicLayout";
import { CreateWindow } from "@/components/sections/warehouse/create";
import { useRouter } from 'next/navigation';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Warehouse(){
    const [warehouses, setWarehouses] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [create, setCreate] = useState(false);
    const router = useRouter();

    useEffect(()=>{
        async function getWarehouses(){
            try {
                const res = await api.get("/warehouses");
                if (res.status >= 200 && res.status <= 300) {
                    setWarehouses(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getWarehouses();
    },[]);

    useEffect(() => {
        const keys = Object.keys(rowSelection);
        if (keys.length === 0) return;

        const rawId = keys[0];
        if (!rawId) return;

        const id = rawId.split('-')[0];

        if (id) {
            router.push('warehouse/'+id);
        }
    }, [rowSelection]);
    
    const columns= [
        {
            accessorKey:'warehouse_id',
            header:'ID'
        },
        {
            accessorKey:'name',
            header:'Name'
        },
        {
            accessorKey:'address',
            header:'Address'
        },
        {
            accessorKey:'stock',
            header:'Stock level',
            cell: ({row})=>(<span>1000</span>)
        },
        {
            accessorKey:'total_sales',
            header:'Total sales',
            cell: ({row})=>(<span>Rp. 1,000</span>)
        },{
            accessorKey: 'action',
            header:'',
            cell: ({row})=>{                
                return(
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                        <Button className='mx-0'>
                            <EllipsisVertical />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="end">
                            <DropdownMenuItem onSelect={() => console.log("Edit")}>
                            Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => console.log("Delete")}>
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    const tableProps = {
        data:warehouses,
        columns,
        enableRowSelection: true,
        idName: 'warehouse_id',
        setRowSelection,
        rowSelection
    }
    return (
        <>
        {create && <CreateWindow setOpen={setCreate} isOpen={create}/>}
        
        <div className="p-6 pl-10 w-screen xl:ml-auto xl:w-6/7 2xl:w-8/9 mt-12">          

            <h1 className='text-text-dark text-3xl font-bold mb-4'>
                Warehouse
            </h1>
            <div className='flex h-10 flex-row flex-wrap justify-between gap-2 w-full'>
                <div className="mt-auto">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                            <BreadcrumbPage href='/warehouse'>Warehouse</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className='w-xl flex flex-row gap-2'>
                    <Button
                        className='hover:bg-accent-dark transition-colors duration-200 ease-in-out h-full shadow-accent-dark shadow-md'
                        onClick={() => setCreate(true)}>Create</Button>
                    <form className='w-full min-w-[250px] grow h-10'>
                        <input type='text' className='bg-primary-light h-full w-full rounded-md text-text-light px-2 shadow-md shadow-accent-dark' placeholder='Search'/>
                    </form>
                </div>
                <DataTable {...tableProps}/>
            </div>
        </div>
        </>
    );
 }