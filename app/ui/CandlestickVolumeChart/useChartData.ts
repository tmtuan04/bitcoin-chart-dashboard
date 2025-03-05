import { useEffect } from "react";
import { ISeriesApi, IChartApi, CandlestickData, HistogramData, UTCTimestamp } from "lightweight-charts";
import { fetchBitcoinCandles, fetchBitcoinVolume } from "@/app/lib/data";

interface UseChartDataProps {
  candlestickSeries: ISeriesApi<"Candlestick"> | null;
  volumeSeries: ISeriesApi<"Histogram"> | null;
  interval: string;
  chart: IChartApi | null;
}

export const useChartData = ({ candlestickSeries, volumeSeries, interval, chart }: UseChartDataProps) => {
  useEffect(() => {
    const fetchDataAndDraw = async () => {
      if (!candlestickSeries || !volumeSeries) return;
      try {
        const candles = await fetchBitcoinCandles(interval);
        const volumes = await fetchBitcoinVolume(interval);

        const formattedCandles: CandlestickData[] = candles.map((candle) => ({
          time: candle.time as UTCTimestamp, // Ép kiểu về UTCTimestamp
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));

        const formattedVolumes: HistogramData[] = volumes.map((volume) => ({
          time: volume.time as UTCTimestamp, // Ép kiểu về UTCTimestamp
          value: volume.value,
          color: volume.color,
        }));

        candlestickSeries.setData(formattedCandles);
        volumeSeries.setData(formattedVolumes);

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
