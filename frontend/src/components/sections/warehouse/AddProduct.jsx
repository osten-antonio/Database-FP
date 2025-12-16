import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { SearchableCBox } from '@/components/widget/SearchableCBox';

export function AddProduct({isOpen, setOpen, restock, id, onOrderCreated}){ 
    const [price, setPrice] = useState();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (isOpen && id) {
            if (restock) {
                fetchRestockProducts();
            } else {
                fetchAvailableProducts();
            }
        }
    }, [isOpen, id, restock]);

    const fetchAvailableProducts = async () => {
        try {
            // Get all products
            const allRes = await api.get('/product');
            // Get warehouse products
            const whRes = await api.get(`/warehouse/${id}/products`);
            
            if (allRes.status >= 200 && allRes.status <= 300 && whRes.status >= 200 && whRes.status <= 300) {
                const allProducts = allRes.data || [];
                const warehouseProducts = whRes.data || [];
                const normalizedProducts = allProducts.map(p => ({
                    id: p.product_id,                     
                    name: p.product_name,                 
                    cost: parseFloat(p.price),           
                    category_id: p.category_id,
                    supplier: p.supplier_name,
                    total_sales: parseFloat(p.total_sales),
                    account_id: p.account_id
                }));
                const warehouseProductIds = new Set(warehouseProducts.map(p => p.id));
                const availableOnly = normalizedProducts.filter(p => !warehouseProductIds.has(p.id));
                setAvailableProducts(availableOnly);
                
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    const fetchRestockProducts = async () => {
        try {
            const whRes = await api.get(`/warehouse/${id}/products`);
            if (whRes.status >= 200 && whRes.status < 300) {
                const warehouseProducts = whRes.data || [];
                console.log(warehouseProducts)
                setAvailableProducts(warehouseProducts);
            }
        } catch (err) {
            console.error("Failed to fetch warehouse products:", err);
        }
    };


    const handleProductSelect = (val) => {
        setName(val);
        const product = availableProducts.find(p => (p.product_id || p.id).toString() === val.toString());
        setSelectedProduct(product);
        setPrice(product?.price || product?.cost || 0);
    };

    const handleSubmit = async () => {
        console.log(selectedProduct)
        console.log(amount)
        if (!selectedProduct || !amount) {
            alert('Please select a product and enter an amount');
            return;
        }

        try {
            const today = new Date().toISOString().split('T')[0];
            await api.post(`/restock`, {
                product_id: selectedProduct.id,
                warehouse_id: parseInt(id),
                amount: parseInt(amount),
                cost: selectedProduct.cost*amount,
                date: today
            });
            
            setOpen(false);
            setName('');
            setAmount('');
            setSelectedProduct(null);
            setPrice(0);
            
            // Trigger parent component refresh for both modes
            if (onOrderCreated) {
                onOrderCreated();
            }
            // Emit a global event so any restock table can refresh without prop wiring
            try {
                window.dispatchEvent(new CustomEvent('restock:created', { detail: { product_id: selectedProduct?.id, warehouse_id: id } }));
            } catch (e) {
                // ignore if window not available
            }
            
            // Refresh products list for non-restock mode
            if (!restock) {
                fetchAvailableProducts();
            }
        } catch (err) {
            console.error("Failed to add product:", err);
            alert(`Failed to ${restock ? 'create restock order' : 'add product'}`);
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
                {restock ? <span className="font-bold text-2md text-text">Restock Product</span> : <span className="font-bold text-2md text-text">Add Product to Warehouse</span>}
                <span className="ml-1">
                    <div className="w-full flex flex-row gap-3">
                        <div className="flex flex-col flex-nowrap gap-1">
                            <p className="font-semibold text-sm mt-2 text-text-light">Product name</p>
                            <SearchableCBox
                                name={"Product name"}
                                list={availableProducts.map(p => ({
                                    value: p.id,
                                    label: p.name
                                }))}
                                setSelected={handleProductSelect}   
                                externalValue={name}
                            />
                        </div>
                        <div className="flex flex-col flex-nowrap gap-1">
                            <p className="font-semibold text-sm mt-2 text-text-light">Amount</p>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-secondary text-text-dark border-2 border-accent-dark rounded-md mt-1 p-1"
                            />
                        </div>
                        
                    </div>
                    <div className="w-full flex flex-row gap-3">
                        <div className="flex flex-col flex-nowrap items-end gap-1 w-full">
                            <p className="font-semibold text-sm mt-2 text-text-light">Unit Price: Rp. {selectedProduct?.price || selectedProduct?.cost || 0}</p>
                        </div>
                    </div>
                    <div className="flex flex-row flex-nowrap justify-between mt-3">
                        <Button onClick={()=>{setOpen(false)}} className='shadow-sm bg-accent-light border-primary-dark border text-text-dark hover:bg-accent-dark transition-color duration-200 ease-in-out'>Close</Button>
                        <Button className='shadow-sm hover:bg-accent-dark transition-colors duration-200 ease-in-out'
                            onClick={handleSubmit}
                        >
                                {restock ? 'Create Restock Order' : 'Add Product'}
                        </Button>
                    </div>   
                </span>       
            </div>
        </div>
    )
}