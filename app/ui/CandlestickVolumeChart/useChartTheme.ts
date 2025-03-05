import { useEffect } from "react";
import { IChartApi } from "lightweight-charts";

const getCurrentTheme = (): "light" | "dark" => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

export const useChartTheme = (chart: IChartApi | null) => {
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
    const observer = new MutationObserver(() => updateChartTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("storage", updateChartTheme);
      observer.disconnect();
    };
  }, [chart]);
};