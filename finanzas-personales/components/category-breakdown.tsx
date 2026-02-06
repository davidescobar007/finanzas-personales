"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { getSavedCurrency } from "@/lib/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CategoryBreakdownProps {
  data: { category: string; total: number }[];
  categories: { name: string; icon: string; color: string }[];
}

const CategoryBreakdown = ({ data, categories }: CategoryBreakdownProps) => {
  const chartData = data.map((item) => {
    const cat = categories.find((c) => c.name === item.category);
    return {
      x: cat?.icon + " " + item.category || item.category,
      y: item.total,
      color: cat?.color || "#6b7280",
    };
  });

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No hay datos para mostrar</p>
        </CardContent>
      </Card>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.y, 0);

  const options: any = {
    chart: {
      type: "pie",
      foreColor: "#374151",
      fontFamily: "Inter, system-ui, sans-serif",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    labels: chartData.map((item) => item.x),
    colors: chartData.map((item) => item.color),
    stroke: {
      show: true,
      width: 3,
      colors: ["#fff"],
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: "0%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "13px",
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      itemMargin: {
        horizontal: 12,
        vertical: 6,
      },
      labels: {
        colors: "#374151",
        useSeriesColors: false,
        formatter: (seriesName: string, opts: any) => {
          const value = opts.w.globals.series[opts.seriesIndex];
          const percent = ((value / total) * 100).toFixed(1);
          return `${seriesName} (${percent}%)`;
        },
      },
      markers: {
        width: 14,
        height: 14,
        radius: 14,
        offsetX: -2,
      },
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
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
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "12px",
            itemMargin: {
              horizontal: 8,
              vertical: 4,
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          legend: {
            fontSize: "10px",
            itemMargin: {
              horizontal: 6,
              vertical: 2,
            },
            markers: {
              width: 10,
              height: 10,
              radius: 10,
            },
          },
        },
      },
    ],
  };

  const series = chartData.map((item) => item.y);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-[380px]">
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            height={380}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { CategoryBreakdown };
