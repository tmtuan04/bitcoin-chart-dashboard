"use client";

import React, { useRef } from "react";
import { useChartInitializer } from "./ChartInitializer";
import { useChartData } from "./useChartData";
import { useChartTheme } from "./useChartTheme";
import TimeFrameSelector from "./TimeFrameSelector";
import PriceDisplay from "./PriceDisplay";

const CandlestickVolumeChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null!);
  const { chart, candlestickSeries, volumeSeries } =
    useChartInitializer(chartContainerRef);
  const [interval, setInterval] = React.useState("1h");

  useChartData({ candlestickSeries, volumeSeries, interval, chart });
  useChartTheme(chart);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        <PriceDisplay />
        <TimeFrameSelector interval={interval} setInterval={setInterval} />
      </div>

      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};

export default CandlestickVolumeChart;

/*
return (
  <div className="flex flex-col items-center gap-4 p-4">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between p-2 gap-2 border border-gray-600 rounded w-full md:w-auto">
        <Button onClick={() => getPrices()} className="w-full sm:w-auto">
          Get Prices
        </Button>
        <p className="font-bold text-center sm:text-left">Current Price: {currPrice}$</p>
        <p className="font-bold text-center sm:text-left">Price 1m Ago: {price1mAgo}$</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full md:w-auto">
        <div className="flex flex-wrap justify-center gap-2">
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
      </div>
    </div>
    <div
      ref={chartContainerRef}
      className="w-full"
    />
  </div>
);
*/
