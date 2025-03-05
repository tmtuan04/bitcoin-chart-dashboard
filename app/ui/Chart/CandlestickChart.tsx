"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import {
  fetchBitcoinCandles,
  fetchBitcoinVolume,
  fetchCurrentPrice,
  fetchPriceOneMinuteAgo,
} from "@/app/lib/data";
import { Button } from "@/components/ui/button";

// Hàm lấy theme hiện tại
const getCurrentTheme = (): "light" | "dark" => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const CandlestickVolumeChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candlestickSeries, setCandlestickSeries] =
    useState<ISeriesApi<"Candlestick"> | null>(null);
  const [volumeSeries, setVolumeSeries] =
    useState<ISeriesApi<"Histogram"> | null>(null);

  const [interval, setInterval] = useState("1h");
  const [currPrice, setCurrPrice] = useState<number | null>(null);
  const [price1mAgo, setPrice1mAgo] = useState<number | null>(null);

  const getPrices = async () => {
    try {
      const currPriceData = await fetchCurrentPrice();
      const price1mAgoData = await fetchPriceOneMinuteAgo();
      setCurrPrice(currPriceData ? currPriceData.price : null);
      setPrice1mAgo(price1mAgoData ? price1mAgoData.price : null);
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  // Khởi tạo chart với tính năng kéo chuột
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const currentTheme = getCurrentTheme();
    const chartInstance = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 450,
      layout: {
        backgroundColor: currentTheme === "light" ? "#ffffff" : "#1e222d",
        textColor: currentTheme === "light" ? "#000000" : "#ffffff",
      },
      grid: {
        vertLines: { color: currentTheme === "light" ? "#e0e0e0" : "#2a2e39" },
        horzLines: { color: currentTheme === "light" ? "#e0e0e0" : "#2a2e39" },
      },
      // Bật tính năng kéo ngang
      handleScroll: {
        mouseWheel: true, // Cho phép cuộn bằng chuột
        pressedMouseMove: true, // Cho phép kéo bằng chuột trái
      },
      handleScale: {
        axisPressedMouseMove: true, // Cho phép thay đổi tỷ lệ trên trục
        mouseWheel: true, // Cho phép zoom bằng chuột
      },
      kineticScroll: {
        touch: true, // Hỗ trợ kéo bằng cảm ứng (nếu dùng trên mobile)
        mouse: true, // Hỗ trợ quán tính khi kéo bằng chuột
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

    // Điều chỉnh kích thước chart khi cửa sổ thay đổi
    const handleResize = () => {
      if (chartInstance && chartContainerRef.current) {
        chartInstance.resize(chartContainerRef.current.clientWidth, 450);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.remove();
    };
  }, []);

  // Đồng bộ theme real-time
  useEffect(() => {
    if (!chart) return;

    const updateChartTheme = () => {
      const currentTheme = getCurrentTheme();
      chart.applyOptions({
        layout: {
          backgroundColor: currentTheme === "light" ? "#ffffff" : "#1e222d",
          textColor: currentTheme === "light" ? "#000000" : "#ffffff",
        },
        grid: {
          vertLines: { color: currentTheme === "light" ? "#e0e0e0" : "#2a2e39" },
          horzLines: { color: currentTheme === "light" ? "#e0e0e0" : "#2a2e39" },
        },
      });
    };

    updateChartTheme();
    window.addEventListener("storage", updateChartTheme);
    const observer = new MutationObserver(() => {
      updateChartTheme();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("storage", updateChartTheme);
      observer.disconnect();
    };
  }, [chart]);

  // Load dữ liệu nến và volume
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

        // Tự động điều chỉnh phạm vi thời gian để hiển thị dữ liệu
        if (candles.length > 0) {
          chart?.timeScale().fitContent();
        }
      } catch (error) {
        console.error("Error fetching candlestick data:", error);
      }
    };

    fetchDataAndDraw();
  }, [interval, candlestickSeries, volumeSeries, chart]);

  // Xử lý thay đổi theme từ nút trong component
  const handleThemeChange = () => {
    const newTheme = getCurrentTheme() === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between p-2 gap-4 border border-gray-600 rounded items-center">
        <Button onClick={() => getPrices()}>Get Prices</Button>
        <p className="font-bold">Current Price: {currPrice} $</p>
        <p className="font-bold">Price 1m Ago: {price1mAgo} $</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xl font-bold">Time Frames:</p>
        {["1m", "5m", "30m", "1h", "4h", "1d", "3d", "1w"].map((t) => (
          <Button
            key={t}
            onClick={() => setInterval(t)}
            className={`hover:bg-blue-600 hover:text-white ${
              interval === t
                ? "bg-blue-600 text-white shadow-lg border scale-105"
                : ""
            }`}
          >
            {t}
          </Button>
        ))}
      </div>
      <div
        ref={chartContainerRef}
        className="w-full h-[600px] border border-gray-300 dark:border-gray-700 rounded"
      />
    </div>
  );
};

export default CandlestickVolumeChart;