import Terminal from "@/components/Terminal";
import StatusBar from "@/components/StatusBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen flex flex-col font-mono relative p-4 gap-4 overflow-hidden text-fg">
      {/* Wallpaper Background */}
      <div className="fixed inset-0 -z-10 bg-bg transition-colors duration-500">
        <Image
          src="/assets/arch_wallpaper.png"
          alt="Wallpaper"
          fill
          className="object-cover opacity-25 brightness-[0.4] grayscale-30 pointer-events-none"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/40" />
      </div>

      <Terminal />
      <StatusBar />
    </div>
  );
}
