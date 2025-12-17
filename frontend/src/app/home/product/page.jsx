"use client"
import { useState, useEffect } from 'react';
import api from '@/lib/axios'
import { CreateWindow } from '@/components/sections/product/create';
import { FilterWindow } from '@/components/sections/product/filter';
import { BasicLayout } from '@/components/layout/BasicLayout';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
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
import { Input } from '@/components/ui/input';

export default function Products(){
    const [products, setProducts] = useState([]);
    const [confirmation, setConfirmation] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [filters, setFilters] = useState({});

    const fetchProducts = async (query = '', appliedFilters = {}) => {
        try {
            let endpoint = '/product';
            let res;

            // Build filter parameters if filters are applied
            if (Object.keys(appliedFilters).length > 0) {
                const params = new URLSearchParams();
                
                if (appliedFilters.minCost) params.append('min_cost', appliedFilters.minCost);
                if (appliedFilters.maxCost) params.append('max_cost', appliedFilters.maxCost);
                if (appliedFilters.suppliers && appliedFilters.suppliers.length > 0) {
                    const supplierIds = appliedFilters.suppliers.map(s => s.id).join(',');
                    params.append('suppliers', supplierIds);
                }

                if (appliedFilters.categories && appliedFilters.categories.length > 0) {
                    const categoryIds = appliedFilters.categories.map(c => c.category_id).join(',');
                    params.append('categories', categoryIds);
                }
                
                
                res = await api.get(`/product/filter?${params.toString()}`);
                if (res.status >= 200 && res.status <= 300) {
                    let data = res.data || [];
                    
                    
                    setProducts(data);
                }
            } else if (query) {
                let cleanedQuery = query.trim();
                if (cleanedQuery.startsWith('?')) {
                    cleanedQuery = cleanedQuery.slice(1);
                }

                const match = cleanedQuery.match(/^(name|supplier)\s*=\s*(.+)$/);

                if (match) {
                    const [, key, value] = match;
                    endpoint = `/product/search?${key}=${encodeURIComponent(value)}`;
                } else {
                    endpoint = `/product/search?name=${encodeURIComponent(cleanedQuery)}`;
                }


            }
            // res = await api.get(endpoint);
            // if (res.status >= 200 && res.status <= 300) {
            //     setProducts(res.data || []);
            // }
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchProducts(query, filters);
    };

    const handleApplyFilters = (appliedFilters) => {
        setFilters(appliedFilters);
        fetchProducts(searchQuery, appliedFilters);
    };

    const handleCreateClick = () => {
        setIsEditing(false);
        setSelectedProduct(null);
        setCreateOpen(true);
    };

    const handleCreate = async (formData) => {
        try {
            await api.post("/product", formData);
            await fetchProducts(searchQuery, filters);
            setCreateOpen(false);
        } catch (err) {
            console.error("Failed to create product:", err);
        }
    };

    const handleEdit = async (formData) => {
        try {
            await api.put(`/product/${selectedProduct.product_id}`, formData);
            await fetchProducts(searchQuery, filters);
            setIsEditing(false);
            setSelectedProduct(null);
            setCreateOpen(false);
        } catch (err) {
            console.error("Failed to edit product:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/product/${selectedProduct.product_id}`);
            await fetchProducts(searchQuery, filters);
            setConfirmation(false);
            setSelectedProduct(null);
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    const columns = [
        {
            accessorKey: "product_id",
            header: "ID",
            cell: ({ row }) => <span>{row.getValue("product_id")}</span>,
        },
        {
            accessorKey: "product_name",
            header: "Name",
        },
        {
            accessorKey: "total_sales",
            header: "Total sales",
            cell: ({ row }) => <span>Rp. {row.getValue("total_sales")}</span>,
        },
        {
            accessorKey: "supplier_name",
            header: "Supplier",
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const price = Number(row.getValue("price"));
                const formatted = price % 1 === 0 ? price.toString() : price.toFixed(3);
                return `Rp. ${formatted}`;
            }
        },
        {
            accessorKey: "category_id",
            header: "Category",
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
                        <DropdownMenuItem onClick={() => { 
                            setSelectedProduct({
                                ...row.original,
                                id: row.getValue("product_id"), 
                            }); 
                            setIsEditing(true); 
                        }}>

                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setSelectedProduct({
                                ...row.original,
                                id: row.getValue("product_id"), 
                            });
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

    const tableProps = {
        data: products,
        enableRowSelection: false,
        idName: 'id',
        columns,
        setRowSelection: undefined,
        rowSelection: undefined
    }

    const CustomCreateWindow = (props) => (
        <CreateWindow 
            isOpen={isEditing | createOpen}
            setOpen={isEditing ? setIsEditing : setCreateOpen}
            onSubmit={isEditing ? handleEdit : handleCreate}
            editData={isEditing ? selectedProduct : null}
        />
    );
    
    return (
        <>
            <Dialog open={confirmation} onOpenChange={setConfirmation} >
                <DialogContent className="[&~.fixed.inset-0]:bg-transparent">
                    <DialogHeader>
                    <DialogTitle className='text-text-dark'>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete this product from our servers?
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
                editData={isEditing ? selectedProduct : null}
            />

            <FilterWindow 
                isOpen={filterOpen} 
                setOpen={setFilterOpen} 
                filters={filters}
                setFilters={handleApplyFilters}
            />
                <BasicLayout 
                    name='Products' 
                    tableProps={tableProps} 
                    FilterWindow={() => null}
                    CreateWindow={() => null}
                    onSearch={handleSearch}
                    onFilter={() => setFilterOpen(true)}
                    onCreateClick={handleCreateClick}
                />
        </>
    )
}