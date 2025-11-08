import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import CurrencyInput from 'react-currency-input-field';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ListSelector } from "@/components/widget/ListSelector"
import { Calendar as CalendarIcon } from "lucide-react";

export function FilterWindow({isOpen, setOpen, filters = {}, setFilters}){ 
    const [orderedRange, setOrdered] = useState(filters.orderedRange ?? undefined);
    const [deliveryRange, setDelivery] = useState(filters.deliveryRange ?? undefined);
    const [warehouses, setWarehouses] = useState(filters.warehouses ?? []);
    const [suppliers, setSuppliers] = useState(filters.suppliers ?? []);
    const [minCost, setMinCost] = useState(filters.minCost??'');
    const [maxCost, setMaxCost] = useState(filters.maxCost??'');
    const [deliver,setDeliver] = useState(filters.deliver?? false);
    const [overdue,setOverdue] = useState(filters.overdue?? false);
    const [inProgress,setInProgress] = useState(filters.inProgress?? false);
    const [availableWarehouses, setAvailableWarehouses] = useState([]);
    const [availableSuppliers, setAvailableSuppliers] = useState([]);


    useEffect(()=>{
        async function getWarehouses(){
            try {
                const res = await api.get("/warehouses");
                if (res.status >= 200 && res.status <= 300) {
                    setAvailableWarehouses(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        async function getSupplier(){
            try {
                const res = await api.get("/suppliers");
                if (res.status >= 200 && res.status <= 300) {
                    setAvailableSuppliers(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getWarehouses();
        getSupplier();
    },[])

    const AddItem = ({availableItems, itemIDName, name})=>{
        const [selected,setSelected] = useState(undefined);

        const handleSelect = () => {
            const selectedItem = availableItems.find(
            (i) => i[itemIDName] === selected
            );

            if (!selectedItem) return;

            setWarehouses((prev) => {
                if (prev.find((i) => i[itemIDName] === selectedItem[itemIDName])) 
                    return prev;
                return [...prev, selectedItem];
            });
        };

        return (
            <Dialog>
                <DialogTrigger className="bg-primary-light text-text px-2 p-1 rounded-md text-sm">+ Add</DialogTrigger>
                <DialogContent className='w-fit bg-secondary border-2 border-accent-dark'>
                    <DialogHeader>
                    <DialogTitle className='text-text-dark'>Select {name}</DialogTitle>
                       <Select onValueChange={setSelected}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={`Select a ${name}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        availableItems.map((item)=>{
                                            return(
                                                <SelectItem key={item[itemIDName]} value={item[itemIDName]}>
                                                    {item[itemIDName]} {item.name} @ {item.address}
                                                </SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className='bg-accent-light border-primary border text-text-dark hover:bg-accent-dark transition-color duration-200 ease-in-out'>
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleSelect} className=' hover:bg-accent-dark transition-color duration-200 ease-in-out'>
                                Add
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    const DateRangeSelect = ({range, setRange})=>{
        return (
            <div className="flex flex-col gap-3">
            <Popover>
                <PopoverTrigger asChild>
                <Button variant="outline" id="dates" className="w-56 justify-between bg-secondary border-accent-dark text-text-dark">
                    {range?.from && range?.to
                    ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                    : "Select date"}
                    <CalendarIcon />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0 bg-secondary border-accent-dark border-2" align="start">
                <Calendar
                    mode="range"
                    selected={range}
                    captionLayout="dropdown"
                    onSelect={(range) => {
                    setRange(range)
                    }} />
                </PopoverContent>
            </Popover>
            </div>
        );
        }

    return(
        <div
            onClick={() => setOpen(false)}
            className={` overflow-y-auto
                backdrop-blur-sm fixed top-0 left-0 w-screen h-screen z-20 flex items-center justify-center
                transition-opacity duration-200 ease-out
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
        >
            <div onClick={(e) => e.stopPropagation()} className='flex flex-col bg-primary-light max-w-[345px] rounded-2xl p-5 shadow-md shadow-accent-dark border-primary-dark border-2'>
                <p className="font-bold text-2md text-text">Filter</p>
                <span className="ml-1">
                    <p className="font-semibold text-sm mt-2 text-text-light">Date ordered</p>
                    <div className="flex items-center gap-2 mt-1">
                        <DateRangeSelect range={orderedRange} setRange={setOrdered}/>
                        <Button onClick={()=>{setOrdered(undefined)}}>Clear</Button>
                    </div>
                    <p className="font-semibold text-sm mt-2 text-text-light">Delivery date</p>
                    <div className="flex items-center gap-2 mt-1">
                        <DateRangeSelect range={deliveryRange} setRange={setDelivery}/>
                        <Button onClick={()=>{setDelivery(undefined)}}>Clear</Button>
                    </div>
                    <p className="font-semibold text-sm mt-2 text-text-light">Cost</p>
                    <form className="mt-1 flex flex-row gap-2 text-text-light">                        
                        <CurrencyInput
                            className='bg-secondary py-1 h-full w-full rounded-md text-text-dark px-2'
                            id="min"
                            name="mincost"
                            prefix="Rp. "
                            placeholder="Min"
                            decimalsLimit={3}
                            value={minCost}
                            onValueChange={(value, name, values)=>{
                                setMinCost(values.float);
                            }}
                        />
                        -
                        <CurrencyInput
                            className='bg-secondary py-1 h-full w-full rounded-md text-text-dark px-2'
                            id="min"
                            name="maxcost"
                            prefix="Rp. "
                            placeholder="Max"
                            decimalsLimit={3}
                            value={maxCost}
                            onValueChange={(value, name, values)=>{
                                setMaxCost(values.float);
                            }}
                        />
                    </form>
                    <p className="font-semibold text-sm mt-2 text-text-light">Status</p>
                    <form className="mt-1 flex flex-row gap-3 text-text-light items-center">                        
                        <span className="flex items-center flex-row gap-1">
                            <input   
                                checked={deliver}
                                onChange={(e) => setDeliver(e.target.checked)}
                                className="accent-primary border rounded-xs w-4 h-4 cursor-pointer hover:accent-primary-light"
                                type="checkbox" id="deliver"
                            />
                            <label> Delivered</label>
                        </span>
                        <span className="flex items-center flex-row gap-1">
                            <input 
                                checked={overdue}
                                onChange={(e) => setOverdue(e.target.checked)}
                                className="accent-primary border rounded-xs w-4 h-4 cursor-pointer hover:accent-primary-light"
                                type="checkbox" id="overdue" 
                            />
                            <label> Overdue</label>
                        </span>
                        <span className="flex items-center flex-row gap-1">
                            <input
                                checked={inProgress} 
                                onChange={(e) => setInProgress(e.target.checked)} 
                                className="accent-primary border rounded-xs w-4 h-4 cursor-pointer hover:accent-primary-light" 
                                type="checkbox" id="progress"
                            />
                            <label> In progress</label>
                        </span>
                    </form>
                    <p className="font-semibold text-sm mt-2 text-text-light">Status</p>
                    <ListSelector 
                        Dialog={()=>(<><AddItem availableItems={availableWarehouses} itemIDName='warehouse_id' name='warehouse'/></>)} 
                        items={warehouses} setItems={setWarehouses} itemIDName='warehouse_id'
                    />
                    <p className="font-semibold text-sm mt-2 text-text-light">Category</p> 
                    {/* TODO */}
                    <ListSelector 
                        Dialog={()=>(<><AddItem availableItems={availableWarehouses} itemIDName='warehouse_id' name='category'/></>)} 
                        items={warehouses} setItems={setWarehouses} itemIDName='warehouse_id'
                    />
                    <p className="font-semibold text-sm mt-2 text-text-light">Supplier</p>
                    <ListSelector 
                        Dialog={()=>(<><AddItem availableItems={availableSuppliers} itemIDName='id' name='supplier'/></>)} 
                        items={suppliers} setItems={setSuppliers} itemIDName='id'
                    />      
                    <div className="flex flex-row flex-nowrap justify-between mt-3">
                    <Button onClick={()=>{setOpen(false)}} className='shadow-sm bg-accent-light border-primary-dark border text-text-dark hover:bg-accent-dark transition-color duration-200 ease-in-out'>Close</Button>
                    <Button className='shadow-sm hover:bg-accent-dark transition-colors duration-200 ease-in-out'
                        onClick={() => {

                        setFilters({
                            orderedRange,
                            deliveryRange,
                            warehouses,
                            suppliers,
                            minCost: minCost,
                            maxCost: maxCost,
                            deliver: deliver,
                            overdue: overdue,
                            inProgress: inProgress
                        });

                        setOpen(false);
                        }}
                    >
                        Filter</Button>
                    </div>          
                </span>
            </div>
        </div>
    )
}

