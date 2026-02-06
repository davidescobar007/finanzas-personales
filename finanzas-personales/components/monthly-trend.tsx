"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { getSavedCurrency } from "@/lib/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MonthlyTrendProps {
  data: { month: string; expenses: number; savings: number; investments: number }[];
}

const MonthlyTrend = ({ data }: MonthlyTrendProps) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendencia Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No hay datos para mostrar</p>
        </CardContent>
      </Card>
    );
  }

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    return date.toLocaleDateString("es-ES", { month: "short" });
  };

  const categories = data.map((item) => formatMonth(item.month));

  const options: any = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      lineCap: "round",
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 500,
          colors: "#374151",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 500,
          colors: "#374151",
        },
        formatter: (val: string) => {
          const num = parseFloat(val);
          if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
          if (num >= 1000) return (num / 1000).toFixed(1) + "K";
          return num.toFixed(0);
        },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "13px",
        fontFamily: "Inter, system-ui, sans-serif",
      },
      y: {
        formatter: (val: string) => {
          return new Intl.NumberFormat(getSavedCurrency() === 'USD' ? 'en-US' : 'es-ES', {
            style: 'currency',
            currency: getSavedCurrency(),
          }).format(parseFloat(val));
        },
      },
    },
    colors: ["#ef4444", "#22c55e", "#3b82f6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: ["#ef4444", "#22c55e", "#3b82f6"],
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      fontSize: "13px",
      fontFamily: "Inter, system-ui, sans-serif",
      fontWeight: 500,
      itemMargin: {
        horizontal: 20,
        vertical: 0,
      },
      labels: {
        colors: "#374151",
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Gastos",
      data: data.map((item) => item.expenses),
    },
    {
      name: "Ahorros",
      data: data.map((item) => item.savings),
    },
    {
      name: "Inversiones",
      data: data.map((item) => item.investments),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia Mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-[350px]">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={350}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { MonthlyTrend };
