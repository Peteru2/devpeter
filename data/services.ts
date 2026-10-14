export interface Service {
  slug: string;
  title: string;
  forWho: string;
  includes: string[];
  proof?: string;
  price?: string; // e.g. "From ₦400k". Empty shows "Custom quote"
  priceNote?: string;
  cta: string;
}

export const services: Service[] = [
  {
    slug: "product",
    title: "Full product build",
    forWho: "For startups and businesses that need a web product built properly, from idea to launch.",
    includes: [
      "MVPs, major features or rebuilds",
      "Auth, payments (Paystack) and dashboards",
      "Admin tools your team can run",
      "API design and integrations",
      "Deployment and launch support",
    ],
    proof: "Like Buydair",
    cta: "Discuss your product",
  },
  {
    slug: "website",
    title: "Business website",
    forWho: "For businesses and organisations that need customers to find them, trust them and get in touch.",
    includes: [
      "Fast, responsive, SEO-ready pages",
      "Menus, bookings, forms or ordering",
      "Content your team can update",
      "Email notifications",
      "Hosting and domain setup",
    ],
    proof: "Like Becca’s Food & Events and True Worshippers Church",
    cta: "Build my website",
  },
  {
    slug: "support",
    title: "Ongoing engineering",
    forWho: "For teams that need reliable extra hands to ship consistently.",
    includes: [
      "New features and improvements",
      "Bug fixes and maintenance",
      "Performance and reliability work",
      "Code reviews",
      "Clear weekly updates",
    ],
    priceNote: "Monthly or contract",
    cta: "Work with me",
  },
];

export const budgetOptions = ["Under ₦500k", "₦500k – ₦1.5M", "₦1.5M+", "Paying in USD", "Not sure yet"];