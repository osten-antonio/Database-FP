"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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
  { warehouse: "January", Stock: 186 },
  { warehouse: "February", Stock: 305 },
  { warehouse: "March", Stock: 237 },
  { warehouse: "April", Stock: 73 },
  { warehouse: "May", Stock: 209 },
  { warehouse: "June", Stock: 214 },
]

const chartConfig = {
  Stock: {
    label: "Stock",
    color: "var(--color-accent-ui)",
  },
}

export function StockLevels() {
  return (
    <Card className='bg-card-grad shadow-md shadow-accent-dark border-primary-dark border-2 h-full pt-0'>
      <CardHeader className='flex items-center border-b py-6 sm:flex-row'>
        <CardTitle className='text-text py-2'>Warehouse stocks level</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <ChartContainer config={chartConfig} 
        className='text-text-dark bg-secondary rounded-xl pt-2'
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="warehouse"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                tick={{ fill: "#352D60", style: { fill: "#352D60" } }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="Stock" fill="var(--color-accent-ui)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-text-dark"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
