export interface StackGroup {
  label: string;
  note?: string;
  items: string[];
}

export const stackGroups: StackGroup[] = [
  {
    label: "Frontend",
    note: "interfaces people enjoy",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "TanStack Query","Material UI", "Zustand", "Vite"],
  },
  {
    label: "Backend",
    note: "APIs that stay up",
    items: ["Node.js", "Express", "REST APIs", "Socket.IO", "Zod", "JWT auth", "OAuth"],
  },
  {
    label: "Data & payments",
    note: "where real money lives",
    items: ["MongoDB", "Mongoose", "Paystack", "VTU APIs", "Cloudinary", "Resend"],
  },
  {
    label: "Ship & run",
    note: "from laptop to live",
    items: ["Git & GitHub", "Vercel", "Netlify", "LAN deployment"],
  },
];