import NavBar from "./ui/NavBar/NavBar";
import CandlestickChart from "./ui/Chart/CandlestickChart";
// import { fetchPriceOneMinuteAgo } from "./lib/data";

export default async function Page() {

  return (
    <>
      <NavBar />
      <div className="mt-20">
        <CandlestickChart />
      </div>
    </>
  );
}
