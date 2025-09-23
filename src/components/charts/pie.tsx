import { Pie, PieChart } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function UserStatesPieChart({data}: {data: any}) {

  const {totalCorrectAnswers, totalWrongAnswers, totalUnanswered} = data

  const chartData = [
    { question: "correct", visitors: totalCorrectAnswers, fill: "var(--chart-2)" },
    { question: "wrong", visitors: totalWrongAnswers, fill: "var(--destructive)" },
    { question: "unanswered", visitors: totalUnanswered, fill: "var(--chart-1)" },
  ]

  const chartConfig = {
    visitors: {
      label: "প্রশ্ন পরিসংখ্যান",
    },
    correct: {
      label: "Correct",
      color: "var(--chart-2)",
    },
    wrong: {
      label: "Wrong",
      color: "var(--destructive)",
    },
    unanswered: {
      label: "Unanswered",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie data={chartData} dataKey="visitors" nameKey="question" />
      </PieChart>
    </ChartContainer>
  )
}