// import { Time } from "lightweight-charts";

export interface ICandleStickData {
  time: number; // Unix timestamp in milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface IVolumeData {
  time: number; // Unix timestamp in milliseconds
  value: number; // Volume
  color?: string;
}

export interface IBitcoinPrice {
  price: number;
  time: number;
}
