"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartData = [
  { product: "Product 1", Quantity: 186 },
  { product: "Product 2", Quantity: 305 },
  { product: "Product 189374982", Quantity: 237 },
  { product: "Product 4", Quantity: 73 },
  { product: "Product 3", Quantity: 209 },
]

const chartConfig = {
  Quantity: {
    label: "Quantity",
    color: "var(--color-secondary)",
  },
}

export function TopProductChartQty() {
  return (
    <Card className='bg-card-grad shadow-md shadow-accent-dark border-primary-dark border-2 h-full'>
      <CardHeader className='flex gap-2 lg:gap-4 border-b flex-col'>
        <CardTitle className='text-text font-bold'>Top products</CardTitle>
        <CardDescription className='text-text-light text-xs font-semibold'>Quantity sold</CardDescription>
      </CardHeader>
      <CardContent className='flex items-center h-full'>
        <div className="w-full">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: -20,
              }}
            >
              <XAxis type="number" dataKey="Quantity" hide />
              <YAxis
                dataKey="product"
                type="category"
                tickLine={false}
                tickMargin={0}
                axisLine={false}
                width={80}
                tickFormatter={(value) => {
                  return value.length > 15 ? value.slice(0, 12) + '...' : value
                }
              }
                tick={{ fill: "#F6F2FF", style: { fill: "#F6F2FF" } }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="Quantity" fill="var(--color-Quantity)" radius={5}>
                <LabelList
                  dataKey="Quantity"
                  position="insideLeft"
                  offset={8}
                  className="fill-text-dark"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
