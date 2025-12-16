'use client'
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios'
import { BasicLayout, DataTable } from '@/components/layout/BasicLayout';
import { FilterWindow } from '@/components/sections/product/filter';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from '@/components/ui/input';
import { AddProduct } from '@/components/sections/warehouse/AddProduct';
import { RestockOrderTable } from '@/components/sections/warehouse/RestockOrder'

export default function WarehouseProducts(){
    const [products, setProducts] = useState([]);
    const [restockOpen, setRestockOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
        const [isFilter, setFilter] = useState(false);
    const [filters, setFilters] = useState(undefined);
    const [add, setAdd] = useState(false);
    const id = useParams().id;
    const restockTableRef = useRef(null);

    const fetchProducts = async (query = '') => {
        try {
            let endpoint = `/warehouse/${id}/products`;
            
            const res = await api.get(endpoint);
            if (res.status >= 200 && res.status <= 300) {
                let data = res.data || [];
                
                // Apply search filter client-side
                if (query) {
                    data = data.filter(p => 
                        p.name.toLowerCase().includes(query.toLowerCase()) ||
                        p.supplier.toLowerCase().includes(query.toLowerCase())
                    );
                }
                
                setProducts(data);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [id]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchProducts(query);
    };

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
            accessorKey: "ttl_sales",
            header: "Total Sales",
            cell: ({ row }) => <span>Rp. {row.getValue("ttl_sales")}</span>,
        },
        {
            accessorKey: "supplier",
            header: "Supplier",
        },
        {
            accessorKey: "cost",
            header: "Price",
            cell: ({ row }) => {
                const price = Number(row.getValue("cost"));
                const formatted = price % 1 === 0 ? price.toString() : price.toFixed(3);
                return `Rp. ${formatted}`;
            }
        },
        {
            accessorKey: "category_id",
            header: "Category",
        },
        {
            accessorKey: "stock",
            header: "Stock",
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
                            <DropdownMenuItem onClick={() => { 
                                setSelectedProduct(row.original);
                                setRestockOpen(true);
                            }}>
                                Restock
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ];

    
    const tableProps = {
        data: products,
        enableRowSelection: false,
        idName: 'id',
        columns,
        setRowSelection: undefined,
        rowSelection: undefined
    }

    return (
        <>
            <Dialog>
                <DialogContent className="[&~.fixed.inset-0]:bg-transparent">
                    <DialogHeader>
                    <DialogTitle className='text-text-dark'>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this product from your warehouse?
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <Button type="submit">Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AddProduct isOpen={add} setOpen={setAdd} restock={false} id={id} onOrderCreated={() => {
                restockTableRef.current?.fetchRestockOrders?.();
            }} />
            <div className="w-full">          
                <FilterWindow isOpen={isFilter} setOpen={setFilter} filters={filters} setFilters={setFilters}/>
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
                                <BreadcrumbLink href='/home/warehouse'>Warehouse</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/home/warehouse/${id}`}>idk</BreadcrumbLink> {/* TODO */}
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage href={`/home/warehouse/${id}/product`}>Products</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className='w-xl flex flex-row gap-2'>
                        <button 
                            onClick={()=>{setAdd(true)}}
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
            <RestockOrderTable id={id} ref={restockTableRef} />
        </>
    )
}
