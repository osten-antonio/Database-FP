import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import AddressPicker from './AddressPicker';

function AddressTable({addresses, setAddresses}){
    const handleRemove = (i) => {
        setAddresses((prev) => prev.filter((_, index) => index !== i));
    };

    const handleAdd = (address, pnum)=>{
        setAddresses([...addresses,{address,phone_num:pnum}]);
    }

    const columns = [
        {
            accessorKey: 'address',
            header: 'Address',
            cell: ({row})=>(<span>{row.original.address.length <= 33 ? row.original.address : `${row.original.address.slice(0, 30)}...`}</span>)
        },
        {
            accessorKey: 'phone_num',
            header: 'Phone number',
        },
        {
            accessorKey: 'remove',
            header: '',
            cell: ({ row }) => (
                <Button onClick={() => handleRemove(row.index)}>
                -
                </Button>
            ),
        }
    ];

    const table = useReactTable({
        data:addresses,
        columns,
        state: {},
        getRowId: (row, i) => i.toString(),
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className='accent-accent-dark mt-2 flex flex-col gap-2'>
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
                                key={i}
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
            <AddressPicker onSelect={handleAdd} />
        </div>
    )
}

export function CreateWindow({isOpen, setOpen}){ 
    const [price, setPrice] = useState();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('Address');

    const handleAdd = (address)=>{
        setAddress(address);
    }
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
                <p className="font-bold text-2md text-text">New warehouse</p>
                <span className="ml-1">
                    <div className="w-full flex flex-row gap-3">
                        <div className="flex flex-col flex-nowrap gap-1">
                            <p className="font-semibold text-sm mt-2 text-text-light">Warehouse name</p>
                            <input 
                                placeholder="Name"
                                className='bg-secondary py-1 h-full w-full rounded-md text-text-dark px-2' 
                                onInput={(e)=>(setName(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col flex-nowrap gap-1 w-full">
                        <p className="font-semibold text-sm mt-2 text-text-light">Address</p>
                        <p 
                            className='bg-secondary py-1 h-full w-full rounded-md text-text-dark px-2' 
                        >{address}</p>
                    </div>             
                    <div className='accent-accent-dark mt-2 flex flex-col gap-2'>
                        <AddressPicker onSelect={handleAdd} />
                    </div>
                    <div className="flex flex-row flex-nowrap justify-between mt-3">
                        <Button onClick={()=>{setOpen(false)}} className='shadow-sm bg-accent-light border-primary-dark border text-text-dark hover:bg-accent-dark transition-color duration-200 ease-in-out'>Close</Button>
                        <Button className='shadow-sm hover:bg-accent-dark transition-colors duration-200 ease-in-out'
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

