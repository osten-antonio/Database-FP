import {TopProductChartQty} from '@/components/dashboard/TopProductQty'
import {TopProductChartRev} from '@/components/dashboard/TopProductRev'
import {StockLevels} from '@/components/dashboard/StockLevels'
import {TotalSales} from '@/components/dashboard/TotalSales'
import { RecentOrders } from '@/components/dashboard/RecentOrders'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Home() {
  return (
    // Note: I changed the bg to a lighter one because better contrast
    <div className="p-6 w-screen xl:ml-auto xl:w-6/7 2xl:w-8/9 mt-12">
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
          <Card className='min-w-0 md:col-span-3 bg-card-grad shadow-md shadow-accent- border-primary-dark border-2'>
            <CardHeader>
              <CardDescription className='text-text text-xl font-bold'>Total Sales</CardDescription>
              <CardDescription className='text-xs text-text opacity-75 font-semibold'>Last 90 days</CardDescription>
              <CardTitle className="text-2xl font-bold text-text">
                $500.50k
              </CardTitle>
              <CardDescription className='text-xs text-text opacity-75'>+2.5% vs prev. 90 days</CardDescription>
            </CardHeader>
            <CardFooter className="flex-col items-start h-full text-sm text-text">
              <p className='my-auto font-semibold'>Avg. Order Value:</p>
              <p className='pl-1 text-xs my-auto'>$36.25</p>
              <p className='my-auto font-semibold'>Orders:</p>
              <p className='pl-1 text-xs my-auto'>12,891</p>
            </CardFooter>
          </Card>
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
