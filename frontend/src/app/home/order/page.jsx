"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios'
import { BasicLayout } from '@/components/layout/BasicLayout';
import { FilterWindow } from '@/components/sections/order/filter';
import { CreateWindow } from '@/components/sections/order/create';
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

export default function Order() {
    // TODO context for all of the useEffect get functions, redundant API calls in create and filter
    const [orders,setOrders] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [confirmation, setConfirmation] = useState(false);

    const columns = [
        {
            accessorKey: "order_id",
            header: "ID",
            cell: ({ row }) => <span>{row.getValue("order_id")}</span>,
        },
        {
            accessorKey: "customer_name",
            header: "Customer",
        },
        {
            accessorKey: "item",
            header: "Item",
        },
        {
            accessorKey: "amount",
            header: "Amount",
        },
        {
            accessorKey: "cost",
            header: "Cost",
            cell: ({ row }) => {
                const price = Number(row.getValue("cost"));
                const formatted = price % 1 === 0 ? price.toString() : price.toFixed(3);
                return formatted;
            }
        },
        {
            accessorKey: "order_date",
            header: "Date ordered",
        },
        {
            accessorKey: "expected_delivery_date",
            header: "Delivery date",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "warehouse_name",
            header: "Warehouse",
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
                        <DropdownMenuItem onClick={() => console.log("Edit")}>
                        Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setConfirmation(true)}>
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ];



    useEffect(()=>{
        async function getOrders(){
            try {
                const res = await api.get("/orders");
                if (res.status >= 200 && res.status <= 300) {
                    setOrders(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getOrders();
    },[]);

    useEffect(()=>{
        console.log(rowSelection);
    },[rowSelection]);

    const tableProps = {
        data:orders,
        enableRowSelection: true,
        idName: 'order_id',
        columns,
        setRowSelection,
        rowSelection
    }
    return(
        <>
            <Dialog open={confirmation} onOpenChange={setConfirmation} >
                <DialogContent className="[&~.fixed.inset-0]:bg-transparent">
                    <DialogHeader>
                    <DialogTitle className='text-text-dark'>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this order from our servers?
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <Button type="submit">Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <BasicLayout name='Orders' 
                tableProps={tableProps} 
                FilterWindow={FilterWindow} 
                CreateWindow={CreateWindow}
            />
        </>
    )
}