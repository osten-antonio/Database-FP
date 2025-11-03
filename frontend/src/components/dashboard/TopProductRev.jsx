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

export function TopProductChartRev() {
  return (
    <Card className='bg-primary h-full'>
      <CardHeader>
        <CardTitle className='text-text'>Top products</CardTitle>
        <CardDescription className='text-text-light'>Revenue made</CardDescription>
      </CardHeader>
      <CardContent>
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
              tickFormatter={(value) => value.slice(0, 11)}
              tick={{ fill: "#F6F2FF", style: { fill: "#F6F2FF" } }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="Quantity" fill="var(--color-Quantity)" radius={5}>
                <LabelList
                dataKey="Quantity"
                position="right"
                offset={8}
                className="fill-text-light"
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
