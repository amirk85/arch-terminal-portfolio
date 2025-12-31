"use client";

import React, { useState, useCallback } from "react";
import { portfolioData } from "@/config/portfolio";
import { themes, ThemeName } from "@/config/themes";

/**
 * Represents a single line of terminal output.
 */
export type OutputLine = {
  type: "input" | "output" | "error" | "system";
  content: React.ReactNode;
  id: string;
};

/**
 * Configuration for boot sequence steps.
 */
interface BootStep {
  text: string;
  delay: number;
}

/**
 * Command definition for help display.
 */
interface CommandInfo {
  name: string;
  desc: string;
}

/**
 * Available file names in the virtual filesystem.
 */
const FILE_SYSTEM = [
  "about.txt",
  "experience.md",
  "skills.md",
  "projects.json",
  "education.txt",
  "contact.info",
] as const;

/**
 * Available commands for help display.
 */
const COMMANDS: readonly CommandInfo[] = [
  { name: "help", desc: "List all commands" },
  { name: "about", desc: "About me" },
  { name: "experience", desc: "Work experience" },
  { name: "skills", desc: "Technical skills" },
  { name: "projects", desc: "My projects" },
  { name: "education", desc: "Educational background" },
  { name: "contact", desc: "Get in touch" },
  { name: "ls", desc: "List files" },
  { name: "cat", desc: "Read a file" },
  { name: "neofetch", desc: "System info" },
  {
    name: "theme",
    desc: "Change theme [gruvbox, nord, solarized, matrix, catppuccin]",
  },
  { name: "clear", desc: "Clear terminal" },
] as const;

/**
 * Boot sequence configuration.
 */
const BOOT_SEQUENCE: readonly BootStep[] = [
  { text: "Loading Arch Linux...", delay: 100 },
  { text: "[OK] Started Kernel.", delay: 300 },
  { text: "[OK] Mounted /dev/sda2 (Projects).", delay: 500 },
  { text: "Welcome to Amir's Portfolio!", delay: 800 },
] as const;

/**
 * Arch Linux ASCII art for neofetch command.
 */
const ARCH_ASCII = `       /\\
      /  \\
     /    \\
    /      \\
   /   ,,   \\
  /   |  |   \\
 /_-''    ''-_\\`;

/**
 * Renders the about section content.
 */
function renderAbout(): React.ReactNode {
  return (
    <div className="pl-4 border-l-2 border-gray">
      <p className="mb-2">
        Hello! I'm{" "}
        <span className="text-bright-yellow font-bold">
          {portfolioData.about.name}
        </span>
        .
      </p>
      <p className="mb-2">
        I am a{" "}
        <span className="text-bright-blue">{portfolioData.about.title}</span>{" "}
        based in {portfolioData.about.location}.
      </p>
      <p className="mb-2">{portfolioData.about.description}</p>
    </div>
  );
}

/**
 * Renders the experience section content.
 */
function renderExperience(): React.ReactNode {
  return (
    <div className="flex flex-col gap-4">
      {portfolioData.experience.map((exp, i) => (
        <div key={i}>
          <div className="flex justify-between flex-wrap">
            <h3 className="text-bright-green font-bold">{exp.company}</h3>
            <span className="text-gray italic">{exp.period}</span>
          </div>
          <p className="text-bright-blue text-sm mb-1">{exp.role}</p>
          <ul className="list-disc ml-5 text-sm text-gray">
            {exp.details.map((detail, j) => (
              <li key={j}>{detail}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders the skills section content.
 */
function renderSkills(): React.ReactNode {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(portfolioData.skills).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-orange font-bold mb-1 capitalize">{category}</h3>
          <p className="text-gray">{items.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders the projects section content.
 */
function renderProjects(): React.ReactNode {
  return (
    <div className="flex flex-col gap-4">
      {portfolioData.projects.map((project, i) => (
        <div key={i}>
          <p className="text-bright-blue font-bold hover:underline cursor-pointer">
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              {">"} {project.name}
            </a>
          </p>
          <p className="text-gray text-sm">{project.description}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders the education section content.
 */
function renderEducation(): React.ReactNode {
  return (
    <div className="flex flex-col gap-2">
      {portfolioData.education.map((edu, i) => (
        <div key={i}>
          <span className="text-bright-yellow">{edu.institution}</span>{" "}
          <span className="text-gray">({edu.period})</span>
          <br />
          {edu.degree}
        </div>
      ))}
    </div>
  );
}

/**
 * Renders the contact section content.
 */
function renderContact(): React.ReactNode {
  return (
    <div className="flex flex-col gap-1">
      <p>
        Email:{" "}
        <a
          href={`mailto:${portfolioData.contact.email}`}
          className="text-bright-blue hover:underline"
        >
          {portfolioData.contact.email}
        </a>
      </p>
      <p>
        Phone: <span className="text-fg">{portfolioData.contact.phone}</span>
      </p>
      <p>
        GitHub:{" "}
        <a
          href={portfolioData.contact.githubUrl}
          target="_blank"
          className="text-bright-blue hover:underline"
        >
          {portfolioData.contact.github}
        </a>
      </p>
      <p>
        Location:{" "}
        <span className="text-fg">{portfolioData.contact.location}</span>
      </p>
    </div>
  );
}

/**
 * Renders the help command output.
 */
function renderHelp(): React.ReactNode {
  return (
    <div className="grid grid-cols-12 gap-2">
      {COMMANDS.map((c) => (
        <React.Fragment key={c.name}>
          <div className="col-span-4 md:col-span-2 text-bright-yellow font-bold">
            {c.name}
          </div>
          <div className="col-span-8 md:col-span-10 text-gray">{c.desc}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Renders the ls command output.
 */
function renderFileList(): React.ReactNode {
  return (
    <div className="flex gap-4 flex-wrap">
      {FILE_SYSTEM.map((f) => (
        <span
          key={f}
          className="text-fg font-bold cursor-pointer hover:text-bright-blue hover:underline"
        >
          {f}
        </span>
      ))}
    </div>
  );
}

/**
 * Renders the neofetch command output.
 */
function renderNeofetch(): React.ReactNode {
  return (
    <div className="flex flex-col md:flex-row gap-6 mt-2 mb-4">
      <div className="text-bright-blue font-bold whitespace-pre hidden md:block select-none leading-tight">
        {ARCH_ASCII}
      </div>
      <div className="flex flex-col justify-center text-sm md:text-base">
        <div>
          <span className="text-bright-green font-bold">
            {portfolioData.about.user}
          </span>
          @
          <span className="text-bright-blue font-bold">
            {portfolioData.about.machine}
          </span>
        </div>
        <div className="text-gray mb-2">----------------------</div>
        <div>
          <span className="text-bright-yellow font-bold">OS</span>: Arch Linux
          x86_64
        </div>
        <div>
          <span className="text-bright-yellow font-bold">Host</span>: Software
          Engineer
        </div>
        <div>
          <span className="text-bright-yellow font-bold">Uptime</span>: Since
          1998
        </div>
        <div>
          <span className="text-bright-yellow font-bold">Packages</span>:
          Next.js, Python, Docker
        </div>
        <div>
          <span className="text-bright-yellow font-bold">Shell</span>: zsh 5.9
        </div>
        <div>
          <span className="text-bright-yellow font-bold">Location</span>:{" "}
          {portfolioData.about.location}
        </div>
        <div className="flex gap-2 mt-2">
          <span className="w-3 h-3 bg-red rounded-full"></span>
          <span className="w-3 h-3 bg-green rounded-full"></span>
          <span className="w-3 h-3 bg-yellow rounded-full"></span>
          <span className="w-3 h-3 bg-blue rounded-full"></span>
          <span className="w-3 h-3 bg-purple rounded-full"></span>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the welcome message after boot.
 */
function renderWelcome(): React.ReactNode {
  return (
    <div className="mt-2 text-gray">
      Type <span className="text-bright-green font-bold">'help'</span> OR use
      the <span className="text-bright-yellow font-bold">buttons below</span> to
      navigate.
    </div>
  );
}

/**
 * Custom hook for managing terminal state and commands.
 *
 * @param {Function} setTheme - Function to update the theme
 * @returns {Object} Terminal state and control functions
 */
export function useTerminal(setTheme: (theme: ThemeName) => void) {
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isBooting, setIsBooting] = useState<boolean>(true);

  /**
   * Adds a new line to the terminal output.
   */
  const addLine = useCallback((line: Omit<OutputLine, "id">): void => {
    setHistory((prev) => [
      ...prev,
      { ...line, id: Math.random().toString(36).substr(2, 9) },
    ]);
  }, []);

  /**
   * Handles the cat command for reading files.
   */
  const handleCatCommand = useCallback(
    (args: string): void => {
      if (!args) {
        addLine({ type: "error", content: "Usage: cat [filename]" });
        return;
      }

      const filename = args.trim().toLowerCase();
      const fileHandlers: Record<string, () => void> = {
        "about.txt": () => addLine({ type: "output", content: renderAbout() }),
        "experience.md": () =>
          addLine({ type: "output", content: renderExperience() }),
        "skills.md": () => addLine({ type: "output", content: renderSkills() }),
        "projects.json": () =>
          addLine({ type: "output", content: renderProjects() }),
        "education.txt": () =>
          addLine({ type: "output", content: renderEducation() }),
        "contact.info": () =>
          addLine({ type: "output", content: renderContact() }),
      };

      const handler = fileHandlers[filename];
      if (handler) {
        handler();
      } else {
        addLine({
          type: "error",
          content: `cat: ${filename}: No such file or directory`,
        });
      }
    },
    [addLine],
  );

  /**
   * Handles the theme command for changing terminal themes.
   */
  const handleThemeCommand = useCallback(
    (args: string): void => {
      if (args.length === 0) {
        addLine({
          type: "output",
          content: `Available themes: ${Object.keys(themes).join(", ")}`,
        });
        return;
      }

      const themeName = args.trim() as ThemeName;
      if (themes[themeName]) {
        setTheme(themeName);
        addLine({
          type: "system",
          content: `Theme changed to ${themeName}`,
        });
      } else {
        addLine({
          type: "error",
          content: `Theme '${themeName}' not found`,
        });
      }
    },
    [addLine, setTheme],
  );

  /**
   * Executes a terminal command.
   */
  const executeCommand = useCallback(
    (input: string): void => {
      const trimmed = input.trim();
      if (!trimmed) return;

      // Add input to history
      addLine({ type: "input", content: trimmed });
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1).join(" ");

      // Command routing
      switch (cmd) {
        case "help":
          addLine({ type: "output", content: renderHelp() });
          break;

        case "clear":
          setHistory([]);
          break;

        case "about":
          addLine({ type: "output", content: renderAbout() });
          break;

        case "experience":
          addLine({ type: "output", content: renderExperience() });
          break;

        case "skills":
          addLine({ type: "output", content: renderSkills() });
          break;

        case "projects":
          addLine({ type: "output", content: renderProjects() });
          break;

        case "education":
          addLine({ type: "output", content: renderEducation() });
          break;

        case "contact":
          addLine({ type: "output", content: renderContact() });
          break;

        case "ls":
          addLine({ type: "output", content: renderFileList() });
          break;

        case "cat":
          handleCatCommand(args);
          break;

        case "neofetch":
          addLine({ type: "output", content: renderNeofetch() });
          break;

        case "theme":
          handleThemeCommand(args);
          break;

        case "whoami":
          addLine({ type: "output", content: portfolioData.about.user });
          break;

        case "date":
          addLine({ type: "output", content: new Date().toString() });
          break;

        default:
          addLine({
            type: "error",
            content: `zsh: command not found: ${cmd}`,
          });
      }
    },
    [addLine, handleCatCommand, handleThemeCommand],
  );

  /**
   * Executes the boot sequence animation.
   */
  const boot = useCallback(async (): Promise<void> => {
    setIsBooting(true);

    for (const step of BOOT_SEQUENCE) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      addLine({ type: "system", content: step.text });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setHistory([]);
    executeCommand("neofetch");
    addLine({ type: "system", content: renderWelcome() });
    setIsBooting(false);
  }, [addLine, executeCommand]);

  return {
    history,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    isBooting,
    executeCommand,
    boot,
  };
}
