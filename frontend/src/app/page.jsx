import {TopProductChartQty} from '@/components/dashboard/TopProductQty'
import {TopProductChartRev} from '@/components/dashboard/TopProductRev'
import {StockLevels} from '@/components/dashboard/StockLevels'
import {TotalSales} from '@/components/dashboard/TotalSales'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Home() {
  return (
    // TODO layout, Order shipping status 
    <div className="p-3 w-screen">
      <h1 className='text-text-dark text-3xl font-bold mb-4'>
        Dashboard
      </h1>
      <div className='flex flex-col gap-2 flex-wrap'>
          <div className="min-w-[265px] w-3/9">
            <TopProductChartQty/>
          </div>
          <div className="min-w-[265px] w-3/9">
            <TopProductChartRev/>
          </div>
          <Card className='bg-primary w-2/8'>
            <CardHeader>
              <CardDescription className='text-text text-xl'>Total Sales</CardDescription>
              <CardDescription className='text-xs text-text-light opacity-75'>Last 90 days</CardDescription>
              <CardTitle className="text-2xl font-semibold text-white">
                $500.50k
              </CardTitle>
              <CardDescription className='text-xs text-text-light opacity-75'>+2.5% vs prev. 90 days</CardDescription>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm text-text-light">
              <p>Avg. Order Value:</p>
              <p className='pl-1 text-xs'>$36.25</p>
              <p>Orders:</p>
              <p className='pl-1 text-xs'>12,891</p>
            </CardFooter>
          </Card>
          <StockLevels/>
          <TotalSales/>
      </div>
    </div>
  );
}
