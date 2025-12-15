'use client'
import { useParams } from "next/navigation";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import { BookUser, ChartLine, NotepadText, ArrowDownFromLine, EllipsisVertical, ArrowUpFromLine, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react'
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

export default function InnerWarehouse(){
    const [customers, setCustomers] = useState([]);
    const [customerAddresses, setCAddresses] = useState([]);
    const [add, setAdd] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [products, setProducts] = useState([]);
    const id = useParams().id;
    const router = useRouter();

    useEffect(()=>{
        async function getCustomers(){
            try {
                const res = await api.get("/customer");
                if (res.status >= 200 && res.status <= 300) {
                    setCustomers(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        async function getProducts(){
            try {
                const res = await api.get("/product");
                if (res.status >= 200 && res.status <= 300) {
                    setProducts(res.data.slice(0,5));
                }
            } catch (err) {
                console.error(err);
            }
        }
        getProducts();
        getCustomers();
    },[]);


    const cTableData = useMemo(() => {
        if (!customers.length) return [];

        const tableData = [];
        const addressesData = [];

        customers.forEach((customer) => {
            const r = { ...customer, address: customer.addresses[0] };
            const i = { id: customer.customer_id, addresses: customer.addresses.slice(1) };

            tableData.push(r);
            addressesData.push(i);
        });

        setCAddresses(addressesData);

        return tableData.map(({ addresses, ...returnVal }) => returnVal);
    }, [customers]);

    const cColumns=[
        {
            accessorKey: 'id',
            header: 'ID'
        },
        {
            accessorKey: 'name',
            header: 'Name'
        },
        {
            accessorKey: 'email',
            header: 'Email'
        },
        {
            accessorKey: 'address',
            header: 'Address'
        },
        {
            accessorKey: 'phone',
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
            accessorKey: 'total_sales',
            header: 'Ttl Sales'
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
            cell: ({row})=>(<Button>Remove</Button>)
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


    return (
        <>
            <AddProduct isOpen={add} setOpen={setAdd} restock={false} id={id} />
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
                        <BreadcrumbPage href={`/home/warehouse/${id}`}>idk</BreadcrumbPage> {/* TODO */}
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className='w-full bg-card-grad shadow-md shadow-accent-dark border-primary-dark border-2'>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-text">
                        Name
                    </CardTitle>
                </CardHeader>
                <CardFooter className="grid grid-cols-1 gap-3 md:grid-cols-5 w-full items-start h-fit text-sm text-text">
                    <div className='flex flex-col gap-4 md:col-span-2 grow h-full'>
                        <div className="bg-secondary w-full gap-3 flex flex-col flex-nowrap shadow-md shadow-accent-ui rounded-md p-4">
                            <CardDescription className="text-text-dark font-black text-xl flex flex-row gap-2 items-center"> <BookUser/> Manager</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Managed by: </CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Email: </CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Phone number: </CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Address: </CardDescription>
                        </div>
                        <div className="bg-secondary w-full gap-3 flex flex-col flex-nowrap shadow-md shadow-accent-ui rounded-md p-4">
                            <CardDescription className="text-text-dark font-black text-xl flex flex-row gap-2 items-center"> <ChartLine/> Warehouse stats</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Total revenue: </CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Total sales: </CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Total product: </CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Item stock: </CardDescription>
                        </div>
                        <div className="bg-secondary w-full gap-3 flex flex-col flex-nowrap shadow-md shadow-accent-ui rounded-md p-4">
                            <CardDescription className="text-text-dark font-black text-xl flex flex-row gap-2 items-center"> <NotepadText/> Order stats</CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Orders overdue: </CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Orders in progress: </CardDescription>
                            <CardDescription className="text-text-dark/80 font-black">Orders completed: </CardDescription>
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
                                                    <TableRow key={product.id}>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {product.id}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {product.name}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {product.total_sales}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            Rp. {product.price}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {product.stock}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {product.supplier_name}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            category
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            <button>remove</button>
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
                                onClick={(e)=>{router.push(id+'/product')}}
                                className='mx-auto w-full bg-primary-light text-xs py-1 hover:bg-primary'
                            >See more</button>
                        </div>
                        </div>
                        <div className="bg-secondary w-full h-full gap-1 flex flex-col flex-nowrap shadow-md shadow-accent-ui rounded-md p-2 px-4">
                            <div className="flex flex-row justify-between">
                                <CardDescription className="text-text-dark font-black text-xl flex flex-row gap-2 items-center">Customers</CardDescription>
                                <div className="flex flex-row justify-between gap-2">
                                    <Button className='shadow-xs shadow-accent-dark'>New</Button>
                                    <form className='w-full min-w-[250px] grow'>
                                        <input type='text' className='bg-primary-light h-full w-full rounded-md text-text-light px-2 shadow-xs shadow-accent-dark' placeholder='Search'/>
                                    </form>
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
                                                            {customer.customer_id}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {customer.name}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {customer.email}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {customer.address.delivery_address}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark text-[0.7rem] relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {customer.address.phone_num}
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
            <RestockOrderTable warehouseId={id} />
    </>
    )
}