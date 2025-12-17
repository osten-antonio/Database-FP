"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios'
import { BasicLayout } from '@/components/layout/BasicLayout';
import { FilterWindow } from '@/components/sections/order/filter';
import { CreateWindow } from '@/components/sections/order/create';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [confirmation, setConfirmation] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [filters, setFilters] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");

    const fetchOrders = async (query = '', appliedFilters = {}) => {
        try {
            let endpoint = '/order';
            
            // If filters are applied, use the filter endpoint
            const hasActiveFilters = (filters) => {
                return (
                    filters.minCost ||
                    filters.maxCost ||
                    (filters.suppliers && filters.suppliers.length > 0) ||
                    (filters.warehouses && filters.warehouses.length > 0) ||
                    filters.deliver === true ||
                    filters.overdue === true ||
                    filters.inProgress === true ||
                    filters.orderedRange ||
                    filters.deliveryRange
                )
                }
            if (hasActiveFilters(appliedFilters)) {
                endpoint = '/order/filter';
                const params = new URLSearchParams();
                
                if (appliedFilters.orderedRange?.from) {
                    params.append('order_date_from', appliedFilters.orderedRange.from.toISOString().split('T')[0]);
                }
                if (appliedFilters.orderedRange?.to) {
                    params.append('order_date_to', appliedFilters.orderedRange.to.toISOString().split('T')[0]);
                }
                if (appliedFilters.deliveryRange?.from) {
                    params.append('deliver_date_from', appliedFilters.deliveryRange.from.toISOString().split('T')[0]);
                }
                if (appliedFilters.deliveryRange?.to) {
                    params.append('deliver_date_to', appliedFilters.deliveryRange.to.toISOString().split('T')[0]);
                }
                if (appliedFilters.minCost) {
                    params.append('cost_min', appliedFilters.minCost);
                }
                if (appliedFilters.maxCost) {
                    params.append('cost_max', appliedFilters.maxCost);
                }
                if (appliedFilters.deliver) {
                    params.append('delivered', 'true');
                }
                if (appliedFilters.overdue) {
                    params.append('overdue', 'true');
                }
                if (appliedFilters.inProgress) {
                    params.append('in_progress', 'true');
                }
                if (appliedFilters.warehouses && appliedFilters.warehouses.length > 0) {
                    params.append('warehouse', appliedFilters.warehouses.map(w => w.warehouse_id).join(','));
                }
                if (appliedFilters.suppliers && appliedFilters.suppliers.length > 0) {
                    params.append('supplier', appliedFilters.suppliers.map(s => s.name).join(','));
                }
                
                if (params.toString()) {
                    endpoint += '?' + params.toString();
                }
            } else if (query) {
                let cleanedQuery = query.trim();
                if (cleanedQuery.startsWith('?')) {
                    cleanedQuery = cleanedQuery.slice(1);
                }
                const match = cleanedQuery.match(/^(item|customer_name|address)\s*=\s*(.+)$/);

                if (match) {
                    const [, key, value] = match;
                    endpoint = `/order/search?${key}=${encodeURIComponent(value)}`;
                } else {
                    // fallback
                    endpoint = `/order/search?customer_name=${encodeURIComponent(cleanedQuery)}`;
                }
            }
            
            const res = await api.get(endpoint);
            if (res.status >= 200 && res.status <= 300) {
                console.log(res.data)
                setOrders(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchOrders(query, filters);
    };

    const handleApplyFilters = (appliedFilters) => {
        setFilters(appliedFilters);
        fetchOrders(searchQuery, appliedFilters);
    };

    const handleCreateClick = () => {
        setIsEditing(false);
        setSelectedOrder(null);
        setCreateOpen(true);
    };

    const handleCreate = async (formData) => {
        try {
            await api.post("/order", formData);
            await fetchOrders(searchQuery, filters);
            setCreateOpen(false);
        } catch (err) {

            alert(err.response.data.detail);
        }
    };

    const handleEdit = async (formData) => {
        try {
            await api.put(`/order/${selectedOrder.order_id}`, formData);
            await fetchOrders(searchQuery, filters);
            setCreateOpen(false);
            setIsEditing(false);
            setSelectedOrder(null);
        } catch (err) {
            console.error("Failed to edit order:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/order/${selectedOrder.order_id}/${selectedOrder.product_id}`);
            await fetchOrders(searchQuery, filters);
            setConfirmation(false);
            setSelectedOrder(null);
        } catch (err) {
            console.error("Failed to delete order:", err);
        }
    };

    const columns = [
        {
            accessorKey: "order_id",
            header: "ID",
            cell: ({ row }) => <span>{row.getValue("order_id")}</span>,
        },
        {
            accessorKey: "customer_name",
            header: "Customer",
        },
        {
            accessorKey: "item",
            header: "Item",
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
            accessorKey: "expected_delivery_date",
            header: "Delivery date",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "warehouse_name",
            header: "Warehouse",
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({row})=>{                
                return(
                    <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button className='mx-0'>
                        <EllipsisVertical />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40" align="end">
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOrder(row.original);
                            setIsEditing(true);
                            setCreateOpen(true);
                        }}>
                        Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOrder(row.original);
                            setConfirmation(true);
                        }}>
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ];

    useEffect(() => {
        const keys = Object.keys(rowSelection);
        if (keys.length === 0) return;

        const rawId = keys[0];
        if (!rawId) return;

        const id = rawId.split('-')[0];

        const selectedRow = orders.find(
            (o) => String(o.order_id) === String(id)
        );

        if (!selectedRow) return;

        setSelectedAddress(selectedRow.delivery_address);
        setAddressDialogOpen(true);
    }, [rowSelection, orders]);


    const tableProps = {
        data: orders,
        enableRowSelection: true,
        idName: 'order_id',
        columns,
        setRowSelection: setRowSelection,
        rowSelection: rowSelection
    }
    return(
        <>
            <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle className="text-text-dark">
                        Delivery Address
                    </DialogTitle>
                    <DialogDescription>
                        {selectedAddress || "No address provided"}
                    </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                    <Button onClick={() => setAddressDialogOpen(false)}>
                        Close
                    </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmation} onOpenChange={setConfirmation} >
                <DialogContent className="[&~.fixed.inset-0]:bg-transparent">
                    <DialogHeader>
                    <DialogTitle className='text-text-dark'>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this order from our servers?
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <Button variant="outline" onClick={() => setConfirmation(false)}>Cancel</Button>
                    <Button onClick={handleDelete} className='bg-red-600 hover:bg-red-700'>Confirm Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            <CreateWindow 
                isOpen={createOpen}
                setOpen={setCreateOpen}
                onSubmit={isEditing ? handleEdit : handleCreate}
                editData={isEditing ? selectedOrder : null}
            />

            <FilterWindow 
                isOpen={filterOpen} 
                setOpen={setFilterOpen} 
                filters={filters}
                setFilters={handleApplyFilters}
            />
            <BasicLayout name='Orders' 
                tableProps={{...tableProps, data: orders, enableRowSelection: true}} 
                FilterWindow={() => null}
                CreateWindow={() => null}
                onSearch={handleSearch}
                onFilter={() => setFilterOpen(true)}
                onCreateClick={handleCreateClick}
            />
        </>
    )
}