"use client";

import { useTheme } from "./ThemeProvider";

export default function StatusBar() {
  const { theme } = useTheme();

  return (
    <footer className="w-full max-w-4xl mx-auto z-50 bg-dark-gray text-xs md:text-sm flex border border-bg-hard select-none shadow-lg rounded-lg overflow-hidden shrink-0">
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
              // We need a way to trigger command from here.
              // Perhaps a custom event or passing a ref?
              // For now, I'll use a custom event.
              window.dispatchEvent(
                new CustomEvent("run-command", { detail: item.cmd }),
              );
            }}
            className="px-4 py-2 hover:bg-bg hover:text-bright-yellow transition-colors border-r border-bg-hard"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-blue text-bg-hard px-3 py-2 font-bold hidden md:flex items-center">
        utf-8
      </div>
      <div className="bg-yellow text-bg-hard px-3 py-2 font-bold flex items-center uppercase">
        {theme}
      </div>
    </footer>
  );
}
