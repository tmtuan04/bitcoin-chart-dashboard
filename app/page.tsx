import NavBar from "./ui/NavBar/NavBar";
import CandlestickChart from "./ui/Chart/CandlestickChart";

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
