"use client";

import React, { useState, useCallback } from "react";
import { portfolioData } from "@/config/portfolio";
import { themes, ThemeName } from "@/config/themes";

export type OutputLine = {
  type: "input" | "output" | "error" | "system";
  content: React.ReactNode;
  id: string;
};

export function useTerminal(setTheme: (theme: ThemeName) => void) {
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);

  const addLine = useCallback((line: Omit<OutputLine, "id">) => {
    setHistory((prev) => [
      ...prev,
      { ...line, id: Math.random().toString(36).substr(2, 9) },
    ]);
  }, []);

  const executeCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      // Add input to history
      addLine({ type: "input", content: trimmed });
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1).join(" ");

      const handleAbout = () =>
        addLine({
          type: "output",
          content: (
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
                <span className="text-bright-blue">
                  {portfolioData.about.title}
                </span>{" "}
                based in {portfolioData.about.location}.
              </p>
              <p className="mb-2">{portfolioData.about.description}</p>
            </div>
          ),
        });

      const handleExperience = () =>
        addLine({
          type: "output",
          content: (
            <div className="flex flex-col gap-4">
              {portfolioData.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between flex-wrap">
                    <h3 className="text-bright-green font-bold">
                      {exp.company}
                    </h3>
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
          ),
        });

      const handleSkills = () =>
        addLine({
          type: "output",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(portfolioData.skills).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-orange font-bold mb-1 capitalize">
                    {category}
                  </h3>
                  <p className="text-gray">{items.join(", ")}</p>
                </div>
              ))}
            </div>
          ),
        });

      const handleProjects = () =>
        addLine({
          type: "output",
          content: (
            <div className="flex flex-col gap-4">
              {portfolioData.projects.map((project, i) => (
                <div key={i}>
                  <p className="text-bright-blue font-bold hover:underline cursor-pointer">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {">"} {project.name}
                    </a>
                  </p>
                  <p className="text-gray text-sm">{project.description}</p>
                </div>
              ))}
            </div>
          ),
        });

      const handleEducation = () =>
        addLine({
          type: "output",
          content: (
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
          ),
        });

      const handleContact = () =>
        addLine({
          type: "output",
          content: (
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
                Phone:{" "}
                <span className="text-fg">{portfolioData.contact.phone}</span>
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
                <span className="text-fg">
                  {portfolioData.contact.location}
                </span>
              </p>
            </div>
          ),
        });

      switch (cmd) {
        case "help":
          addLine({
            type: "output",
            content: (
              <div className="grid grid-cols-12 gap-2">
                {[
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
                    desc: "Change theme [gruvbox, nord, solarized, matrix]",
                  },
                  { name: "clear", desc: "Clear terminal" },
                ].map((c) => (
                  <React.Fragment key={c.name}>
                    <div className="col-span-4 md:col-span-2 text-bright-yellow font-bold">
                      {c.name}
                    </div>
                    <div className="col-span-8 md:col-span-10 text-gray">
                      {c.desc}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ),
          });
          break;

        case "clear":
          setHistory([]);
          break;

        case "about":
          handleAbout();
          break;

        case "experience":
          handleExperience();
          break;

        case "skills":
          handleSkills();
          break;

        case "projects":
          handleProjects();
          break;

        case "education":
          handleEducation();
          break;

        case "contact":
          handleContact();
          break;

        case "ls":
          addLine({
            type: "output",
            content: (
              <div className="flex gap-4 flex-wrap">
                {[
                  "about.txt",
                  "experience.md",
                  "skills.md",
                  "projects.json",
                  "education.txt",
                  "contact.info",
                ].map((f) => (
                  <span
                    key={f}
                    className="text-fg font-bold cursor-pointer hover:text-bright-blue hover:underline"
                  >
                    {f}
                  </span>
                ))}
              </div>
            ),
          });
          break;

        case "cat":
          if (!args) {
            addLine({ type: "error", content: "Usage: cat [filename]" });
          } else {
            const filename = args.trim().toLowerCase();
            if (filename === "about.txt") handleAbout();
            else if (filename === "experience.md") handleExperience();
            else if (filename === "skills.md") handleSkills();
            else if (filename === "projects.json") handleProjects();
            else if (filename === "education.txt") handleEducation();
            else if (filename === "contact.info") handleContact();
            else
              addLine({
                type: "error",
                content: `cat: ${filename}: No such file or directory`,
              });
          }
          break;

        case "neofetch":
          addLine({
            type: "output",
            content: (
              <div className="flex flex-col md:flex-row gap-6 mt-2 mb-4">
                <div className="text-bright-blue font-bold whitespace-pre hidden md:block select-none leading-tight">
                  {`       /\\
      /  \\
     /    \\
    /      \\
   /   ,,   \\
  /   |  |   \\
 /_-''    ''-_\\`}
                </div>
                <div className="flex flex-col justify-center text-sm md:text-base">
                  <div>
                    <span className="text-bright-green font-bold">{portfolioData.about.user}</span>@
                    <span className="text-bright-blue font-bold">
                      {portfolioData.about.machine}
                    </span>
                  </div>
                  <div className="text-gray mb-2">----------------------</div>
                  <div>
                    <span className="text-bright-yellow font-bold">OS</span>:
                    Arch Linux x86_64
                  </div>
                  <div>
                    <span className="text-bright-yellow font-bold">Host</span>:
                    Software Engineer
                  </div>
                  <div>
                    <span className="text-bright-yellow font-bold">Uptime</span>
                    : Since 1998
                  </div>
                  <div>
                    <span className="text-bright-yellow font-bold">
                      Packages
                    </span>
                    : Next.js, Python, Docker
                  </div>
                  <div>
                    <span className="text-bright-yellow font-bold">Shell</span>:
                    zsh 5.9
                  </div>
                  <div>
                    <span className="text-bright-yellow font-bold">
                      Location
                    </span>
                    : {portfolioData.about.location}
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
            ),
          });
          break;

        case "theme":
          if (args.length === 0) {
            addLine({
              type: "output",
              content: `Available themes: ${Object.keys(themes).join(", ")}`,
            });
          } else {
            const themeName = parts[1] as ThemeName;
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
          }
          break;

        case "whoami":
          addLine({ type: "output", content: portfolioData.about.user });
          break;

        case "date":
          addLine({ type: "output", content: new Date().toString() });
          break;

        default:
          addLine({ type: "error", content: `zsh: command not found: ${cmd}` });
      }
    },
    [addLine, setTheme],
  );

  const boot = useCallback(async () => {
    setIsBooting(true);
    const bootSequence = [
      { text: "Loading Arch Linux...", delay: 100 },
      { text: "[OK] Started Kernel.", delay: 300 },
      { text: "[OK] Mounted /dev/sda2 (Projects).", delay: 500 },
      { text: "Welcome to Amir's Portfolio!", delay: 800 },
    ];

    for (const step of bootSequence) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      addLine({ type: "system", content: step.text });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setHistory([]);
    executeCommand("neofetch");
    addLine({
      type: "system",
      content: (
        <div className="mt-2 text-gray">
          Type <span className="text-bright-green font-bold">'help'</span> OR
          use the{" "}
          <span className="text-bright-yellow font-bold">buttons below</span> to
          navigate.
        </div>
      ),
    });
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
