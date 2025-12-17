import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
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
import { useData } from "@/app/context/DataContext";

export function FilterWindow({ isOpen, setOpen, filters = {}, setFilters }) { 
  const { suppliers: availableSuppliers, categories: availableCategories } = useData();

  const [suppliers, setSuppliers] = useState(filters.suppliers ?? []);
  const [categories, setCategories] = useState(filters.categories ?? []);
  const [minCost, setMinCost] = useState(filters.minCost ?? '');
  const [maxCost, setMaxCost] = useState(filters.maxCost ?? '');

  useEffect(() => {
    if (!isOpen) return;

    setSuppliers(filters.suppliers ?? []);
    setCategories(filters.categories ?? []);
    setMinCost(filters.minCost ?? '');
    setMaxCost(filters.maxCost ?? '');
    }, [isOpen]);


  const AddItem = ({ availableItems, itemIDName, name, setItems }) => {
    const [selected, setSelected] = useState(undefined);

    const handleSelect = () => {
      const selectedItem = availableItems.find(
        i => String(i[itemIDName]) === selected
      );
      if (!selectedItem) return;

      setItems(prev => {
        if (prev.some(i => i[itemIDName] === selectedItem[itemIDName])) return prev;
        return [...prev, selectedItem];
      });
      setSelected(undefined);
    };

    return (
      <Dialog>
        <DialogTrigger className="bg-primary-light text-text px-2 p-1 rounded-md text-sm">
          + Add
        </DialogTrigger>
        <DialogContent className="w-fit bg-secondary border-2 border-accent-dark">
          <DialogHeader>
            <DialogTitle className="text-text-dark">
              Select {name}
            </DialogTitle>
            <Select onValueChange={setSelected}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Select a ${name}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableItems.map(item => (
                    <SelectItem
                      key={item[itemIDName]}
                      value={String(item[itemIDName])}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleSelect}>Add</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div
      onClick={() => setOpen(false)}
      className={`backdrop-blur-sm fixed top-0 left-0 w-screen h-screen z-20 flex items-center justify-center
        transition-opacity duration-200 ease-out
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col bg-primary-light max-w-[345px] rounded-2xl p-5 shadow-md shadow-accent-dark border-primary-dark border-2"
      >
        <p className="font-bold text-2md text-text">Filter</p>

        <p className="font-semibold text-sm mt-2 text-text-light">Cost</p>
        <form className="mt-1 flex flex-row gap-2 text-text-light">                        
          <CurrencyInput
            className="bg-secondary py-1 w-full rounded-md text-text-dark px-2"
            prefix="Rp. "
            placeholder="Min"
            decimalsLimit={0}
            value={minCost}
            onValueChange={(v, _, values) => setMinCost(values?.float ?? '')}
          />
          -
          <CurrencyInput
            className="bg-secondary py-1 w-full rounded-md text-text-dark px-2"
            prefix="Rp. "
            placeholder="Max"
            decimalsLimit={0}
            value={maxCost}
            onValueChange={(v, _, values) => setMaxCost(values?.float ?? '')}
          />
        </form>

        <p className="font-semibold text-sm mt-2 text-text-light">Suppliers</p>
            <ListSelector
                Dialog={() => (
                    <AddItem
                    availableItems={availableSuppliers}
                    itemIDName="id"
                    name="supplier"
                    setItems={setSuppliers}
                    />
                )}
                items={suppliers}
                setItems={setSuppliers}
                itemIDName="id"
            />

        <p className="font-semibold text-sm mt-2 text-text-light">Category</p>
            <ListSelector
            Dialog={() => (
                <AddItem
                availableItems={availableCategories}
                itemIDName="category_id"
                name="category"
                setItems={setCategories}
                />
            )}
            items={categories}
            setItems={setCategories}
            itemIDName="category_id"
            />

        <div className="flex justify-between mt-3">
          <Button
            onClick={() => setOpen(false)}
            className="bg-accent-light text-text-dark"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setFilters({
                suppliers,
                categories,
                minCost,
                maxCost
              });
              setOpen(false);
            }}
          >
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
}
