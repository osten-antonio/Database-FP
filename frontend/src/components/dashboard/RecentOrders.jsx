"use client"
import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import api from '@/lib/axios'




export function RecentOrders(){
    // TODO on click, redirect to order, prefilled with search using id
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchOrders() {
        try {
            const res = await api.get("/orders");
            if (res.status >= 200 && res.status <= 300) {
            setOrders(res.data.slice(0,5));
            }
        } catch (err) {
            console.error(err);
        }
        }

        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); 
        return () => clearInterval(interval);
    }, []);
    return (
        <div className='p-5 rounded-2xl bg-primary-light shadow-md shadow-accent-dark border-primary-dark border-2 w-full mt-5'>
            <p className='text-text text-xl font-bold'>Recent Orders</p>
            <div className="overflow-hidden rounded-lg border-0 mt-5">
            <Table>
                <TableHeader className='my-2 bg-primary'>
                    <TableHead className='text-text-light'>Action</TableHead>
                    <TableHead className='text-text-light'>Order ID</TableHead>
                    <TableHead className='text-text-light'>Customer</TableHead>
                    <TableHead className='text-text-light'>Item</TableHead>
                    <TableHead className='text-text-light'>Amount</TableHead>
                    <TableHead className='text-text-light'>Cost</TableHead>
                    <TableHead className='text-text-light'>Date ordered</TableHead>
                    <TableHead className='text-text-light'>Delivery date</TableHead>
                    <TableHead className='text-text-light'>Status</TableHead>
                    <TableHead className='text-text-light'>Warehouse</TableHead>
                </TableHeader>
                <TableBody className='bg-accent-dark'>
                    {orders.map((order,index) => (
                        <TableRow className='border-accent-dark' key={index}>
                            <TableCell 
                                className="text-text-dark relative 
                                after:content-[''] after:absolute after:right-2 
                                after:top-2 after:bottom-2 
                                after:w-px after:bg-primary
                            ">Action</TableCell>
                            <TableCell 
                                className="text-text-dark relative
                                after:content-[''] after:absolute after:right-2 
                                after:top-2 after:bottom-2 
                                after:w-px after:bg-primary
                            ">{order.order_id}</TableCell>
                            <TableCell 
                                className="text-text-dark relative 
                                after:content-[''] after:absolute after:right-2 
                                after:top-2 after:bottom-2 
                                after:w-px after:bg-primary
                            ">
                                {order.customer_name}
                            </TableCell>
                            <TableCell 
                                className="text-text-dark relative 
                                after:content-[''] after:absolute after:right-2 
                                after:top-2 after:bottom-2 
                                after:w-px after:bg-primary
                            ">{order.item}</TableCell>
                            <TableCell 
                                className="text-text-dark relative 
                                after:content-[''] after:absolute after:right-2 
                                after:top-2 after:bottom-2 
                                after:w-px after:bg-primary
                            ">{order.amount}</TableCell>
                            <TableCell 
                                className="text-text-dark relative 
                                after:content-[''] after:absolute after:right-2 
                                after:top-2 after:bottom-2 
                                after:w-px after:bg-primary
                            ">${order.cost}</TableCell>
                            <TableCell 
                                className="text-text-dark relative 
                                after:content-[''] after:absolute after:right-2 
                                after:top-2 after:bottom-2 
                                after:w-px after:bg-primary
                            ">{order.order_date}</TableCell>
                            <TableCell 
                                className="text-text-dark relative 
                                after:content-[''] after:absolute after:right-2 
                                after:top-2 after:bottom-2 
                                after:w-px after:bg-primary
                            ">{order.expected_delivery_date}</TableCell>
                            <TableCell 
                                className="text-text-dark relative 
                                after:content-[''] after:absolute after:right-2 
                                after:top-2 after:bottom-2 
                                after:w-px after:bg-primary
                            ">{order.status}</TableCell>
                            <TableCell 
                                className="text-text-dark
                            ">{order.warehouse_name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </div>
    )
}