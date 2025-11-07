'use client';
import { DataTable } from "@/components/layout/BasicLayout"
import { useState, useEffect } from "react"
import api from "@/lib/axios";

export default function Supplier(){
    const [suppliers, setSuppliers] = useState([]);
    const [rowSelection, setRowSelection] = useState({});


    useEffect(()=>{
        async function getSuppliers(){
            try {
                const res = await api.get("/suppliers");
                if (res.status >= 200 && res.status <= 300) {
                    setSuppliers(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getSuppliers();
    },[]);

    useEffect(()=>{
        console.log(rowSelection);
    },[rowSelection]);
    
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
            accessorKey: 'address',
            header: 'Address'
        },
        {
            accessorKey: 'email',
            header: 'Email'
        }
    ];

    const tableProps = {
        data:suppliers,
        enableRowSelection: true,
        idName: 'id',
        columns,
        setRowSelection,
        rowSelection
    };
    return(
        <div className="p-6 pl-10 w-screen xl:ml-auto xl:w-6/7 2xl:w-8/9 mt-12">          
            <div className="flex flex-row justify-between">
                <h1 className='text-text-dark text-3xl font-bold mb-4'>
                    Supplier
                </h1>
                <form>
                    <input type='text' className='bg-primary-light h-10 w-[250px]  rounded-md text-text-light px-2 shadow-md shadow-accent-dark' placeholder='Search'/>
                </form>
            </div>
            <DataTable {...tableProps}/>
            
        </div>
    )
}