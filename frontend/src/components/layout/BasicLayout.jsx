"use client"
import { useState } from 'react';
import { ListFilter, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"


function DataTable({data, columns, enableRowSelection, idName, setRowSelection, rowSelection}){
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
            rowSelection
        },
        getRowId: (row, index) => `${row[idName]}-${index}`,
        enableRowSelection: enableRowSelection,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableMultiRowSelection: false,
    });

    return (
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
                    {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row[idName]}
                            onClick={(e) => {
                                    if(setRowSelection){
                                        const tag = (e.target && e.target.tagName) || "";
                                        if (["INPUT", "BUTTON", "A"].includes(tag)) return;

                                        row.toggleSelected();
                                    }
                                }
                            }

                        >
                        {row.getVisibleCells().map((cell,i) => {
                            const isLast = i === row.getVisibleCells().length - 1;
                            
                            return (<TableCell
                            key={cell.id}
                            className={`text-text-dark relative font-semibold
                                ${!isLast ? "after:content-[''] after:absolute after:right-2 after:top-2 after:bottom-2 after:w-px after:bg-primary" : ""}
                                `}
                            >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>)
                        })}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-text-dark"
                        >
                        No results.
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
    )
}



function BasicLayout({name, tableProps, FilterWindow, CreateWindow}){
    const [isFilter, setFilter] = useState(false);
    const [filters, setFilters] = useState(undefined);
    const [isCreate, setCreate] = useState(false);
    
    return(
        <div className="p-6 pl-10 w-screen xl:ml-auto xl:w-6/7 2xl:w-8/9 mt-12">          
            <FilterWindow isOpen={isFilter} setOpen={setFilter} filters={filters} setFilters={setFilters}/>
            <CreateWindow isOpen={isCreate} setOpen={setCreate}/>

            <h1 className='text-text-dark text-3xl font-bold mb-4'>
                {name}
            </h1>
            <div className='flex flex-row flex-wrap justify-between gap-2 w-full'>
                <button 
                    onClick={()=>{setCreate(true)}}
                    className='bg-primary p-2 px-10 rounded-lg text-text-light font-semibold shadow-md shadow-accent-dark'
                >
                    Create
                </button>
                <div className='w-xl flex flex-row gap-2'>
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
    );
}

export {DataTable, BasicLayout};