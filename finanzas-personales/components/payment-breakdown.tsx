"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { getSavedCurrency } from "@/lib/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PaymentBreakdownProps {
  data: { paymentMethod: string; total: number }[];
  paymentMethods: { name: string; icon: string; color: string }[];
}

const PaymentBreakdown = ({ data, paymentMethods }: PaymentBreakdownProps) => {
  const chartData = data.map((item) => {
    const method = paymentMethods.find((p) => p.name === item.paymentMethod);
    return {
      x: method?.icon + " " + item.paymentMethod || item.paymentMethod,
      y: item.total,
      fillColor: method?.color || "#6b7280",
    };
  });

  if (chartData.length === 0 || chartData.every(item => item.y === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por medio de pago</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No hay datos para mostrar</p>
        </CardContent>
      </Card>
    );
  }

  const options: any = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      parentHeightOffset: 0,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        columnWidth: "60%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.map((item) => item.x),
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 500,
          colors: "#374151",
        },
        rotate: -45,
        rotateAlways: true,
        trim: false,
        minHeight: 80,
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
    fill: {
      type: "solid",
      opacity: 1,
    },
    colors: chartData.map((item) => item.fillColor),
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
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.1,
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "80%",
            },
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
      data: chartData.map((item) => item.y),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por medio de pago</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-[300px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={300}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { PaymentBreakdown };
