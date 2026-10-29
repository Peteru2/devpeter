export type PrincipleIcon = "shield" | "offline" | "code" | "chat";

export interface Principle {
  title: string;
  body: string;
  icon: PrincipleIcon;
}

export const principles: Principle[] = [
  {
    title: "Real money means zero guesswork.",
    body: "When software moves money or runs exams, “mostly works” isn’t good enough. I plan for failed payments, dropped requests and edge cases before launch, not after.",
    icon: "shield",
  },
  {
    title: "Built for real conditions.",
    body: "Slow networks, power cuts, low-end phones. I design for the environment people actually use software in, like an exam system that runs with no internet at all.",
    icon: "offline",
  },
  {
    title: "AI assists. I’m accountable.",
    body: "I use AI tools to move faster, but nothing ships until I’ve read it, tested it and understood it. If it’s in production, I can explain every line.",
    icon: "code",
  },
  {
    title: "Clear by habit.",
    body: "Teaching every week has made me explain as well as I build: readable code, honest estimates, regular updates and handovers your team can pick up without me.",
    icon: "chat",
  },
];
