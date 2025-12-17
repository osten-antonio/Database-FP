"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import api from '@/lib/axios'
import { useState, useEffect } from "react"

export function RecentOrders(){
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await api.get("/order");
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
                    <TableHead className='text-text-light font-bold'>Order ID</TableHead>
                    <TableHead className='text-text-light font-bold'>Customer</TableHead>
                    <TableHead className='text-text-light font-bold'>Item</TableHead>
                    <TableHead className='text-text-light font-bold'>Amount</TableHead>
                    <TableHead className='text-text-light font-bold'>Cost</TableHead>
                    <TableHead className='text-text-light font-bold'>Date ordered</TableHead>
                    <TableHead className='text-text-light font-bold'>Delivery date</TableHead>
                    <TableHead className='text-text-light font-bold'>Status</TableHead>
                    <TableHead className='text-text-light font-bold'>Warehouse</TableHead>
                </TableHeader>
                <TableBody className='bg-accent-dark'>
                    {orders.map((order,index) => (
                        <TableRow className='border-accent-dark' key={index}>
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