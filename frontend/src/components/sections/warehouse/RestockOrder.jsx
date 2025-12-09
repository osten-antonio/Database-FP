import { DataTable } from "@/components/layout/BasicLayout";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddProduct } from "./AddProduct";
import { useState } from "react";

export function RestockOrderTable({id}){
    const [restock, setRestock] = useState(false);
    const columns = [
        {
            accessorKey: "restock_id",
            header: "ID",
            cell: ({ row }) => <span>{row.getValue("restock_id")}</span>,
        },
        {
            accessorKey: "item",
            header: "Item",
        },
        {
            accessorKey: "category",
            header: "Category",
        },
        {
            accessorKey: "supplier_name",
            header: "Supplier",
        },
        {
            accessorKey: "amount",
            header: "Amount",
        },
        {
            accessorKey: "cost",
            header: "Cost",
            cell: ({ row }) => {
                const price = Number(row.getValue("cost"));
                const formatted = price % 1 === 0 ? price.toString() : price.toFixed(3);
                return formatted;
            }
        },
        {
            accessorKey: "order_date",
            header: "Date ordered",
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({row})=>{                
                return(
                    <Button className='mx-0'>
                        <ClipboardCheck />
                    </Button>
                )
            }
        }
    ];
    const tableProps = {
        data:[{ //TODO fetch from API
            restock_id: 1,
            item: "Product A",
            category: "Category 1",
            supplier_name: "Supplier X",
            amount: 100,
            cost: 500000,
            order_date: "2024-01-15"
        }],
        idName:'restock_id',
        columns,
        enableRowSelection: false
    }
    return(
        <>
            <AddProduct isOpen={restock} setOpen={setRestock} restock={true} id={id} />
            <Card className='w-full mt-5 bg-card-grad shadow-md shadow-accent-dark border-primary-dark border-2'>
                <CardHeader className='w-full flex flex-row justify-between items-center'>
                    <CardTitle className="text-2xl font-bold text-text">
                        Outgoing product orders
                    </CardTitle>
                    <button onClick={() => setRestock(true)} className='bg-primary p-2 px-10 rounded-lg text-text-light font-semibold shadow-md shadow-accent-dark'>
                        Restock
                    </button>
                </CardHeader>
                <CardFooter className="md:grid-cols-5 w-full h-fit text-sm text-text">
                    <DataTable {...tableProps} />
                </CardFooter>
            </Card>
        </>
    )

}
