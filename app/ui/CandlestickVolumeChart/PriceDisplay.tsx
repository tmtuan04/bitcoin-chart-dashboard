import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchCurrentPrice, fetchPriceOneMinuteAgo } from "@/app/lib/data";

const PriceDisplay: React.FC = () => {
  const [currPrice, setCurrPrice] = useState<number | null>(null);
  const [price1mAgo, setPrice1mAgo] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string>("");

  const getPrices = async () => {
    try {
      const currPriceData = await fetchCurrentPrice();
      const price1mAgoData = await fetchPriceOneMinuteAgo();

      setCurrPrice(currPriceData ? currPriceData.price : null);
      setPrice1mAgo(price1mAgoData ? price1mAgoData.price : null);

      // Lấy thời gian hiện tại
      const now = new Date();
      const formattedTime = now.toLocaleTimeString();
      setTimestamp(formattedTime);
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-2 gap-2 border border-gray-600 rounded w-full md:w-auto">
      <Button onClick={getPrices} className="w-full sm:w-auto">
        Get Prices
      </Button>
      <p className="font-bold text-center">Current Price: {currPrice}$</p>
      <p className="font-bold text-center">Price 1m Ago: {price1mAgo}$</p>
      {timestamp && <p className="text-sm text-gray-400">(Last updated at: {timestamp})</p>}
    </div>
  );
};

export default PriceDisplay;
