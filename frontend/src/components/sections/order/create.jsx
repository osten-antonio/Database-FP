import { useState, useEffect, useMemo } from "react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { SearchableCBox } from "@/components/widget/SearchableCBox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function CalendarSelector({open, setOpen, date, setDate}){
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
            <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal mt-1 bg-secondary border-2 border-accent-dark text-text-dark"
            >
                {date ? date.toLocaleDateString() : "Select date"}
                <CalendarIcon/>
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                className='bg-secondary border-2 text-text-dark'
                onSelect={(date) => {
                setDate(date)
                setOpen(false)
                }}
            />
            </PopoverContent>
        </Popover>
        );
}


function ItemsTable({ availableItems, selectedItem, setSelected }) {
    const [selected,setSelectedProduct] = useState(undefined);
    const [amount,setAmount] = useState(1);
    const handleRemove = (id) => {
        setSelected((prev) => prev.filter((row) => row.id !== id));
    };

    const handleAdd = ()=>{
        const total = Number(selected.price)*amount;
        const addedItem = {
            ...selected,
            name: selected.name,
            amount: amount,
            price: selected.price,
            total: total
        };
        setSelected([...selectedItem,addedItem]);
    }

    const columns = [
        {
        accessorKey: 'name',
        header: 'Name',
        cell: ({row}) => {
                const name = row.getValue('name');
                return (<span>       {name.length <= 15 ? name : `${name.slice(0, 12)}...`}</span>)
            }
        },
        {
        accessorKey: 'amount',
        header: 'Amount',
        },
        {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => <span>Rp. {row.getValue('price')}</span>,
        },
        {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('price'));
            const amount = parseFloat(row.getValue('amount'));
            const total = price * amount;
            return <span>Rp. {total.toFixed(3)}</span>;
        },
        },
        {
        accessorKey: 'remove',
        header: '',
        cell: ({ row }) => (
            <Button onClick={() => handleRemove(row.original.id)}>
            -
            </Button>
        ),
        },
    ];

    const table = useReactTable({
        data:selectedItem,
        columns,
        state: {},
        getRowId: (row) => row.id,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className='accent-accent-dark'>
            <div className="overflow-hidden rounded-lg border-0">
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
                        {
                        table.getRowModel().rows.map((row) => (
                            <TableRow className="border-accent-dark" key={row.id}>
                            {row.getVisibleCells().map((cell,i) => {
                                return (<TableCell
                                key={cell.id}
                                className='text-text-dark relative font-semibold'
                                >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>)
                            })}
                            </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
            </div>
            <Dialog>
                <DialogTrigger className="bg-primary w-full text-text px-2 p-1 rounded-md text-sm mt-2">+ Add</DialogTrigger>
                <DialogContent className='w-fit bg-secondary'>
                    <DialogHeader>
                        <DialogTitle className='text-text-dark'>Select product</DialogTitle>
                        <div className='flex flex-row gap-2 mt-2'>
                            <Select onValueChange={setSelectedProduct}>
                                <SelectTrigger className="w-[180px] bg-secondary accent-accent-light text-text-dark px-2 rounded-md text-sm border border-accent-light focus:border-accent-dark outline-none">
                                    <SelectValue placeholder={`Select a product`} />
                                </SelectTrigger>
                                <SelectContent className='rounded-lg border-primary-dark shadow-md w-full shadow-accent-dark'>
                                    <SelectGroup>
                                        {
                                            availableItems.map((item)=>{
                                                return(
                                                    <SelectItem key={item.id} value={item}>
                                                        {item.id} {item.name} | Rp. {item.price}
                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <input 
                                onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                                type="number"
                                min="1"
                                defaultValue="1"
                                className="bg-secondary accent-accent-light text-text-dark px-2 rounded-md text-sm border border-accent-light focus:border-accent-dark outline-none"
                            />
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <div className='flex items-center justify-between w-full'> 
                            <p>
                                Total: Rp. {selected?Number(selected.price)*amount:0}
                            </p>
                            <div className="flex items-center gap-2">
                                <DialogClose asChild>
                                    <Button>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button onClick={handleAdd}>
                                        Add
                                    </Button>
                                </DialogClose>
                            </div>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export function CreateWindow({isOpen, setOpen}){ 
    const [customers, setCustomers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(undefined); // <Number | undefined>
    const [selectedWarehouse, setSelectedWarehouse] = useState(undefined); // <Number | undefined>
    const [selectedAddress, setSelectedAddress] = useState(undefined); // <Number | undefined>
    const [openOrderC, setOpenOrderC] = useState(false);
    const [orderDate, setOrderDate] = useState(undefined); //<Date | undefined>
    const [openExpectedC, setOpenEC] = useState(false);
    const [expectedDate, setExpectedDate] = useState(undefined); //<Date | undefined>
    const [availableItems, setAvailableItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(()=>{
        setSelectedItems([]);
        // setAvailableItems([]);
    },[isOpen])

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
        async function getWarehouses(){
            try {
                const res = await api.get("/warehouses");
                if (res.status >= 200 && res.status <= 300) {
                    setWarehouses(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getCustomers();
        getWarehouses();
    },[])

    useEffect(()=>{
        async function getProducts(){
            try {
                const res = await api.get("/products");
                if (res.status >= 200 && res.status <= 300) {
                    setAvailableItems(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getProducts();
    },[]) // TODO when backend is finished, add selectedWarehouse as a dependency, also query products in that warehosue (inventory)


    const availableAddress = useMemo(()=>{ // TODO fix this or handle this at the backend
        if (!selectedCustomer || customers.length === 0) return [];
        const customer = customers.find((i)=>i.customer_id===selectedCustomer);
        
        if (!customer) return [];
        return customer.addresses.map((address)=>({
            value:`${address.delivery_address.toLowerCase()} ${address.phone_num}`,
            label:`${address.delivery_address.toLowerCase()}`
        }));
    },[selectedCustomer, customers]);

    const customerListData = useMemo(()=>{
        return customers.map((customer) => ({
            value: `${customer.customer_id} ${customer.name.toLowerCase()}`,
            label: `${customer.customer_id} ${customer.name}`,
        }))
    },[customers]);


    const warehouseListData = useMemo(()=>{
        return warehouses.map((warehouse) => ({
            value: `${warehouse.warehouse_id} ${warehouse.name.toLowerCase()} ${warehouse.address.toLowerCase()}`,
            label: `${warehouse.warehouse_id} ${warehouse.name} @ ${warehouse.address}`,
        }))
    },[warehouses]);

    return(
        <div
            onClick={() => setOpen(false)}
            className={`overflow-y-auto
                backdrop-blur-sm fixed top-0 left-0 w-screen h-screen z-20 flex items-center justify-center
                transition-opacity duration-200 ease-out
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
        >            
            <div onClick={(e) => e.stopPropagation()} className='flex flex-col bg-primary-light max-w-[500px] rounded-2xl p-5 shadow-md shadow-accent-dark border-primary-dark border-2'>
                <p className="font-bold text-2md text-text">New Order</p>
                <span className="ml-1">
                    <div className="flex flex-row flex-wrap md:flex-nowrap gap-3 w-full justify-between">
                        <div className="flex flex-col flex-nowrap gap-1 w-full">
                            <p className="font-semibold text-sm mt-2 text-text-light">Customer</p>
                            <SearchableCBox name='customer' list={customerListData} setSelected={setSelectedCustomer}/>
                        </div>
                        <div className="flex flex-col flex-nowrap gap-1 w-full">
                            <p className="font-semibold text-sm mt-2 text-text-light">Warehouse</p>
                            <SearchableCBox name='warehouse' list={warehouseListData} setSelected={setSelectedWarehouse}/>
                        </div>
                    </div>
                    <p className="font-semibold text-sm mt-2 text-text-light">Address</p>
                    <SearchableCBox name='Address' list={availableAddress} setSelected={setSelectedAddress}/>
                    <p className="font-semibold text-sm mt-2 text-text-light">Order date</p>
                    <CalendarSelector open={openOrderC} setOpen={setOpenOrderC} date={orderDate} setDate={setOrderDate}/>
                    <p className="font-semibold text-sm mt-2 text-text-light">Expected order date</p>
                    <CalendarSelector open={openExpectedC} setOpen={setOpenEC} date={expectedDate} setDate={setExpectedDate}/>
                    <p className="font-semibold text-sm mt-2 text-text-light">Items</p>
                    <ItemsTable selectedItem={selectedItems} setSelected={setSelectedItems} availableItems={availableItems}  />
                    <div className="flex flex-row flex-nowrap justify-between mt-3">
                        <Button onClick={()=>{setOpen(false)}}>Close</Button>
                        <Button
                            onClick={() => {
                                // TODO
                                setOpen(false);
                            }}
                        >
                                Create
                        </Button>
                    </div>   
                </span>       
            </div>
        </div>
    )
}

