export interface SkillGroup {
  title: string;
  items: string[];
  proof?: string;
}

export const softSkills: SkillGroup[] = [
  {
    title: "Teaching & Mentorship",
    items: [
      "Teaching HTML, CSS, JavaScript, React, AI and digital literacy to 10+ students",
      "Breaking complex topics into simple, practical steps",
      "Reviewing students’ code and giving clear feedback",
    ],
    proof: "Educator at JAARC, alongside engineering.",
  },
  {
    title: "Communication",
    items: [
      "Explaining technical choices to non-technical clients",
      "Writing handovers and guides non-developers can actually use",
      "Honest progress updates and estimates",
    ],
    proof: "True Worshippers Church’s team runs its own platform without a developer.",
  },
  {
    title: "Collaboration",
    items: [
      "Turning designers’ work into faithful, working products",
      "Building alongside other developers on client projects",
      "Working with clients and stakeholders from brief to launch",
    ],
    proof: "Client projects delivered with designers and other developers.",
  },
  {
    title: "Ownership & Delivery",
    items: [
      "End-to-end ownership: product, design, engineering and launch",
      "Supporting software after launch, not just shipping it",
      "Balancing speed with reliability",
    ],
    proof: "Built Buydair solo, with admin recovery tools and a deliberate ₦2,000 risk cap.",
  },
  {
    title: "Problem Solving & Product Thinking",
    items: [
      "Designing for failure: double taps, timeouts, power cuts",
      "Debugging under real load, and closing gaps between design and code",
      "Building for the user’s real context, and pivoting on feedback",
    ],
    proof: "Buydair’s idempotent payments; the CBT “cannot load exam” fix; the Bankoo → Buydair pivot.",
  },
  {
    title: "Ways of Working",
    items: [
      "Continuous learning: currently Python, and going deeper into AI",
      "Using AI tools responsibly: reviewed, tested and understood before shipping",
      "Adapting calmly when requirements change",
    ],
  },
];