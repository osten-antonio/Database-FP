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
import { use, useEffect, useState } from "react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { set } from "date-fns";

export default function Warehouse(){
    const [warehouses, setWarehouses] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [create, setCreate] = useState(false);
    const router = useRouter();
    const [confirmation, setConfirmation] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const fetchWarehouses = async (query = '') => {
        try {
            const endpoint = query ? `/warehouse/search?name=${query}` : '/warehouse';
            const res = await api.get(endpoint);
            if (res.status >= 200 && res.status <= 300) {
                setWarehouses(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch warehouses:", err);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchWarehouses(query);
    };

    const handleCreate = async (formData) => {
        try {
            await api.post("/warehouse", formData);
            await fetchWarehouses(searchQuery);
            setCreate(false);
        } catch (err) {
            console.error("Failed to create warehouse:", err);
        }
    };

    const handleEdit = async (formData) => {
        try {
            await api.put(`/warehouse/${selectedWarehouse.warehouse_id}`, formData);
            await fetchWarehouses(searchQuery);
            setCreate(false);
            setIsEditing(false);
            setSelectedWarehouse(null);
        } catch (err) {
            console.error("Failed to edit warehouse:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/warehouse/${selectedWarehouse.warehouse_id}`);
            await fetchWarehouses(searchQuery);
            setConfirmation(false);
            setSelectedWarehouse(null);
        } catch (err) {
            console.error("Failed to delete warehouse:", err);
        }
    };

    useEffect(() => {
        const keys = Object.keys(rowSelection);
        console.log(rowSelection);
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
            accessorKey: 'actions',
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
                            <DropdownMenuItem onClick={() => {
                                setSelectedWarehouse(row.original);
                                setIsEditing(true);
                                setCreate(true);
                            }}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setSelectedWarehouse(row.original);
                                setConfirmation(true);
                            }}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    const tableProps = {
        data: warehouses,
        columns,
        enableRowSelection: true,
        idName: 'warehouse_id',
        setRowSelection: setRowSelection,
        rowSelection: rowSelection
    }
    return (
        <>
        <CreateWindow 
            setOpen={setCreate} 
            isOpen={create}
            onSubmit={isEditing ? handleEdit : handleCreate}
            editData={isEditing ? selectedWarehouse : null}
        />
        <Dialog open={confirmation} onOpenChange={setConfirmation} >
            <DialogContent className="[&~.fixed.inset-0]:bg-transparent">
                <DialogHeader>
                <DialogTitle className='text-text-dark'>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. Are you sure you want to permanently
                    delete this warehouse from our servers?
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmation(false)}>Cancel</Button>
                <Button onClick={handleDelete} className='bg-red-600 hover:bg-red-700'>Confirm Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <div className="p-6 pl-10 w-screen xl:ml-auto xl:w-6/7 2xl:w-8/9 mt-12">          

            <h1 className='text-text-dark text-3xl font-bold mb-4'>
                Warehouse
            </h1>
            <div className='flex h-10 flex-row flex-wrap justify-between gap-2 w-full'>
                <div className="mt-auto">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                            <BreadcrumbLink href="/home/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                            <BreadcrumbPage href='/home/warehouse'>Warehouse</BreadcrumbPage>
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