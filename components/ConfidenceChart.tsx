"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CLASS_INFO } from "@/lib/constants";
import type { Prediction } from "@/types";

interface ConfidenceChartProps {
  predictions: Prediction[];
}

const COLOR_MAP: Record<string, string> = {
  blue: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#eab308",
  purple: "#a855f7",
};

interface ChartDataItem {
  name: string;
  label: string;
  confidence: number;
  color: string;
  icon: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-xl">
      <div className="flex items-center gap-2">
        <span className="text-lg">{data.icon}</span>
        <span className="font-medium">{data.label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums">
        {(data.confidence * 100).toFixed(1)}%
      </p>
    </div>
  );
}

export default function ConfidenceChart({
  predictions,
}: ConfidenceChartProps) {
  const chartData: ChartDataItem[] = useMemo(
    () =>
      [...predictions]
        .sort((a, b) => a.confidence - b.confidence)
        .map((pred) => {
          const info = CLASS_INFO[pred.className];
          return {
            name: pred.className,
            label: info?.label || pred.className,
            confidence: pred.confidence,
            color: COLOR_MAP[info?.color || "blue"],
            icon: info?.icon || "🔍",
          };
        }),
    [predictions]
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">All Class Confidences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 1]}
                tickFormatter={(val: number) => `${(val * 100).toFixed(0)}%`}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={({ x, y, payload }) => {
                  const item = chartData.find(
                    (d) => d.label === payload.value
                  );
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={-8}
                        y={0}
                        dy={4}
                        textAnchor="end"
                        fontSize={13}
                      >
                        {item?.icon} {payload.value}
                      </text>
                    </g>
                  );
                }}
                width={140}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="confidence"
                radius={[0, 8, 8, 0]}
                barSize={24}
                isAnimationActive={true}
                animationDuration={800}
                animationBegin={200}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
