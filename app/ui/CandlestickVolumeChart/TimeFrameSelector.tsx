import React from "react";
import { Button } from "@/components/ui/button";

interface TimeFrameSelectorProps {
  interval: string;
  setInterval: (interval: string) => void;
}

const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({ interval, setInterval }) => {
  const timeFrames = ["1m", "5m", "30m", "1h", "4h", "1d", "3d", "1w"];

  return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full md:w-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {timeFrames.map((t) => (
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
  );
};

export default TimeFrameSelector;