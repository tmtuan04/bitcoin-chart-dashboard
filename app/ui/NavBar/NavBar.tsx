import { ModeToggle } from "@/components/ui/toggle-mode";
import { ChartArea, Settings } from "lucide-react";

export default function NavBar() {
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <ChartArea className="size-7 rounded-lg flex items-center justify-center" />
            <h1 className="text-xl font-bold">TnBinance</h1>
          </div>
          <div className="flex gap-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
