import { DataTable } from "@/components/layout/BasicLayout";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddProduct } from "./AddProduct";
import { useState, useEffect, useRef, forwardRef } from "react";
import api from "@/lib/axios";

export const RestockOrderTable = forwardRef(function RestockOrderTable(props, ref){
    const { id, warehouseId, onCompleteOrder } = props || {};
    const fetchId = id || warehouseId;
    const [restock, setRestock] = useState(false);
    const [restockOrders, setRestockOrders] = useState([]);
    const [confirming, setConfirming] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (fetchId) {
            fetchRestockOrders();
        }
    }, [fetchId]);

    useEffect(() => {
        // Expose fetchRestockOrders via ref
        if (ref) {
            ref.current = { fetchRestockOrders };
        }
    }, [ref]);

    useEffect(() => {
        // Listen for global restock created events so tables refresh without prop wiring
        const handler = () => {
            if (id) fetchRestockOrders();
        };
        window.addEventListener('restock:created', handler);
        return () => window.removeEventListener('restock:created', handler);
    }, [id]);

    const fetchRestockOrders = async () => {
        try {
            const res = await api.get(`/restock/${fetchId}`);
            if (res.status >= 200 && res.status <= 300) {
                setRestockOrders(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch restock orders:", err);
        }
    };

    const handleConfirmOrder = async () => {
        if (!selectedOrder) return;

        try {
            await api.post(`/restock/${selectedOrder.id}/complete`);
            setConfirming(false);
            setSelectedOrder(null);
            fetchRestockOrders();
            onCompleteOrder();
        } catch (err) {
            console.error("Failed to complete restock order:", err);
            alert('Failed to complete restock order');
        }
    };

    const columns = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <span>{row.getValue("id")}</span>,
        },
        {
            accessorKey: "product_name",
            header: "Item",
        },
        {
            accessorKey: "category_id",
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
                return `Rp. ${formatted}`;
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
                    <Button 
                        onClick={() => {
                            setSelectedOrder(row.original);
                            setConfirming(true);
                        }}
                    >
                        <ClipboardCheck />
                    </Button>
                )
            }
        }
    ];
    
    const tableProps = {
        data: restockOrders,
        idName:'restock_id',
        columns,
        enableRowSelection: false
    }

    return(
        <>
            <AddProduct isOpen={restock} setOpen={setRestock} restock={true} id={fetchId} onOrderCreated={fetchRestockOrders} />
            
            {confirming && (
                <div
                    onClick={() => setConfirming(false)}
                    className={`overflow-y-auto
                        backdrop-blur-sm fixed top-0 left-0 w-screen h-screen z-20 flex items-center justify-center
                        transition-opacity duration-200 ease-out
                        ${confirming ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
                >            
                    <div onClick={(e) => e.stopPropagation()} className='flex flex-col bg-primary-light max-w-[400px] rounded-2xl p-5 shadow-md shadow-accent-dark border-primary-dark border-2'>
                        <span className="font-bold text-xl text-text">Confirm Restock Order</span>
                        <div className="mt-4 space-y-2">
                            <p className="text-text-light">
                                <span className="font-semibold">Product:</span> {selectedOrder?.product_name}
                            </p>
                            <p className="text-text-light">
                                <span className="font-semibold">Amount:</span> {selectedOrder?.amount} units
                            </p>
                            <p className="text-text-light">
                                <span className="font-semibold">Unit Cost:</span> Rp. {selectedOrder?.cost}
                            </p>
                            <p className="text-text-light">
                                <span className="font-semibold">Total:</span> Rp. {selectedOrder?.amount * selectedOrder?.cost}
                            </p>
                            <p className="text-text-light">
                                <span className="font-semibold">Date:</span> {selectedOrder?.order_date}
                            </p>
                        </div>
                        <div className="flex flex-row flex-nowrap justify-between mt-5">
                            <Button 
                                onClick={() => setConfirming(false)} 
                                className='shadow-sm bg-accent-light border-primary-dark border text-text-dark hover:bg-accent-dark'
                            >
                                Cancel
                            </Button>
                            <Button 
                                className='shadow-sm'
                                onClick={handleConfirmOrder}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
    );
});
