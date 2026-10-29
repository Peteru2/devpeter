import { site } from "./site";

export interface Role {
  when: "Now" | "Before";
  title: string;
  org: string;
  location?: string;
  points: string[];
}

export const experience: Role[] = [
  {
    when: "Now",
    title: site.currentRole.title,
    org: site.currentRole.org,
    location: site.currentRole.location,
    points: [
      "Built an offline computer-based testing system used by 1,000+ students",
      "Built the organisation’s website, including an investor and partner support form",
      `Teaches ${site.teaching.subjects.join(", ")} to ${site.teaching.students} students`,
    ],
  },
  {
    when: "Before",
    title: "Software Engineer",
    org: "Freelance & client projects",
    points: ["Designed, built and shipped websites and web apps for clients, from business sites to admin platforms"],
  },
];