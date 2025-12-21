"use client";

import Image from "next/image";
import Terminal from "@/components/Terminal";
import StatusBar from "@/components/StatusBar";
import { useTheme } from "@/components/ThemeProvider";
import { themes } from "@/config/themes";

export default function Home() {
  const { theme } = useTheme();

  const activeTheme = themes[theme] || themes.gruvbox;

  return (
    <div className="h-screen flex flex-col font-mono relative p-4 gap-4 overflow-hidden text-fg">
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <Image
          src="/arch_wallpaper.jpg"
          alt="Arch Linux Wallpaper"
          fill
          priority
          className="object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>
      <div
        className="fixed inset-0 -z-30 opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: activeTheme.bg }}
      />

      <Terminal />
      <StatusBar />
    </div>
  );
}
