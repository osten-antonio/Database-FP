"use client"
import { useState, useEffect } from 'react';
import api from '@/lib/axios'
import { CreateWindow } from '@/components/sections/product/create';
import { FilterWindow } from '@/components/sections/product/filter';
import { BasicLayout } from '@/components/layout/BasicLayout';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
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

export default function Products(){
    const [products,setProducts] = useState([]);
    const [confirmation, setConfirmation] = useState(false);

    useEffect(()=>{
        async function getProducts(){
            try {
                const res = await api.get("/products");
                if (res.status >= 200 && res.status <= 300) {
                    setProducts(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getProducts();
    },[]);


    const columns = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <span>{row.getValue("id")}</span>,
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "total_sales",
            header: "Total sales",
        },
        {
            accessorKey: "supplier_name",
            header: "Supplier",
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const price = Number(row.getValue("price"));
                const formatted = price % 1 === 0 ? price.toString() : price.toFixed(3);
                return `Rp. ${formatted}`;
            }
        },
        {
            accessorKey: "category_id",
            header: "Category",
            // TODO cell:
        },
        {
            accessorKey: "actions",
            header: "",
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
                            <DropdownMenuItem onSelect={() => setConfirmation(true)}>
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ];

    const tableProps = {
        data:products,
        enableRowSelection: false,
        idName: 'order_id',
        columns,
        setRowSelection:undefined,
        rowSelection:undefined
    }
    
    return (
        <>
            <Dialog open={confirmation} onOpenChange={setConfirmation} >
                <DialogContent className="[&~.fixed.inset-0]:bg-transparent">
                    <DialogHeader>
                    <DialogTitle className='text-text-dark'>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this product from our servers?
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <Button type="submit">Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <BasicLayout name='Products' 
                tableProps={tableProps} 
                FilterWindow={FilterWindow} 
                CreateWindow={CreateWindow}
            />
        </>
    )
}