'use client';
import { useState, useEffect, useMemo } from "react"
import {ArrowDownFromLine, EllipsisVertical, ArrowUpFromLine, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { CreateWindow } from "@/components/sections/customer/create";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function Customers(){
    const [customers, setCustomers] = useState([]);
    const [customerAddresses, setCAddresses] = useState([]);
    const [create, setCreate] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [confirmation, setConfirmation] = useState(false);

    useEffect(()=>{
        async function getCustomers(){
            try {
                const res = await api.get("/customers");
                if (res.status >= 200 && res.status <= 300) {
                    setCustomers(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
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

    const columns=[
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
            accessorKey: "actions",
            header: "",
        }
    ];


    const table = useReactTable({
        data: cTableData,
        columns,
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
    
    return(
        <>
            <Dialog open={confirmation} onOpenChange={setConfirmation} >
                <DialogContent className="[&~.fixed.inset-0]:bg-transparent">
                    <DialogHeader>
                    <DialogTitle className='text-text-dark'>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this customer from our servers?
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <Button type="submit">Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> 
            
            <div className="p-6 pl-10 w-screen xl:ml-auto xl:w-6/7 2xl:w-8/9 mt-12">      

                <CreateWindow isOpen={create} setOpen={setCreate} />   
                <h1 className='text-text-dark text-3xl font-bold mb-4'>
                    Customer
                </h1>
                    <div className='flex flex-row flex-wrap justify-between gap-2 w-full'>
                    <button 
                        onClick={()=>{setCreate(true)}}
                        className='bg-primary p-2 px-10 rounded-lg text-text-light font-semibold shadow-md shadow-accent-dark'
                    >
                        Create
                    </button>
                    <div className='w-lg flex flex-row gap-2'>
                        <form className='w-full min-w-[250px] grow'>
                            <input type='text' className='bg-primary-light h-full w-full rounded-md text-text-light px-2 shadow-md shadow-accent-dark' placeholder='Search'/>
                        </form>
                    </div>
                    <div className="overflow-hidden rounded-lg border-0 mt-5 shadow-md w-full shadow-accent-dark">
                        <Table>
                            <TableHeader className='my-2 bg-primary'>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead className='text-text-light font-medium' key={header.id} colSpan={header.colSpan}>
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
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => {
                                        const customer = row.original;
                                        const isExpanded = expandedRows.has(customer.customer_id);
                                        const customerAddr = customerAddresses.find((add) => add.id === customer.customer_id);
                                        
                                        return (
                                            <>
                                                <TableRow key={customer.customer_id}>
                                                    <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                        {customer.customer_id}
                                                    </TableCell>
                                                    <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                        {customer.name}
                                                    </TableCell>
                                                    <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                        {customer.email}
                                                    </TableCell>
                                                    <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                        {customer.address.delivery_address}
                                                    </TableCell>
                                                    <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                        {customer.address.phone_num}
                                                    </TableCell>
                                                    <TableCell className='flex flex-row flex-wrap  justify-center gap-2 px-0'>
                                                        <Button onClick={() => toggleRow(customer.customer_id)} className='mx-0'>
                                                            {isExpanded ? <ArrowUpFromLine/> : <ArrowDownFromLine/>}
                                                        </Button>
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
                                                        <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
                                                            {addr.delivery_address}
                                                        </TableCell>
                                                        <TableCell className="text-text-dark relative font-semibold after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-px after:bg-primary">
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
                                        <TableCell colSpan={columns.length} className="text-center">
                                            No customers found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex w-full items-center gap-8 bg-primary-light justify-between p-2">
                            <span className='flex flex-row flex-nowrap gap-8'>
                                <div className="hidden items-center gap-2 lg:flex text-text">
                                    <Label htmlFor="rows-per-page" className="text-sm font-semibold">
                                        Rows per page
                                    </Label>
                                    <Select
                                        value={`${table.getState().pagination.pageSize}`}
                                        onValueChange={(value) => {
                                        table.setPageSize(Number(value))
                                        }}
                                    >
                                        <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                        <SelectValue
                                            placeholder={table.getState().pagination.pageSize}
                                        />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                        {[10, 20, 30, 40, 50].map((pageSize) => (
                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex w-fit items-center justify-center text-sm font-medium text-text">
                                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                                    {table.getPageCount()}
                                </div>
                            </span>
                                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                <button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">Go to first page</span>
                                    <ChevronsLeft className='m-auto' color='#F6F2FF'/>
                                </button>
                                <button
                                    variant="outline"
                                    className="size-8"
                                    size="icon"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">Go to previous page</span>
                                    <ChevronLeft className='m-auto' color='#F6F2FF'/>
                                </button>
                                <button
                                    variant="outline"
                                    className="size-8"
                                    size="icon"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">Go to next page</span>
                                    <ChevronRight className='m-auto' color='#F6F2FF'/>
                                </button>
                                <button
                                    variant="outline"
                                    className="hidden size-8 lg:flex"
                                    size="icon"
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">Go to last page</span>
                                    <ChevronsRight className='m-auto' color='#F6F2FF'/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}