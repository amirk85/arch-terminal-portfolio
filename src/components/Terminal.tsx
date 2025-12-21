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
  }, [history, isBooting]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
      setInputVal("");
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
      className="max-w-4xl w-full mx-auto grow flex flex-col relative z-20 p-4 md:p-8 overflow-y-auto scrollbar-hide rounded-xl border border-bg-hard/50 shadow-2xl bg-bg/50 backdrop-blur-sm"
      onClick={focusInput}
      ref={scrollRef}
    >
      <div id="output" className="flex flex-col gap-2 mb-2">
        {history.map((line) => (
          <TerminalLine key={line.id} line={line} />
        ))}
      </div>

      {!isBooting && (
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
      )}
    </main>
  );
}
