import {TopProductChartQty} from '@/components/sections/dashboard/TopProductQty'
import {TopProductChartRev} from '@/components/sections/dashboard/TopProductRev'
import {StockLevels} from '@/components/sections/dashboard/StockLevels'
import {TotalSales} from '@/components/sections/dashboard/TotalSales'
import { RecentOrders } from '@/components/sections/dashboard/RecentOrders'
import { TotalSalesCard } from '@/components/sections/dashboard/TotalSalesCard'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Home() {
  const format = (value) => {
      if (!value) return "Rp 0"
      if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(2)}B`
      if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(2)}M`
      if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(2)}jt`
      return `Rp ${value}`
    }

  return (
    <div className="p-6 pl-10 w-screen xl:ml-auto xl:w-6/7 2xl:w-8/9 mt-12">
      <h1 className='text-text-dark text-3xl font-bold mb-4'>
        Dashboard
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-11 gap-4'>
          <div className='min-w-0 md:col-span-4'>
            <TopProductChartQty/>
          </div>
          <div className='min-w-0 md:col-span-4'>
            <TopProductChartRev/>
          </div>
          <TotalSalesCard/>
          <div className='min-w-0 md:col-span-4'>
            <StockLevels/>
          </div>
          <div className='min-w-0 md:col-span-7'>
            <TotalSales/>
          </div>
      </div>
      <RecentOrders/>
    </div>
  );
}
