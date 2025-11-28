"use client"
import { useState, useEffect } from 'react';
import api from '@/lib/axios'
import { CreateWindow } from '@/components/sections/product/create';
import { FilterWindow } from '@/components/sections/product/filter';
import { DataTable } from '@/components/layout/BasicLayout';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { ListFilter } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useParams } from "next/navigation";

export default function Products(){
    const [products,setProducts] = useState([]);
    const [isFilter, setFilter] = useState(false);
    const [filters, setFilters] = useState(undefined);
    const [isCreate, setCreate] = useState(false);
    const id = useParams().id;

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
                    <Button className='mx-0'>
                        <EllipsisVertical />
                    </Button>
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
        <div className="w-full">          
            <FilterWindow isOpen={isFilter} setOpen={setFilter} filters={filters} setFilters={setFilters}/>
            <CreateWindow isOpen={isCreate} setOpen={setCreate}/>

            <h1 className='text-text-dark text-3xl font-bold mb-4'>
                {name}
            </h1>
            <div className='flex flex-row flex-wrap justify-between gap-2 w-full'>
                <Breadcrumb className="mt-auto">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href='/warehouse'>Warehouse</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/warehouse/${id}`}>idk</BreadcrumbLink> {/* TODO */}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage href={`/warehouse/${id}/product`}>Products</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className='w-xl flex flex-row gap-2'>
                    <button 
                        onClick={()=>{setCreate(true)}}
                        className='bg-primary p-2 px-10 rounded-lg text-text-light font-semibold shadow-md shadow-accent-dark'
                    >
                        Add
                    </button>
                    <form className='w-full min-w-[250px] grow'>
                        <input type='text' className='bg-primary-light h-full w-full rounded-md text-text-light px-2 shadow-md shadow-accent-dark' placeholder='Search'/>
                    </form>
                    <button 
                        onClick={()=>{setFilter(true)}}
                        className='shadow-md shadow-accent-dark flex flex-nowrap gap-2 bg-primary p-2 px-5 rounded-lg text-text-light font-semibold'
                    >
                        <ListFilter/>
                        Filter
                    </button>
                </div>
            </div>
            <DataTable {...tableProps}/>
        </div>
    )
}