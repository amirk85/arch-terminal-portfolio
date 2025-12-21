import Terminal from "@/components/Terminal";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <div className="h-screen flex flex-col font-mono relative p-4 gap-4 overflow-hidden bg-bg text-fg">
      <Terminal />
      <StatusBar />
    </div>
  );
}
