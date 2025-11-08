"use client"

import {useState} from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const chartData = [
  { date: "2024-06-01", Sales: 178 },
  { date: "2024-06-02", Sales: 470},
  { date: "2024-06-03", Sales: 103 },
  { date: "2024-06-04", Sales: 439 },
  { date: "2024-06-05", Sales: 88 },
  { date: "2024-06-06", Sales: 294 },
  { date: "2024-06-07", Sales: 323 },
  { date: "2024-06-08", Sales: 385 },
  { date: "2024-06-09", Sales: 438 },
  { date: "2024-06-10", Sales: 155 },
  { date: "2024-06-11", Sales: 92 },
  { date: "2024-06-12", Sales: 492 },
  { date: "2024-06-13", Sales: 81 },
  { date: "2024-06-14", Sales: 426 },
  { date: "2024-06-15", Sales: 307 },
  { date: "2024-06-16", Sales: 371 },
  { date: "2024-06-17", Sales: 475 },
  { date: "2024-06-18", Sales: 107 },
  { date: "2024-06-19", Sales: 341 },
  { date: "2024-06-20", Sales: 408 },
  { date: "2024-06-21", Sales: 169 },
  { date: "2024-06-22", Sales: 317 },
  { date: "2024-06-23", Sales: 480 },
  { date: "2024-06-24", Sales: 132 },
  { date: "2024-06-25", Sales: 141 },
  { date: "2024-06-26", Sales: 434 },
  { date: "2024-06-27", Sales: 448 },
  { date: "2024-06-28", Sales: 149 },
  { date: "2024-06-29", Sales: 103 },
  { date: "2024-06-30", Sales: 446 },
]

const chartConfig = {
  Sales: {
    label: "Sales",
    color: "var(--color-accent-ui)",
  },
} 

export function TotalSales() {
  const [month, setMonth] = useState("month")

  return (
    <Card className="pt-0 bg-card-grad shadow-md shadow-accent-dark border-primary-dark border-2 h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className='text-text font-bold'>Total Sales in {month}</CardTitle>
        </div>
        <Select value={month} className='bg-secondary'>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex bg-secondary"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-secondary">
            <SelectItem value="90d" className="rounded-lg bg-secondary">
              Last 3 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 h-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full bg-secondary rounded-xl"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Sales)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Sales)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
              tick={{ fill: "#352D60", style: { fill: "#352D60" } }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="Sales"
              type="natural"
              fill="url(#fillSales)"
              stroke="var(--color-Sales)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
