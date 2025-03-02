import axios from "axios";
import { ICandleStickData } from "./definitions";

export const fetchBitcoinCandles = async (
  symbol: string = "BTCUSDT",
  interval: string = "1m",
  limit: number = 10
): Promise<ICandleStickData[]> => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    return response.data.map((candle: any[]) => ({
        time: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
    }))
  } catch (error) {
    console.log("Error fetching Bitcoin data:", error);
    return [];
  }
};
