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
    title: "I explain as well as I build.",
    body: "Teaching developers every week has made me clear by habit: readable code, honest updates, and handovers your team can actually pick up.",
    icon: "chat",
  },
    {
    title: "No surprises.",
    body: "Clear updates while I build, honest estimates, and documented handovers, so you always know where things stand and your team can pick the work up after me.",
    icon: "chat",
  },
];