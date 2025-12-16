import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SearchableCBox } from "@/components/widget/SearchableCBox";
import CurrencyInput from 'react-currency-input-field';
import { Pencil } from "lucide-react";
import api from "@/lib/axios";
import { useData } from "@/app/context/DataContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ColorPicker,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from '@/components/ui/shadcn-io/color-picker';
import { useId } from "react";

function ColorPickerForm({ disabled, textState, setTextState}){
    const handleColorChange = useCallback((color) => {
        let hex = null;

        if (typeof color === "string") {
            hex = color;
        } 

        else if (Array.isArray(color) && color.length >= 3) {
            const toHex = (c) =>
            Number.isFinite(c)
                ? Math.round(c).toString(16).padStart(2, "0").toUpperCase()
                : "00";
            hex = `#${toHex(color[0])}${toHex(color[1])}${toHex(color[2])}`;
        } 

        else if (color && typeof color === "object" && "r" in color) {
            const toHex = (c) =>
            Number.isFinite(c)
                ? Math.round(c).toString(16).padStart(2, "0").toUpperCase()
                : "00";
            hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
        }


        if (hex && /^#[A-Fa-f0-9]{6}$/.test(hex) && hex !== textState) {
            setTextState(hex);
        }
    }, [textState, setTextState]);

    return(
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline" disabled={disabled}
                        role="combobox"
                        className='group aspect-square mt-1 justify-center text-accent-ui border-0 hover:bg-white/30 transition-colors ease-in-out duration-300'
                    style={{ backgroundColor: textState  }}
                    >
                        <Pencil className="opacity-0 group-hover:opacity-100 fixed transition-opacity ease-in-out duration-300" color="#484AB3" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-fit h-fit bg-secondary">
                    <DialogTitle className='font-bold text-text-dark'>Select color</DialogTitle>
                    <ColorPicker 
                        defaultValue={textState}
                        onChange={handleColorChange}
                        className="w-85 rounded-md min-h-85 border bg-background p-4 shadow-sm"
                    >
                        <ColorPickerSelection />
                        <div className="flex items-center gap-4">
                            <ColorPickerOutput />
                            <ColorPickerHue />
                        </div>
                        <div className="flex items-center gap-2">
                            <ColorPickerFormat />
                        </div>
                    </ColorPicker>    
                </DialogContent>
            </form>
        </Dialog>
    )
}

function CreateCategory({setSelectedCategory}) {
    const [name, setName] = useState('');
    const { categories, setCategories } = useData();
    const [cTextColor, setCTextColor] = useState('#000000');
    const [categoryColor, setCategoryColor] = useState('#FFFFFF');
    const [cTColorDisabled, setCTColorDisabled] = useState(false);
    const [cColorDisabled, setCColorDisabled] = useState(false);
    const [open, setOpen] = useState(false);
    const handleCreateCategory = async (e) => {
        e.preventDefault(); 
        try {
            const res = await api.post("/category", {
                name,
                bg_color: categoryColor,
                text_color: cTextColor
            });
            if (res.status >= 200 && res.status <= 300) {
                setCategories(prev => [...prev, { category_id: res.data.category_id, name, bg_color: categoryColor, text_color: cTextColor }]);
                setSelectedCategory({ category_id: res.data.category_id, name, bg_color: categoryColor, text_color: cTextColor })
                setName('');
                setCategoryColor('#FFFFFF');
                setCTextColor('#000000');
                setOpen(false)
            }
        } catch (err) {
            console.error("Failed to create category:", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}  >
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline"
                        role="combobox"
                        className="w-full mt-1 justify-center bg-primary text-text border-0 hover:bg-accent-dark transition-colors ease-in-out duration-300"
                    >Create new Category</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-secondary border-2 border-accent-dark">
                <DialogHeader>
                    <DialogTitle className='font-bold text-text-dark'>Create new category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <p className="font-semibold text-sm mt-2 text-text-dark">Category name</p>
                        <input 
                            placeholder="Name"
                            className='bg-secondary py-1 h-full w-full rounded-md border border-accent-ui text-text-dark px-2' 
                            onInput={(e)=>(setName(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-row flex-wrap justify-between w-full">
                        <div className="grid gap-2">
                            <p className="font-semibold text-sm mt-2 text-text-dark">Category color</p>
                            <div className="flex flex-row flex-nowrap gap-1">
                                <ColorPickerForm disabled={cColorDisabled} textState={categoryColor} setTextState={setCategoryColor}/>
                                <input
                                    type="text"
                                    prefix="#"
                                    placeholder="#RRGGBB"
                                    value={categoryColor}
                                    className='bg-secondary py-1 h-full w-[140px] rounded-md border border-accent-ui text-text-dark px-2' 
                                    pattern="^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                    title="Enter a valid hex color (e.g. #ff9900 or #f90)"
                                    onFocus={()=>{
                                            setCColorDisabled(true);
                                    }}
                                    onChange={(e) =>{                 
                                        let val = e.target.value.replace(/[^#A-Fa-f0-9]/g, ""); 
                                        if (!val.startsWith("#")) val = "#" + val;
                                        setCategoryColor(val.slice(0, 7)); 
                                    }} 
                                    onBlur={() => { 
                                        let val = categoryColor.replace(/[^A-Fa-f0-9]/g, ''); 
                                        if (!val.startsWith('#')) val = '#' + val;

                                        if (val.length === 4) {
                                            val = "#" + val[1] + val[1] + val[2] + val[2] + val[3] + val[3];
                                        } else if (val.length === 3){
                                            val ='#' + val.slice(1, 3).repeat(3);
                                        } else if (val.length === 6){
                                            val = "#" + val.slice(1, 6) + val[5];
                                        } else if (val.length !== 7) {
                                            val= '#000000';
                                        }

                                        setCategoryColor(val);
                                        setCColorDisabled(false);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <p className="font-semibold text-sm mt-2 text-text-dark">Text color</p>
                            <div className="flex flex-row flex-nowrap gap-1">
                                <ColorPickerForm disabled={cTColorDisabled} textState={cTextColor} setTextState={setCTextColor}/>
                                <input
                                    type="text"
                                    prefix="#"
                                    placeholder="#RRGGBB"
                                    value={cTextColor}
                                    className='bg-secondary py-1 h-full w-[140px] rounded-md border border-accent-ui text-text-dark px-2' 
                                    pattern="^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                    title="Enter a valid hex color (e.g. #ff9900 or #f90)"
                                    onFocus={()=>{
                                            setCTColorDisabled(true);
                                    }}
                                    onChange={(e) =>{                 
                                        let val = e.target.value.replace(/[^#A-Fa-f0-9]/g, ""); 
                                        if (!val.startsWith("#")) val = "#" + val;
                                        setCTextColor(val.slice(0, 7)); 
                                    }} 
                                    onBlur={() => { 
                                        let val = cTextColor.replace(/[^A-Fa-f0-9]/g, ''); 
                                        if (!val.startsWith('#')) val = '#' + val;

                                        if (val.length === 4) {
                                            val = "#" + val[1] + val[1] + val[2] + val[2] + val[3] + val[3];
                                        } else if (val.length === 3){
                                            val ='#' + val.slice(1, 3).repeat(3);
                                        } else if (val.length === 6){
                                            val = "#" + val.slice(1, 6) + val[5];
                                        } else if (val.length !== 7) {
                                            val= '#000000';
                                        }

                                        setCTextColor(val);
                                        setCTColorDisabled(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button variant="outline" >Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className='shadow-sm hover:bg-accent-dark transition-colors duration-200 ease-in-out' onClick={handleCreateCategory}>Create</Button> 
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}



export function CreateWindow({isOpen, setOpen, onSubmit, editData = null}){ 
    const { categories, suppliers } = useData();
    
    const [price, setPrice] = useState(editData?.price || '');
    const [name, setName] = useState(editData?.product_name || '');
    const [selectedCategory, setSelectedCategory] = useState(editData?.category_id || '');
    const [selectedSupplier, setSelectedSupplier] = useState(editData?.supplier_name || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(editData)
        if (editData) {
            setName(editData.product_name || '');
            setPrice(editData.price || '');
            setSelectedCategory(editData.category_id || '');
            setSelectedSupplier(editData.supplier_name || '');
        } else {
            setName('');
            setPrice('');
            setSelectedCategory('');
            setSelectedSupplier('');
        }
    }, [editData, isOpen]);

    const categoryList = categories.map(cat => ({
        value: cat.category_id || cat.id,
        label: cat.name
    }));

    const supplierList = suppliers.map(sup => ({
        value: sup.name,
        label: sup.name
    }));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit({
                product_name: name,
                price: parseFloat(price) || 0,
                category_id: selectedCategory || 0,
                supplier_name: selectedSupplier
            });
        } catch (err) {
            console.error("Failed to submit:", err);
        } finally {
            setLoading(false);
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
                <p className="font-bold text-2md text-text">{editData ? 'Edit Product' : 'New Product'}</p>
                <span className="ml-1">
                    <div className="w-full flex flex-row gap-3">
                        <div className="flex flex-col flex-nowrap gap-1">
                            <p className="font-semibold text-sm mt-2 text-text-light">Product name</p>
                            <input 
                                placeholder="Name"
                                value={name}
                                className='bg-secondary py-1 h-full w-full rounded-md text-text-dark px-2' 
                                onInput={(e)=>(setName(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col flex-nowrap gap-1">
                            <p className="font-semibold text-sm mt-2 text-text-light">Price</p>
                            <CurrencyInput
                                className='bg-secondary py-1 h-full w-full rounded-md text-text-dark px-2'
                                name="price"
                                prefix="Rp. "
                                placeholder="Price"
                                decimalsLimit={3}
                                value={price}
                                onValueChange={(value, name, values)=>{
                                    setPrice(values.float);
                                }}
                            />
                        </div>
                        
                    </div>
                    <div className="w-full flex flex-row gap-3">
                        <div className="flex flex-col flex-nowrap gap-1 w-full">
                            <p className="font-semibold text-sm mt-2 text-text-light">Category</p>
                            <SearchableCBox name='category' list={categoryList} setSelected={setSelectedCategory} value={selectedCategory}/>
                        </div>
                        <div className="flex flex-col flex-nowrap gap-1 h-full mt-auto w-full">
                            <CreateCategory setSelectedCategory={setSelectedCategory}/>
                        </div>
                    </div>
                    <div className="flex flex-col flex-nowrap gap-1">
                        <p className="font-semibold text-sm mt-2 text-text-light">Supplier</p>
                        <SearchableCBox name='supplier' list={supplierList} setSelected={setSelectedSupplier} value={selectedSupplier}/>
                    </div>
                    <div className="flex flex-row flex-nowrap justify-between mt-3">
                        <Button onClick={()=>{setOpen(false)}} className='shadow-sm bg-accent-light border-primary-dark border text-text-dark hover:bg-accent-dark transition-color duration-200 ease-in-out'>Close</Button>
                        <Button className='shadow-sm hover:bg-accent-dark transition-colors duration-200 ease-in-out' 
                            disabled={loading}
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
