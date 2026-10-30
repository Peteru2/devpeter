import { site } from "./site";

export interface Role {
  when: string; // "Now", or a date range like "Dec 2023 – May 2025"
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
      "Built an offline computer-based testing system used by 1,000+ students, running entirely on a local network",
      "Built the organisation’s website and content-management backend, including an investor and partner support form",
      `Teaches ${site.teaching.subjects.join(", ")} to ${site.teaching.students} students`,
    ],
  },
  {
    when: "Dec 2023 – May 2025",
    title: "Full-Stack Engineer (Remote)",
    org: "African Group",
    location: "Nigeria",
    points: [
      "Owned the frontend architecture on React and Next.js: component structure, state management and data flow",
      "Improved page performance by 40% through refactoring and targeted optimisation",
      "Integrated the frontend with Node.js and Express APIs, and contributed across the stack through to production deployment",
    ],
  },
  {
    when: "Aug 2023 - Oct 2023",
    title: "Full-Stack Developer (Remote)",
    org: "Lyncs Africa",
    location: "Nigeria",
    points: [
      "Built sales and analytics dashboards that visualise real-time sales-flow data for business users",
      "Reduced system errors by 30% by improving frontend–backend communication",
    ],
  },
  {
    when: "April 2023 – June 2023",
    title: "Intern Software Developer (Remote)",
    org: "Genelyst",
    location: "Nigeria",
    points: [
      "Built reusable React and TypeScript component libraries that made the product’s UI consistent",
      "Integrated the frontend with backend APIs and improved application performance by 30%",
    ],
  },
  {
    when: "Independent",
    title: "Software Engineer",
    org: "Freelance & client projects",
    points: ["Designed, built and shipped websites and web apps for clients, from business sites to admin platforms"],
  },
];