'use client';
import { useState, useEffect } from "react"
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog"
import { DataTable } from "@/components/layout/BasicLayout"

function SupplierForm({ isOpen, setOpen, onSubmit, editData = null }) {
    const [formData, setFormData] = useState({
        name: editData?.name || '',
        address: editData?.address || '',
        email: editData?.email || '',
        phone_number: editData?.phone_number || ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || '',
                address: editData.address || '',
                email: editData.email || '',
                phone_number: editData.phone_number || ''
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit(formData);
            setFormData({ name: '', address: '', email: '', phone_number: '' });
            setOpen(false);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editData ? 'Edit Supplier' : 'New Supplier'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Supplier name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Address</label>
                        <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="Phone number"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {editData ? 'Update' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Supplier(){
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const fetchSuppliers = async (query = '') => {
        try {
            const endpoint = query ? `/supplier/search?name=${query}` : '/supplier';
            const res = await api.get(endpoint);
            if (res.status >= 200 && res.status <= 300) {
                setSuppliers(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch suppliers:", err);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchSuppliers(query);
    };

    const handleCreate = async (formData) => {
        try {
            await api.post("/supplier", formData);
            await fetchSuppliers(searchQuery);
        } catch (err) {
            console.error("Failed to create supplier:", err);
        }
    };

    const handleEdit = async (formData) => {
        try {
            await api.put(`/supplier/${selectedSupplier.id}`, formData);
            await fetchSuppliers(searchQuery);
            setIsEditing(false);
            setSelectedSupplier(null);
        } catch (err) {
            console.error("Failed to edit supplier:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/supplier/${selectedSupplier.id}`);
            await fetchSuppliers(searchQuery);
            setDeleteConfirm(false);
            setSelectedSupplier(null);
        } catch (err) {
            console.error("Failed to delete supplier:", err);
        }
    };
    
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
        },
        {
            accessorKey: 'phone_number',
            header: 'Phone'
        },
        {
            accessorKey: 'actions',
            header: '',
            cell: ({ row }) => (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button className='mx-0'>
                            <EllipsisVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="end">
                        <DropdownMenuItem onClick={() => {
                            setSelectedSupplier(row.original);
                            setIsEditing(true);
                            setFormOpen(true);
                        }}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            setSelectedSupplier(row.original);
                            setDeleteConfirm(true);
                        }}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ];

    const tableProps = {
        data: suppliers,
        enableRowSelection: false,
        idName: 'id',
        columns,
        setRowSelection: undefined,
        rowSelection: undefined
    };

    return(
        <div className="p-6 pl-10 w-screen xl:ml-auto xl:w-6/7 2xl:w-8/9 mt-12">
            <SupplierForm
                isOpen={formOpen}
                setOpen={setFormOpen}
                onSubmit={isEditing ? handleEdit : handleCreate}
                editData={isEditing ? selectedSupplier : null}
            />

            <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. Are you sure you want to permanently
                            delete this supplier from our servers?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                        <Button onClick={handleDelete} className='bg-red-600 hover:bg-red-700'>Confirm Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-row justify-between mb-4">
                <h1 className='text-text-dark text-3xl font-bold'>Suppliers</h1>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search suppliers..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className='bg-primary-light h-10 w-[250px] rounded-md text-text-light px-2 shadow-md shadow-accent-dark'
                    />
                </div>
            </div>
            <DataTable {...tableProps}/>
        </div>
    )
}