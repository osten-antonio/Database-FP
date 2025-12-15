import { useState, useEffect, useMemo } from "react"
import api from "@/lib/axios"
import { useData } from "@/app/context/DataContext";
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
    
    const [selectedProduct,setSelectedProduct] = useState(undefined);
    const [amount,setAmount] = useState(1);
    const handleRemove = (productId) => {
        setSelected((prev) => prev.filter((row) => row.product_id !== productId));
    };

    const handleAdd = ()=>{
        if (!selectedProduct) return;
        const total = Number(selectedProduct.cost) * amount;
        const addedItem = {
            product_id: selectedProduct.id,
            id: selectedProduct.product_id,
            name: selectedProduct.name,
            amount: amount,
            price: selectedProduct.cost,
            total: total
        };
        setSelected([...selectedItem, addedItem]);
        setSelectedProduct(undefined);
        setAmount(1);
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
            return <span>Rp. {total}</span>;
        },
        },
        {
        accessorKey: 'remove',
        header: '',
        cell: ({ row }) => (
            <Button onClick={() => handleRemove(row.original.product_id)}>
            -
            </Button>
        ),
        },
    ];

    const table = useReactTable({
        data:selectedItem,
        columns,
        state: {},
        getRowId: (row) => row.product_id?.toString() || row.id?.toString(),
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
                            <Select 
                                value={selectedProduct?.product_id?.toString() || selectedProduct?.id?.toString() || ""}
                                onValueChange={(value) => {
                                    const selectedItem = availableItems.find(item => 
                                    item.product_id?.toString() === value || item.id?.toString() === value
                                    );
                                    if (selectedItem) setSelectedProduct(selectedItem);
                                }}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableItems.map((item) => {
                                    const itemId = item.product_id || item.id;
                                    return (
                                        <SelectItem key={itemId} value={itemId?.toString()}>
                                        {itemId} - {item.name} | Rp. {item.cost}
                                        </SelectItem>
                                    );
                                    })}
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
                                Total: Rp. {selectedProduct?Number(selectedProduct.cost)*amount:0}
                            </p>
                            <div className="flex items-center gap-2">
                                <DialogClose asChild>
                                    <Button className='bg-accent-light text-text-dark hover:bg-accent-dark transition-color duration-200 ease-in-out'>
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


export function CreateWindow({isOpen, setOpen, onSubmit, editData = null}){ 
    const { customers } = useData();
    const [warehouses, setWarehouses] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(undefined);
    const [selectedWarehouse, setSelectedWarehouse] = useState(undefined);
    const [selectedAddress, setSelectedAddress] = useState(undefined);
    const [openOrderC, setOpenOrderC] = useState(false);
    const [orderDate, setOrderDate] = useState(undefined);
    const [openExpectedC, setOpenEC] = useState(false);
    const [expectedDate, setExpectedDate] = useState(undefined);
    const [availableItems, setAvailableItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [availableAddresses, setAvailableAddresses] = useState([]);

    useEffect(() => {
        if (editData) {
            setSelectedCustomer(editData.customer_id);
            setSelectedWarehouse(editData.warehouse_id);
            setSelectedAddress(editData.delivery_address);
            setOrderDate(editData.order_date ? new Date(editData.order_date) : undefined);
            setExpectedDate(editData.expected_delivery_date ? new Date(editData.expected_delivery_date) : undefined);
            setSelectedItems([editData]);
        } else {
            setSelectedItems([]);
            setSelectedCustomer(undefined);
            setSelectedWarehouse(undefined);
            setSelectedAddress(undefined);
            setOrderDate(undefined);
            setExpectedDate(undefined);
        }
    }, [editData, isOpen]);

    // Clear form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedItems([]);
            setSelectedCustomer(undefined);
            setSelectedWarehouse(undefined);
            setSelectedAddress(undefined);
            setOrderDate(undefined);
            setExpectedDate(undefined);
        }
    }, [isOpen]);

    useEffect(()=>{
        async function getWarehouses(){
            try {
                const res = await api.get("/warehouse");
                if (res.status >= 200 && res.status <= 300) {
                    setWarehouses(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getWarehouses();
    },[])

    useEffect(()=>{
        async function getProducts(){
            try {
                // If warehouse is selected, fetch products from that warehouse's inventory
                if (selectedWarehouse) {
                    const warehouseId = parseInt(selectedWarehouse);
                    const res = await api.get(`/warehouse/${warehouseId}/products`);
                    if (res.status >= 200 && res.status <= 300) {
                        setAvailableItems(res.data);
                    }
                } else {
                    setAvailableItems([]);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getProducts();
    }, [selectedWarehouse])

    useEffect(()=>{
        async function getAddresses(){
            try {
                // If customer is selected, fetch their addresses from backend
                if (selectedCustomer) {
                    const customerId = parseInt(selectedCustomer);
                    const res = await api.get(`/customer/${customerId}/address`);
                    if (res.status >= 200 && res.status <= 300) {
                        setAvailableAddresses(res.data);
                    }
                } else {
                    setAvailableAddresses([]);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getAddresses();
    }, [selectedCustomer])


    const availableAddress = useMemo(()=>{ 
        return availableAddresses.map((address)=>({
            value:`${address.delivery_address.toLowerCase()} ${address.phone_num}`,
            label:`${address.delivery_address.toLowerCase()}`
        }));
    },[availableAddresses]);

    const customerListData = useMemo(()=>{
        return customers.map((customer) => ({
            value: customer.customer_id.toString(),
            label: `${customer.customer_id} ${customer.name}`,
        }))
    },[customers]);


    const warehouseListData = useMemo(()=>{
        return warehouses.map((warehouse) => ({
            value: warehouse.warehouse_id.toString(),
            label: `${warehouse.warehouse_id} ${warehouse.name} @ ${warehouse.address}`,
        }))
    },[warehouses]);

    const handleSubmit = async () => {
        if (onSubmit) {
            // Format items for backend
            const formattedItems = selectedItems.map(item => ({
                product_id: item.product_id || item.id,
                amount: item.amount,
                order_price: Number(item.price)
            }));
            
            await onSubmit({
                customer_id: parseInt(selectedCustomer),
                warehouse_id: parseInt(selectedWarehouse),
                delivery_address: selectedAddress,
                order_date: orderDate?.toISOString().split('T')[0],
                expected_delivery_date: expectedDate?.toISOString().split('T')[0],
                items: formattedItems
            });
        }
    };

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
                <p className="font-bold text-2md text-text">{editData ? 'Edit Order' : 'New Order'}</p>
                <span className="ml-1">
                    <div className="flex flex-row flex-wrap md:flex-nowrap gap-3 w-full justify-between">
                        <div className="flex flex-col flex-nowrap gap-1 w-full">
                            <p className="font-semibold text-sm mt-2 text-text-light">Customer</p>
                            <SearchableCBox name='customer' list={customerListData} setSelected={setSelectedCustomer} value={selectedCustomer}/>
                        </div>
                        <div className="flex flex-col flex-nowrap gap-1 w-full">
                            <p className="font-semibold text-sm mt-2 text-text-light">Warehouse</p>
                            <SearchableCBox name='warehouse' list={warehouseListData} setSelected={setSelectedWarehouse} value={selectedWarehouse}/>
                        </div>
                    </div>
                    <p className="font-semibold text-sm mt-2 text-text-light">Address</p>
                    <SearchableCBox name='Address' list={availableAddress} setSelected={setSelectedAddress} value={selectedAddress}/>
                    <p className="font-semibold text-sm mt-2 text-text-light">Order date</p>
                    <CalendarSelector open={openOrderC} setOpen={setOpenOrderC} date={orderDate} setDate={setOrderDate}/>
                    <p className="font-semibold text-sm mt-2 text-text-light">Expected order date</p>
                    <CalendarSelector open={openExpectedC} setOpen={setOpenEC} date={expectedDate} setDate={setExpectedDate}/>
                    <p className="font-semibold text-sm mt-2 text-text-light">Items</p>
                    <ItemsTable selectedItem={selectedItems} setSelected={setSelectedItems} availableItems={availableItems}  />
                    <div className="flex flex-row flex-nowrap justify-between mt-3">
                        <Button onClick={()=>{setOpen(false)}} className='shadow-sm bg-accent-light border-primary-dark border text-text-dark hover:bg-accent-dark transition-color duration-200 ease-in-out'>Close</Button>
                        <Button className='shadow-sm hover:bg-accent-dark transition-colors duration-200 ease-in-out'
                            onClick={handleSubmit}
                        >
                                {editData ? 'Update' : 'Create'}
                        </Button>
                    </div>   
                </span>       
            </div>
        </div>
    )
}

