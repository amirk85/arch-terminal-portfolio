"use client";

import { useTheme } from "./theme-provider";
import { themes, ThemeName } from "@/config/themes";

export default function StatusBar() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themeNames = Object.keys(themes) as ThemeName[];
    const currentIndex = themeNames.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setTheme(themeNames[nextIndex]);
  };

  return (
    <footer className="w-full max-w-5xl mx-auto z-50 bg-dark-gray text-xs md:text-sm flex border border-bg-hard select-none shadow-lg rounded-lg overflow-hidden shrink-0">
      <div className="bg-green text-bg-hard font-bold px-3 py-2 hidden md:flex items-center">
        NORMAL
      </div>

      <div className="grow flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { label: "1:About", cmd: "about" },
          { label: "2:Experience", cmd: "experience" },
          { label: "3:Skills", cmd: "skills" },
          { label: "4:Projects", cmd: "projects" },
          { label: "5:Contact", cmd: "contact" },
          { label: "[ Files ]", cmd: "ls" },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("run-command", { detail: item.cmd }),
              );
            }}
            className="px-4 py-2 hover:bg-bg hover:text-bright-yellow transition-colors border-r border-bg-hard cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-blue text-bg-hard px-3 py-2 font-bold hidden md:flex items-center">
        utf-8
      </div>
      <button
        onClick={cycleTheme}
        title="Cycle Theme"
        className="bg-yellow text-bg-hard px-3 py-2 font-bold flex items-center uppercase cursor-pointer hover:bg-bright-yellow active:opacity-80 transition-all border-none outline-none"
      >
        {theme}
      </button>
    </footer>
  );
}
