'use client'
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios'
import { BasicLayout, DataTable } from '@/components/layout/BasicLayout';
import { FilterWindow } from '@/components/sections/product/filter';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
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
import { Category } from '@/components/widget/Category';
import { useData } from '@/app/context/DataContext';


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
    const [completedOrder, setCompletedOrder] = useState(false);
    const [categoryMap, setCategoryMap] = useState({}); 
    const { categories } = useData();

    useEffect(()=>{
        setCategoryMap(Object.fromEntries(
            categories.map(c => [c.category_id, c])
            ))
    },[categories])

    useEffect(()=>{
        async function getWarehouseProducts(){
            try {
                const res = await api.get(`/warehouse/${id}/products`);
                if (res.status >= 200 && res.status <= 300) {
                    setProducts(res.data.slice(0,5));
                }
            } catch (err) {
                console.error(err);
            }
        }
        getWarehouseProducts();
        setCompletedOrder(false);
    },[completedOrder]);

    // const fetchProducts1 = async (query = '') => {
    //     try {
    //         let endpoint = `/warehouse/${id}/products`;
            
    //         const res = await api.get(endpoint);
    //         if (res.status >= 200 && res.status <= 300) {
    //             let data = res.data || [];
                
    //             // Apply search filter client-side
    //             if (query) {
    //                 data = data.filter(p => 
    //                     p.name.toLowerCase().includes(query.toLowerCase()) ||
    //                     p.supplier.toLowerCase().includes(query.toLowerCase())
    //                 );
    //             }
                
    //             setProducts(data);
    //         }
    //     } catch (err) {
    //         console.error("Failed to fetch products:", err);
    //     }
    // };

    const fetchProducts = async (query = '', appliedFilters = {}) => {
        try {
            let endpoint = `/warehouse/${id}/products`;
            let res;

            const hasActiveFilters =
            appliedFilters.minCost !== "" ||
            appliedFilters.maxCost !== "" ||
            (appliedFilters.suppliers?.length ?? 0) > 0 ||
            (appliedFilters.categories?.length ?? 0) > 0
            if (hasActiveFilters) {
                const params = new URLSearchParams();
                if (appliedFilters.minCost) params.append('min_cost', appliedFilters.minCost);
                if (appliedFilters.maxCost) params.append('max_cost', appliedFilters.maxCost);
                if (appliedFilters.suppliers && appliedFilters.suppliers.length > 0) {
                    const supplierNames = appliedFilters.suppliers.map(s => s.name).join(',');
                    params.append('suppliers', supplierNames);
                }

                
                if (appliedFilters.categories && appliedFilters.categories.length > 0) {
                    const categoryIds = appliedFilters.categories.map(c => c.category_id).join(',');
                    params.append('categories', categoryIds);
                }
                
                
                res = await api.get(`/warehouse/${id}/products/filter?${params.toString()}`);
                if (res.status >= 200 && res.status <= 300) {
                    let data = res.data || [];
                    

                    setProducts(data);
                }
                return;
            } else if (query) {
                let cleanedQuery = query.trim();
                if (cleanedQuery.startsWith('?')) {
                    cleanedQuery = cleanedQuery.slice(1);
                }

                const match = cleanedQuery.match(/^(name|supplier)\s*=\s*(.+)$/);

                if (match) {
                    const [, key, value] = match;
                    endpoint = `/warehouse/${id}/products/search?${key}=${encodeURIComponent(value)}`;
                } else {
                    endpoint = `/warehouse/${id}/products/search?name=${encodeURIComponent(cleanedQuery)}`;
                }


            }
            res = await api.get(endpoint);
            if (res.status >= 200 && res.status <= 300) {
                setProducts(res.data || []);
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
      
    const handleApplyFilters = (appliedFilters) => {
        setFilters(appliedFilters);
        fetchProducts(searchQuery, appliedFilters);
    };

    const columns = [
        {
            accessorKey: "product_id",
            header: "ID",
            cell: ({ row }) => <span>{row.getValue("product_id")}</span>,
        },
        {
            accessorKey: "product_name",
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
            cell: ({ row }) => {
                const categoryId = row.getValue("category_id")
                const category = categoryMap[categoryId]

                if (!category) return null

                return (
                    <Category
                    name={category.name}
                    text={category.text_color}
                    bg={category.bg_color}
                    />
                )
            }
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
                    <Button 
                        onClick={() => {
                            setSelectedProduct(product);
                            setConfirmation(true);
                        }} 
                        className='shadow-xs shadow-accent-dark text-xs h-6 px-2'
                    >
                        <Trash></Trash>
                    </Button>
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
                <FilterWindow isOpen={isFilter} setOpen={setFilter} filters={filters} setFilters={handleApplyFilters}/>
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
                            <input type='text' className='bg-primary-light h-full w-full rounded-md text-text-light px-2 shadow-md shadow-accent-dark' placeholder='Search'
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    handleSearch(e.target.value);
                        }}
                            />
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
            <RestockOrderTable id={id} ref={restockTableRef} onCompleteOrder={()=>{setCompletedOrder(true)}}/>
        </>
    )
}
