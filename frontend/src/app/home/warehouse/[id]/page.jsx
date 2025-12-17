'use client'
import { useParams } from "next/navigation";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import { Trash,BookUser, ChartLine, NotepadText, ArrowDownFromLine, EllipsisVertical, ArrowUpFromLine, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useRouter } from 'next/navigation';
import { AddProduct } from '@/components/sections/warehouse/AddProduct';
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
import { RestockOrderTable } from '@/components/sections/warehouse/RestockOrder'
import { Category } from '@/components/widget/Category';
import { useData } from '@/app/context/DataContext';

export default function InnerWarehouse(){
    const [customers, setCustomers] = useState([]);
    const [customerAddresses, setCAddresses] = useState([]);
    const [warehouseInfo, setWarehouseInfo] = useState({});
    const [warehouseStats, setWarehouseStats] = useState({
        total_revenue: 0,
        total_sales: 0,
        total_products: 0,
        total_stock: 0
    });
    const [orderStats, setOrderStats] = useState({
        overdue: 0,
        in_progress: 0,
        completed: 0
    });
    const [add, setAdd] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [products, setProducts] = useState([]);
    const [restockOpen, setRestockOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmation, setConfirmation] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(false);
    const id = useParams().id;
    const router = useRouter();
    const { categories } = useData();
    const [categoryMap, setCategoryMap] = useState({}); 

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


    useEffect(()=>{
        async function getWarehouseData(){
            try {
                const warehouseRes = await api.get(`/warehouse/${id}`);
                if (warehouseRes.status >= 200 && warehouseRes.status <= 300) {
                    setWarehouseInfo(warehouseRes.data.data || {});
                }
            } catch (err) {
                console.error(err);
            }
        }

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

        async function getWarehouseCustomers(){
            try {
                const res = await api.get(`/warehouse/${id}/customers`);
                if (res.status >= 200 && res.status <= 300) {
                    setCustomers(res.data.data || []);
                }
            } catch (err) {
                console.error(err);
            }
        }

        async function getStats(){
            try {
                const statsRes = await api.get(`/warehouse/${id}/stats`);
                if (statsRes.status >= 200 && statsRes.status <= 300) {
                    setWarehouseStats(statsRes.data.data || {});
                }
            } catch (err) {
                console.error(err);
            }
        }

        async function getOrderStats(){
            try {
                const orderStatsRes = await api.get(`/warehouse/${id}/order-stats`);
                if (orderStatsRes.status >= 200 && orderStatsRes.status <= 300) {
                    setOrderStats(orderStatsRes.data.data || {});
                }
            } catch (err) {
                console.error(err);
            }
        }

        getWarehouseData();
        getWarehouseProducts();
        getWarehouseCustomers();
        getStats();
        getOrderStats();
    },[id]);


    const cTableData = useMemo(() => {
        if (!customers.length) return [];

        const tableData = [];
        const addressesByCustomer = {};

        customers.forEach((customer) => {
            if (!addressesByCustomer[customer.customer_id]) {
                addressesByCustomer[customer.customer_id] = {
                    id: customer.customer_id,
                    addresses: []
                };
            }
            
            // Collect all addresses for this customer
            addressesByCustomer[customer.customer_id].addresses.push({
                address_id: customer.address_id,
                delivery_address: customer.delivery_address,
                phone_num: customer.phone_num
            });
        });

        // Create main row for each customer (using first address)
        Object.values(addressesByCustomer).forEach((customerAddr) => {
            if (customerAddr.addresses.length > 0) {
                const firstAddr = customerAddr.addresses[0];
                const customerInfo = customers.find(c => c.customer_id === customerAddr.id);
                tableData.push({
                    customer_id: customerAddr.id,
                    id: customerAddr.id,
                    name: customerInfo?.name || '',
                    email: customerInfo?.email || '',
                    delivery_address: firstAddr.delivery_address,
                    phone_num: firstAddr.phone_num
                });
            }
        });

        setCAddresses(Object.values(addressesByCustomer));

        return tableData;
    }, [customers]);

    const cColumns=[
        {
            accessorKey: 'product_id',
            header: 'ID'
        },
        {
            accessorKey: 'product_name',
            header: 'Name'
        },
        {
            accessorKey: 'email',
            header: 'Email'
        },
        {
            accessorKey: 'delivery_address',
            header: 'Address'
        },
        {
            accessorKey: 'phone_num',
            header: 'Phone'
        },
        {
            accessorKey: 'expand',
            header: ''
        },        
        {
            accessorKey: 'more',
            header: ''
        }
    ];

    const pColumns=[
        {
            accessorKey: 'id',
            header: 'ID'
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({row})=>(<span>{row.original.name.length <= 10 ? row.original.name : `${row.original.name.slice(0, 7)}...`}</span>)
        },
        {
            accessorKey: 'ttl_sales',
            header: 'Ttl Sales',
            cell: ({ row }) => <span>Rp. {row.getValue("ttl_sales")}</span>,
        },
        {
            accessorKey: 'price',
            header: 'Price',
        },
        {
            accessorKey: 'stock',
            header: 'Stock',
        },
        {
            accessorKey: 'supplier_name',
            header: 'Supplier',
            cell: ({row})=>(<span>{row.original.supplier_name.length <= 10 ? row.original.supplier_name : `${row.original.supplier_name.slice(0, 7)}...`}</span>)

        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({row})=>(<h2>Category</h2>)
        },
        {
            accessorKey: 'actions',
            header: '',
            cell: ({row})=>(
                <Button 
                    onClick={() => {
                        setSelectedProduct(row.original);
                        setConfirmation(true);
                    }} 
                    className='shadow-xs shadow-accent-dark text-xs bg-red-600 hover:bg-red-700'
                >
                    
                </Button>
            )
        },        
    ];

    const pTable = useReactTable({
        data: products,
        columns:pColumns,
        getRowId: (row) => `${row.id}`,
        getCoreRowModel: getCoreRowModel(),
    });


    const cTable = useReactTable({
        data: cTableData,
        columns:cColumns,
        state: {
            pagination,
        },
        getRowId: (row) => `${row.id}`,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const toggleRow = (customerId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(customerId)) {
                newSet.delete(customerId);
            } else {
                newSet.add(customerId);
            }
            return newSet;
        });
    };

    const handleDeleteProduct = async () => {
        try {
            await api.delete(`/warehouse/${id}/products/${selectedProduct.id}`);
            await getWarehouseProducts();
            setConfirmation(false);
            setSelectedProduct(null);
        } catch (err) {
            console.error("Failed to delete product from inventory:", err);
        }
    };

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


    return (
        <>
            <AddProduct isOpen={add} setOpen={setAdd} restock={false} id={id} />
            <Dialog open={confirmation} onOpenChange={setConfirmation}>
                <DialogContent className="[&~.fixed.inset-0]:bg-transparent">
                    <DialogHeader>
                        <DialogTitle className='text-text-dark'>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. Are you sure you want to permanently
                            remove this product from the warehouse inventory?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmation(false)}>Cancel</Button>
                        <Button onClick={handleDeleteProduct} className='bg-red-600 hover:bg-red-700'>Confirm Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Restock Product</DialogTitle>
                        <DialogDescription>
                            Place a restock order for {selectedProduct?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <RestockOrderTable 
                        product={selectedProduct} 
                        warehouseId={id}
                        onClose={() => setRestockOpen(false)}
                    />
                </DialogContent>
            </Dialog>
            <Breadcrumb className="my-2">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/home/warehouse'>Warehouse</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage href={`/home/warehouse/${id}`}>{warehouseInfo.name || 'Warehouse'}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className='w-full bg-card-grad shadow-md shadow-accent-dark border-primary-dark border-2'>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-text">
                        {warehouseInfo.name || 'Warehouse'}
                    </CardTitle>
                    <CardDescription className="text-text-light">
                        {warehouseInfo.address || 'Address'}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="grid grid-cols-1 gap-3 md:grid-cols-5 w-full items-start h-fit text-sm text-text">
                    <div className='flex flex-col gap-4 md:col-span-2 grow h-full'>
                        <div className="bg-secondary w-full gap-3 flex flex-col flex-nowrap shadow-md shadow-accent-ui rounded-md p-4">
                            <CardDescription className="text-text-dark font-black text-xl flex flex-row gap-2 items-center"> <BookUser/> Manager</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Managed by: {warehouseInfo.manager_name || '-'}</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Email: {warehouseInfo.manager_email || '-'}</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Phone number: -</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Address: {warehouseInfo.address || '-'}</CardDescription>
                        </div>
                        <div className="bg-secondary w-full gap-3 flex flex-col flex-nowrap shadow-md shadow-accent-ui rounded-md p-4">
                            <CardDescription className="text-text-dark font-black text-xl flex flex-row gap-2 items-center"> <ChartLine/> Warehouse stats</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Total revenue: Rp. {warehouseStats.total_revenue?.toLocaleString() || '0'}</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Total sales: {warehouseStats.total_sales || '0'}</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Total product: {warehouseStats.total_products || '0'}</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Item stock: {warehouseStats.total_stock || '0'}</CardDescription>
                        </div>
                        <div className="bg-secondary w-full gap-3 flex flex-col flex-nowrap shadow-md shadow-accent-ui rounded-md p-4">
                            <CardDescription className="text-text-dark font-black text-xl flex flex-row gap-2 items-center"> <NotepadText/> Order stats</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Orders overdue: {orderStats.overdue || '0'}</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Orders in progress: {orderStats.in_progress || '0'}</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Orders completed: {orderStats.completed || '0'}</CardDescription>
                        </div>
                    </div>
                    <div className='flex flex-col md:col-span-3 gap-2 h-full'>
                        <div className="bg-secondary w-full h-full gap-1 flex flex-col flex-nowrap shadow-md shadow-accent-ui rounded-md p-2 px-4">
                            <div className="flex flex-row justify-between">
                                <CardDescription className="text-text-dark font-black text-xl flex flex-row gap-2 items-center">Products</CardDescription>
                                <Button onClick={() => setAdd(true)} className='shadow-xs shadow-accent-dark'>Add</Button>
                            </div>
                            <div className="overflow-hidden rounded-lg border-0 mt-2 shadow-md w-full shadow-accent-dark">
                            <Table>
                                <TableHeader className='my-2 bg-primary'>
                                    {pTable.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead className='text-text-light font-medium text-xs' key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </TableHead>
                                            )
                                            })}
                                        </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody className="bg-accent-dark">
                                    {pTable.getRowModel().rows.length > 0 ? (
                                        pTable.getRowModel().rows.map((row) => {
                                            const product = row.original;
                                            
                                            return (
                                                <>
                                                    <TableRow key={product.product_id}>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {product.product_id}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {product.product_name}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            Rp. {product.ttl_sales}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            Rp. {product.cost}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {product.stock}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {product.supplier}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {(() => {
                
                                                                const category = categoryMap[product.category_id]
                                                                if (!category) return "—"

                                                                return (
                                                                <Category
                                                                    name={category.name}
                                                                    text={category.text_color}
                                                                    bg={category.bg_color}
                                                                />
                                                                )
                                                            })()}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            <Button 
                                                                onClick={() => {
                                                                    setSelectedProduct(product);
                                                                    setConfirmation(true);
                                                                }} 
                                                                className='shadow-xs shadow-accent-dark text-xs h-6 px-2'
                                                            >
                                                                <Trash></Trash>
                                                            </Button>
                                                        </TableCell>

                                                    </TableRow>
                                                </>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={cColumns.length} className="text-center">
                                                No Products found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <button 
                                onClick={(e)=>{router.push(`/home/warehouse/${id}/product`)}}
                                className='mx-auto w-full bg-primary-light text-xs py-1 hover:bg-primary'
                            >See more</button>
                        </div>
                        </div>
                        <div className="bg-secondary w-full h-full gap-1 flex flex-col flex-nowrap shadow-md shadow-accent-ui rounded-md p-2 px-4">
                            <div className="flex flex-row justify-between">
                                <CardDescription className="text-text-dark font-black text-xl flex flex-row gap-2 items-center">Customers</CardDescription>
                                <div className="flex flex-row justify-between gap-2">
                                    <Button className='shadow-xs shadow-accent-dark'>New</Button>
                                   
                                </div>
                            </div>
                            <div>
                            <div className="overflow-hidden rounded-lg border-0 mt-2 shadow-md w-full shadow-accent-dark">
                            <Table>
                                <TableHeader className='my-2 bg-primary'>
                                    {cTable.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead className='text-text-light font-medium text-xs' key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </TableHead>
                                            )
                                            })}
                                        </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody className="bg-accent-dark">
                                    {cTable.getRowModel().rows.length > 0 ? (
                                        cTable.getRowModel().rows.map((row) => {
                                            const customer = row.original;
                                            const isExpanded = expandedRows.has(customer.customer_id);
                                            const customerAddr = customerAddresses.find((add) => add.id === customer.customer_id);
                                            
                                            return (
                                                <>
                                                    <TableRow key={customer.customer_id}>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {customer.id}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {customer.name}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {customer.email}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {customer.delivery_address}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {customer.phone_num}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button onClick={() => toggleRow(customer.customer_id)} className='w-5 h-5'>
                                                                {isExpanded ? <ArrowUpFromLine/> : <ArrowDownFromLine/>}
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button className='w-5 h-5'>
                                                                <EllipsisVertical />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    {isExpanded && customerAddr?.addresses && customerAddr.addresses.map((addr, i) => (
                                                        <TableRow key={`${customer.customer_id}-${i}`}>
                                                            <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            </TableCell>
                                                            <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            </TableCell>
                                                            <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            </TableCell>
                                                            <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                                {addr.delivery_address}
                                                            </TableCell>
                                                            <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                                {addr.phone_num}
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                        </TableRow>
                                                    ))}
                                                </>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={cColumns.length} className="text-center">
                                                No customers found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <div className="flex w-full items-center gap-8 bg-primary-light justify-between px-2">
                                <span className='flex flex-row flex-nowrap gap-8'>
                                    <div className="hidden items-center gap-2 lg:flex text-text">
                                        <Label htmlFor="rows-per-page" className="text-xs font-semibold">
                                            Rows per page
                                        </Label>
                                        <Select
                                            value={`${cTable.getState().pagination.pageSize}`}
                                            onValueChange={(value) => {
                                            cTable.setPageSize(Number(value))
                                            }}
                                        >
                                            <SelectTrigger size="sm" className="w-15" id="rows-per-page">
                                            <SelectValue
                                                placeholder={cTable.getState().pagination.pageSize}
                                            />
                                            </SelectTrigger>
                                            <SelectContent side="top">
                                            {[3, 6].map((pageSize) => (
                                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                                {pageSize}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex w-fit items-center justify-center text-xs font-medium text-text">
                                        Page {cTable.getState().pagination.pageIndex + 1} of{" "}
                                        {cTable.getPageCount()}
                                    </div>
                                </span>
                                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                    <button
                                        variant="outline"
                                        className="hidden size-4 p-0 lg:flex"
                                        onClick={() => cTable.setPageIndex(0)}
                                        disabled={!cTable.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">Go to first page</span>
                                        <ChevronsLeft className='m-auto' color='#F6F2FF'/>
                                    </button>
                                    <button
                                        variant="outline"
                                                                        className="hidden size-4 p-0 lg:flex"
                                        size="icon"
                                        onClick={() => cTable.previousPage()}
                                        disabled={!cTable.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">Go to previous page</span>
                                        <ChevronLeft className='m-auto' color='#F6F2FF'/>
                                    </button>
                                    <button
                                        variant="outline"
                                        className="hidden size-4 p-0 lg:flex"
                                        size="icon"
                                        onClick={() => cTable.nextPage()}
                                        disabled={!cTable.getCanNextPage()}
                                    >
                                        <span className="sr-only">Go to next page</span>
                                        <ChevronRight className='m-auto' color='#F6F2FF'/>
                                    </button>
                                    <button
                                        variant="outline"
                                        className="hidden size-4 lg:flex"
                                        size="icon"
                                        onClick={() => cTable.setPageIndex(cTable.getPageCount() - 1)}
                                        disabled={!cTable.getCanNextPage()}
                                    >
                                        <span className="sr-only">Go to last page</span>
                                        <ChevronsRight className='m-auto' color='#F6F2FF'/>
                                    </button>
                                </div>
                            </div>
                        </div>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <RestockOrderTable id={id} onCompleteOrder={()=>{setCompletedOrder(true)}}/>
    </>
    )
}