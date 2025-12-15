"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function SearchableCBox({name, list, setSelected, value: externalValue}) {
    /*
    list = [{value:str, label:str},...]
    */
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(externalValue || "")

    // Sync internal value with external value
    useEffect(() => {
        setValue(externalValue || "")
    }, [externalValue])

    const handleSelect = (currentValue) => {
        const newValue = currentValue === value ? "" : currentValue
        setValue(newValue)
        setSelected(newValue)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full mt-1 justify-between bg-secondary border-2 border-accent-dark text-text-dark"
            >
            {value
                ? list.find((i) => i.value === value)?.label
                : `Select ${name}`}
            <ChevronsUpDown className="opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command className='bg-secondary text-text-dark'>
            <CommandInput placeholder={`Search ${name}`} className="h-9 " />
            <CommandList>
                <CommandEmpty>No {name} found.</CommandEmpty>
                <CommandGroup>
                {list.map((i) => (
                    <CommandItem
                    key={i.value}
                    value={i.value}
                    onSelect={handleSelect}
                    >
                    {i.label}
                    <Check
                        className={cn(
                        "ml-auto",
                        value === i.value ? "opacity-100" : "opacity-0"
                        )}
                    />
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>
    )
}