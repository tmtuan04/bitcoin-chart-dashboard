import { useEffect } from "react";
import { ISeriesApi } from "lightweight-charts";
import { fetchBitcoinCandles, fetchBitcoinVolume } from "@/app/lib/data";

interface UseChartDataProps {
  candlestickSeries: ISeriesApi<"Candlestick"> | null;
  volumeSeries: ISeriesApi<"Histogram"> | null;
  interval: string;
  chart: any; // Thay bằng type cụ thể nếu cần
}

export const useChartData = ({ candlestickSeries, volumeSeries, interval, chart }: UseChartDataProps) => {
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

        if (candles.length > 0) {
          chart?.timeScale().fitContent();
        }
      } catch (error) {
        console.error("Error fetching candlestick data:", error);
      }
    };

    fetchDataAndDraw();
  }, [interval, candlestickSeries, volumeSeries, chart]);
};