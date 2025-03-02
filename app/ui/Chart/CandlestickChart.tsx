"use client"

import React, { useEffect, useRef } from "react";
import { createChart, IChartApi } from "lightweight-charts"; // Import IChartApi explicitly

const CandlestickChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Explicitly type the chart as IChartApi
    const chart: IChartApi = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "#ffffff" }, textColor: "#000" },
      grid: { vertLines: { color: "#e0e0e0" }, horzLines: { color: "#e0e0e0" } },
    });

    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries();

    // Set sample data
    candleSeries.setData([
      { time: "2024-02-20", open: 50, high: 55, low: 48, close: 53 },
      { time: "2024-02-21", open: 53, high: 57, low: 51, close: 55 },
      { time: "2024-02-22", open: 55, high: 60, low: 54, close: 58 },
      { time: "2024-02-23", open: 58, high: 62, low: 57, close: 60 },
      { time: "2024-02-24", open: 60, high: 65, low: 59, close: 63 },
    ]);

    // Handle resizing
    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-96" />;
};

export default CandlestickChart;