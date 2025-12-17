"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import {
Card,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"

function formatRupiah(value) {
    if (value >= 1_000_000_000) {
        return `Rp ${(value / 1_000_000_000).toFixed(2)} B`
    }
    if (value >= 1_000_000) {
        return `Rp ${(value / 1_000_000).toFixed(2)} jt`
    }
    if (value >= 1_000) {
        return `Rp ${(value / 1_000).toFixed(0)} rb`
    }
    return `Rp ${value}`
}

export function TotalSalesCard() {
const [data, setData] = useState(null)

useEffect(() => {
    const fetchData = async () => {
    try {
        const res = await api.get("/dashboard/total-sales")
        if (res.status >= 200 && res.status <= 300) {
            console.log(res.data)
            setData(res.data)
        }
    } catch (e) {
        console.error(e)
    }
    }
    fetchData()
}, [])

return (
    <Card className='min-w-0 md:col-span-3 bg-card-grad shadow-md shadow-accent-dark border-primary-dark border-2'>
    <CardHeader>
        <CardDescription className='text-text text-xl font-bold'>
        Total Sales
        </CardDescription>
        <CardDescription className='text-xs text-text opacity-75 font-semibold'>
        {data?.period || "Last 90 days"}
        </CardDescription>

        <CardTitle className="text-2xl font-bold text-text">
        {data ? formatRupiah(data.total_sales) : "—"}
        </CardTitle>
    </CardHeader>

    <CardFooter className="flex-col items-start h-full text-sm text-text">
        <p className='my-auto font-semibold'>Avg. Order Value:</p>
        <p className='pl-1 text-xs my-auto'>
        {data ? formatRupiah(data.avg_order_value ?? 0) : "—"}
        </p>

        <p className='my-auto font-semibold'>Orders:</p>
        <p className='pl-1 text-xs my-auto'>
        {data?.orders ?? "—"}
        </p>
    </CardFooter>
    </Card>
)
}
