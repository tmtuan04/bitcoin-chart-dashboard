"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import {
  fetchBitcoinCandles,
  fetchBitcoinVolume,
} from "@/app/lib/data";
import { Button } from "@/components/ui/button";

const CandlestickVolumeChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candlestickSeries, setCandlestickSeries] =
    useState<ISeriesApi<"Candlestick"> | null>(null);
  const [volumeSeries, setVolumeSeries] =
    useState<ISeriesApi<"Histogram"> | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [interval, setInterval] = useState("1h");

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chartInstance = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        backgroundColor: theme === "light" ? "#ffffff" : "#1e222d",
        textColor: theme === "light" ? "#000000" : "#ffffff",
      },
      grid: {
        vertLines: { color: theme === "light" ? "#e0e0e0" : "#2a2e39" },
        horzLines: { color: theme === "light" ? "#e0e0e0" : "#2a2e39" },
      },
    });

    const candleSeries = chartInstance.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: true,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const volSeries = chartInstance.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "",
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    setChart(chartInstance);
    setCandlestickSeries(candleSeries);
    setVolumeSeries(volSeries);

    return () => {
      chartInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!chart) return;
    chart.applyOptions({
      layout: {
        backgroundColor: theme === "light" ? "#ffffff" : "#1e222d",
        textColor: theme === "light" ? "#000000" : "#ffffff",
      },
      grid: {
        vertLines: { color: theme === "light" ? "#e0e0e0" : "#2a2e39" },
        horzLines: { color: theme === "light" ? "#e0e0e0" : "#2a2e39" },
      },
    });
  }, [theme, chart]);

  useEffect(() => {
    const fetchDataAndDraw = async () => {
      if (!candlestickSeries || !volumeSeries) return;
      try {
        const candles = await fetchBitcoinCandles(interval);
        const volumes = await fetchBitcoinVolume(interval);

        candlestickSeries.setData(
          candles.map((candle: any) => ({
            time: candle.time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }))
        );

        volumeSeries.setData(
          volumes.map((volume: any) => ({
            time: volume.time,
            value: volume.value,
            color: volume.color,
          }))
        );
      } catch (error) {
        console.error("Error fetching candlestick data:", error);
      }
    };

    fetchDataAndDraw();
  }, [interval, candlestickSeries, volumeSeries]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <p className="text-xl font-bold">Time Frames:</p>
        {["1m", "5m", "30m", "1h", "4h", "1d", "3d", "1w"].map((t) => (
          <Button
            key={t}
            onClick={() => setInterval(t)}
            className={`hover:bg-blue-600 hover:text-white ${
              interval === t ? "bg-blue-600 text-white shadow-lg border scale-105" : ""
            }`}
          >
            {t}
          </Button>
        ))}
        <Button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </Button>
      </div>
      <div ref={chartContainerRef} className="w-full h-[600px] border border-gray-300 dark:border-gray-700 rounded" />
    </div>
  );
};

export default CandlestickVolumeChart;
