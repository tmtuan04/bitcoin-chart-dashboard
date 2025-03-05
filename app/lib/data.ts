import axios from "axios";
import { ICandleStickData, IVolumeData } from "./definitions";
import { z } from "zod";

const candleSchema = z.object({
  time: z.number(),
  open: z.coerce.number(),
  high: z.coerce.number(),
  low: z.coerce.number(),
  close: z.coerce.number(),
});

export const fetchBitcoinCandles = async (
  interval: string,
  limit: number = 100
): Promise<ICandleStickData[]> => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=${limit}`
    );
    return response.data.map((candle: number[]) => {
      // Parse and validate data using Zod
      return candleSchema.parse({
        time: candle[0] / 1000,
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
      });
    });
  } catch (error) {
    console.error("Error fetching Bitcoin data:", error);
    return [];
  }
};

const volumeSchema = z.object({
  time: z.number(),
  value: z.coerce.number(),
  color: z.string(),
});

export const fetchBitcoinVolume = async (
  interval: string,
  limit: number = 100
): Promise<IVolumeData[]> => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}&limit=${limit}`
    );
    return response.data.map((volume: number[]) => {
      // Parse and validate data using Zod
      return volumeSchema.parse({
        time: volume[0] / 1000,
        value: volume[5],
        color: volume[4] > volume[1] ? "#26a69a" : "#ef5350",
      });
    });
  } catch (error) {
    console.error("Error fetching Bitcoin data:", error);
    return [];
  }
};

const priceSchema = z.object({
  price: z.coerce.number(),
});

export const fetchCurrentPrice = async () => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
    );
    return priceSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching Bitcoin current price", error);
    return null;
  }
};

export const fetchPriceOneMinuteAgo = async () => {
  try {
    const oneMinuteAgo = Math.floor((Date.now() - 60 * 1000) / 1000);
    const response = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${oneMinuteAgo * 1000}&limit=1`
    );
    
    const priceData = {
      price: response.data[0][4]
    }

    return priceSchema.parse(priceData);
  } catch (error) {
    console.error("Error fetching Bitcoin current price", error);
    return null;
  }
};

