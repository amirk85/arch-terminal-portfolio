"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import { useTerminal, OutputLine } from "@/hooks/useTerminal";
import { useTheme } from "@/components/ThemeProvider";
import Prompt from "./Prompt";

const TerminalLine = memo(({ line }: { line: OutputLine }) => {
  return (
    <div className="mb-1">
      {line.type === "input" ? (
        <div className="flex items-center">
          <Prompt />
          <span className="text-fg break-all">
            {typeof line.content === "string" ? line.content : ""}
          </span>
        </div>
      ) : line.type === "error" ? (
        <div className="text-red">{line.content}</div>
      ) : line.type === "system" ? (
        <div className="text-gray">{line.content}</div>
      ) : (
        <div className="mb-4">{line.content}</div>
      )}
    </div>
  );
});

TerminalLine.displayName = "TerminalLine";

export default function Terminal() {
  const { setTheme } = useTheme();
  const {
    history,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    executeCommand,
    boot,
    isBooting,
  } = useTerminal(setTheme);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputLineRef = useRef<HTMLDivElement>(null);

  const hasBooted = useRef(false);

  const COMMANDS = [
    "help",
    "about",
    "experience",
    "skills",
    "projects",
    "education",
    "contact",
    "ls",
    "cat",
    "neofetch",
    "theme",
    "clear",
    "whoami",
    "date",
  ];

  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (inputVal.trim() && !inputVal.includes(" ")) {
      const matches = COMMANDS.filter((cmd) =>
        cmd.startsWith(inputVal.toLowerCase()),
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [inputVal]);

  useEffect(() => {
    if (!hasBooted.current) {
      boot();
      hasBooted.current = true;
    }
  }, [boot]);

  useEffect(() => {
    const handleRunCommand = (e: any) => {
      executeCommand(e.detail);
    };

    window.addEventListener("run-command", handleRunCommand);
    return () => window.removeEventListener("run-command", handleRunCommand);
  }, [executeCommand]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        !isBooting &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isBooting]);

  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [history, isBooting, suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
      setInputVal("");
      setSuggestions([]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInputVal(suggestions[0]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputVal(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInputVal(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setInputVal("");
        }
      }
    }
  };

  const focusInput = () => {
    if (window.getSelection()?.toString().length === 0) {
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <main
      className="max-w-5xl w-full mx-auto grow flex flex-col relative z-20 p-4 md:p-8 overflow-y-auto scrollbar-hide rounded-xl border border-bg-hard/50 shadow-2xl bg-bg/50 backdrop-blur-sm"
      onClick={focusInput}
      ref={scrollRef}
    >
      <div id="output" className="flex flex-col gap-2 mb-2">
        {history.map((line) => (
          <TerminalLine key={line.id} line={line} />
        ))}
      </div>

      {!isBooting && (
        <div className="relative">
          {suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 mb-2 flex gap-2 flex-wrap bg-bg-hard/80 backdrop-blur-md p-2 rounded-lg border border-bg-hard z-30 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              {suggestions.map((s) => (
                <span
                  key={s}
                  onClick={() => {
                    setInputVal(s);
                    inputRef.current?.focus();
                  }}
                  className="px-2 py-0.5 rounded bg-dark-gray/50 text-bright-yellow text-xs cursor-pointer hover:bg-dark-gray transition-colors border border-transparent hover:border-gray/30"
                >
                  {s}
                </span>
              ))}
              <span className="text-[10px] text-gray self-center ml-1 italic opacity-60">
                [Tab to complete]
              </span>
            </div>
          )}
          <div
            className="flex items-center flex-wrap"
            id="input-line"
            ref={inputLineRef}
          >
            <Prompt />
            <div className="grow flex items-center relative">
              <span className="text-fg break-all min-h-[1.2em]">{inputVal}</span>
              <span className="cursor"></span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 opacity-0 pointer-events-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
