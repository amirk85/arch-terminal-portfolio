import { portfolioData } from "@/config/portfolio";

export default function Prompt() {
  return (
    <div className="mr-3 whitespace-nowrap">
      <span className="text-bright-green font-bold">
        {portfolioData.about.user}
      </span>
      <span className="text-fg">@</span>
      <span className="text-bright-blue font-bold">
        {portfolioData.about.machine}
      </span>
      <span className="text-fg">:</span>
      <span className="text-bright-aqua font-bold">~</span>
      <span className="text-fg">$</span>
    </div>
  );
}
