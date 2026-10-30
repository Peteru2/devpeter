export type ArchitectureKey = "buydair" | "cbt";
export type ProjectTier = "flagship" | "list" | "archive";

export interface Project {
  slug: string;
  name: string;
  tagline?: string;
  oneLiner: string; // shown on the collapsed row
  category: string;
  summary: string;
  facts: { label: string; value: string }[];
  stat?: { value: string; label: string };
  role: string;
  stack: string[];
  fullStack?: string[];
  tier: ProjectTier;
  architecture?: ArchitectureKey;
  images?: {
    screens?: string[]; // phone screenshots (flagship)
    cover?: string; // 1440 × 900 browser screenshot (rows)
  };
  links: {
    live?: string;
    github?: { label: string; url: string }[];
  };
  hasCaseStudy: boolean;
  status?: string
}

export const projects: Project[] = [
  {
    slug: "buydair",
    name: "Buydair",
    tagline: "Pay smarter, stay safer.",
    oneLiner: "Payments wallet with scam-awareness courses",
    category: "Fintech · Web app",
    summary:
      "A payments-first wallet for airtime, data, electricity and TV in Nigeria, with free lessons that teach people to spot scams.",
    facts: [
      { label: "Payments", value: "Paystack funding, verified by webhooks" },
      { label: "Reliability", value: "Stuck purchases re-checked, failures refunded" },
      { label: "Learning", value: "Scam-awareness courses with verifiable certificates" },
    ],
    role: "Solo: product, design and engineering",
    stack: ["React", "Node.js", "Express", "MongoDB", "Paystack"],
    fullStack: [
      "React", "Typescript", "Vite", "Tailwind CSS", "TanStack Query",
      "Node.js", "Express", "MongoDB (Mongoose)", "Zod",
      "Paystack", "Socket.IO", "Netlify",
    ],
    tier: "flagship",
    architecture: "buydair",
    images: { screens: ["/images/projects/buydair-home.png", "/images/projects/buydair-learn.png"] },
    links: { live: "" },
    hasCaseStudy: true,
    status: "Pre-launch · awaiting Paystack verification"

  },
  {
    slug: "offline-cbt",
    name: "Offline CBT System",
    oneLiner: "Exam system that runs without the internet",
    category: "EdTech · System",
    summary:
      "A computer-based testing system that runs entirely over a local network, so exams go ahead without the internet, and students can pull their report sheets afterwards.",
      facts: [
      { label: "Built for", value: "JAARC, Ogbomoso" },
      { label: "Offline", value: "One server, many machines, no internet" },
      { label: "Results", value: "Students access their own report sheets" },
    ],
    stat: { value: "1,000+", label: "students" },
    role: "Full-stack engineer",
    stack: ["React", "Typescript", "Node.js", "PostgreSQL", "Framer Motion"],
    tier: "list",
    architecture: "cbt",
    links: {},
    hasCaseStudy: true,
  },
    {
    slug: "true-worshippers-church",
    name: "True Worshippers Church",
    oneLiner: "Church website with sermons, events and an admin platform",
    category: "Community · Platform",
    summary:
      "A website and admin dashboard the church runs itself. Members play or download sermons right on the site and see upcoming events, while the team publishes everything from an admin panel, alongside prayer requests, first-time visitors and a newsletter.",
    facts: [
      { label: "Sermons", value: "Uploaded by the team; members play them in the browser or download them" },
      { label: "Events", value: "Published and updated live from the admin panel" },
      { label: "Admin", value: "Role-based dashboard (admin / superadmin)" },
      { label: "Media", value: "Sermon and image uploads through Cloudinary" },
    ],
    role: "Solo full-stack engineer",
    stack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Cloudinary"],
    fullStack: [
      "React", "TypeScript", "Tailwind CSS", "React Router", "React Hook Form", "Axios",
      "Node.js", "Express", "MongoDB", "JWT", "bcrypt", "Cloudinary",
    ],
    tier: "list",
    images: { cover: "/images/projects/twc.png" },
    links: { live: "https://twcglobal.org" },
    hasCaseStudy: true,
  },
    {
    slug: "bfe",
    name: "Becca’s Food & Events",
    oneLiner: "Online ordering with live tracking and an admin panel for a catering business",
    category: "Food & events · Web app",
    summary:
      "An ordering platform for a catering business. Customers order for delivery or pickup, pay with Paystack and follow their order live, while the team runs the menu, orders and delivery from a role-based admin panel.",
    facts: [
      {  label: "Payments", value: "Paystack checkout (test mode), confirmed by a verify page and a webhook"  },
      { label: "Tracking", value: "Private tracking link with a live status timeline" },
      { label: "Admin", value: "Owner, manager and staff roles, with new-order alerts" },
      { label: "Sign-in", value: "Optional passwordless login by emailed code; guest checkout works" },
    ],
        role: "Solo full-stack engineer",
    stack: ["Next.js","Typescript", "MongoDB", "Paystack", "Resend", "Cloudinary"],
    fullStack: ["Next.js", "MongoDB (Mongoose)", "Paystack", "JWT", "bcrypt", "Resend", "Cloudinary", "Vercel"],
    tier: "list",
    images: { cover: "/images/projects/bfe.png" },
    links: { live: "https://bfe-three.vercel.app" },
    hasCaseStudy: true,
    status: "In testing · Paystack in test mode",
  },
    {
    slug: "jaarc",
    name: "JAARC Website",
    oneLiner: "Organisation website with an investor and partner support form",
    category: "Organisation · Website",
    summary:
      "The website for JAARC in Ogbomoso, including a support form that lets investors and partners reach out directly.",
    facts: [],
    role: "Full-stack engineer",
    stack: ["React", "Typescript", "Vite", "Node.js", "Motion", "PostgreSQL"],
    tier: "list",
    images: { cover: "/images/projects/jaarc.png" },
    links: { live: "http://jaarc.org" },
    hasCaseStudy: false,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);