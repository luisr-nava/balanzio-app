"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Period } from "@/utils";
import { useAnalytics } from "../hooks";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
export function formatTooltipTitle(label: string, period: Period) {
  switch (period) {
    case "week":
      // lunes, martes, etc.
      return label;

    case "month":
      // día del mes
      return `Día ${label}`;

    case "year":
      // mes
      return label;

    default:
      return label;
  }
}
export default function Analytics() {
  const {
    hasAnyValue,
    period,
    setPeriod,
    PERIOD_OPTIONS,
    analyticsLoading,
    salesVsPurchasesChart,
    incomesVsExpensesChart,
    topProducts,
    bestSales,
  } = useAnalytics();

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255)",
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 8,
          boxHeight: 8,
          padding: 16,
        },
      },

      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,

        position: "average",
        yAlign: "bottom",
        caretPadding: 12, // 👈 separación del eje
        padding: 10,

        titleSpacing: 4,
        titleMarginBottom: 6,

        titleFont: {
          size: 12,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },

        backgroundColor: "rgba(0, 0, 0, 0.85)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255,255,255,0.15)",
        borderWidth: 1,
        callbacks: {
          title(context) {
            const label = context[0]?.label ?? "";
            return formatTooltipTitle(label, period);
          },
          label(context) {
            const value = context.parsed.y ?? 0;
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },

    scales: {
      x: {
        type: "category",
        grid: {
          display: false,
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255)",
          maxRotation: 0,
          autoSkip: period !== "year",
          minRotation: period === "year" ? 35 : 0,
          font: {
            size: 14,
            weight: "bolder",
          },
        },
      },

      y: {
        beginAtZero: true,
        min: hasAnyValue ? undefined : 0,
        max: hasAnyValue ? undefined : 10,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255)",
          font: {
            size: 14,
            weight: "bolder",
          },
          callback(value) {
            return Number(value).toLocaleString("es-AR");
          },
        },
      },
    },
  };
  return (
    <Card className="">
      <CardHeader className="flex w-full justify-end">
        <CardTitle className="text-base font-semibold w-1/2 md:w-1/10">
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as Period)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>

      <CardContent className="py-2">
        {analyticsLoading ? (
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            Cargando datos…
          </div>
        ) : (
          <div className="md:flex w-full gap-5">
            <div className="h-[280px] md:w-1/2">
              <Bar data={incomesVsExpensesChart} options={chartOptions} />
            </div>
            <div className="h-[280px] md:w-1/2 ">
              <Bar data={salesVsPurchasesChart} options={chartOptions} />
            </div>
          </div>
        )}
      </CardContent>
      <div className="md:flex">
        <Card className="mx-4 w-1/2 h-[280px] flex flex-col">
          <CardTitle className="px-4 py-3">
            Top 5 de productos más vendidos
          </CardTitle>

          <CardContent className="flex-1 overflow-y-auto px-4">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay productos destacados en este período
              </p>
            ) : (
              topProducts.slice(0, 5).map((product, index) => (
                <div
                  key={`${product.productId}-${index}`}
                  className={`flex justify-between rounded-md px-3 py-2 mb-2 bg-muted/40 ${
                    index === 0 ? "border border-primary" : ""
                  }`}>
                  <p className="font-medium capitalize flex gap-2">
                    <span className="text-muted-foreground">{index + 1}°</span>
                    <span>{product.name}</span>
                  </p>

                  <p className="text-sm text-muted-foreground flex gap-1">
                    Cantidad:
                    <span className="font-medium">{product.quantity}</span>
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card className="mx-4 w-1/2 h-[280px] flex flex-col">
          <CardTitle className="px-4 py-3">Mejor venta del período</CardTitle>

          <CardContent className="flex-1 px-4">
            {!bestSales ? (
              <p className="text-sm text-muted-foreground">
                No hay ventas destacadas en este período
              </p>
            ) : (
              <div className="rounded-md border border-primary bg-primary/10 p-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  {new Date(bestSales.date).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p className="text-lg font-semibold">
                  
                  ${bestSales.total.toLocaleString("es-AR")}
                </p>

                <div className="flex justify-end text-sm text-muted-foreground">
                  <span>Total de ítems: {bestSales.itemsCount}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  {/* <span>Detalle</span> */}
                  <span className="font-medium text-foreground">
                    {/* {bestSales.name ?? "Venta general"} */}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}

