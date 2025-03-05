import { useEffect, useState } from "react";
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts";

const getCurrentTheme = (): "light" | "dark" => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

export const useChartInitializer = (chartContainerRef: React.RefObject<HTMLDivElement>) => {
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candlestickSeries, setCandlestickSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);
  const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const currentTheme = getCurrentTheme();
    const chartInstance = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 550,
      layout: {
        backgroundColor: currentTheme === "light" ? "#ffffff" : "#1e222d",
        textColor: currentTheme === "light" ? "#000000" : "#ffffff",
      },
      grid: {
        vertLines: { color: currentTheme === "light" ? "#e0e0e0" : "#2a2e39" },
        horzLines: { color: currentTheme === "light" ? "#e0e0e0" : "#2a2e39" },
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true },
      kineticScroll: { touch: true, mouse: true },
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
  }, [chartContainerRef]);

  return { chart, candlestickSeries, volumeSeries };
};